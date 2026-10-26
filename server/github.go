package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"
)

const (
	githubAPI      = "https://api.github.com"
	repoCacheTTL   = time.Hour
	repoCacheLimit = 256
)

var (
	githubOwner = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9-]{0,38}$`)
	githubRepo  = regexp.MustCompile(`^[A-Za-z0-9._-]{1,100}$`)
)

// githubOwners are the accounts whose repositories the site's cards link to,
// in lower case. Lookups for anyone else 404, so strangers can't use the
// endpoint (or the token's rate limit) to look up arbitrary repositories. Add
// an owner here when a card links to a new one.
var githubOwners = map[string]bool{
	"bmck039":    true,
	"mattvolkin": true,
	"gwastro":    true,
}

// repoInfo is the subset of GitHub's repository metadata the frontend uses.
type repoInfo struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	HTMLURL     string   `json:"html_url"`
	Topics      []string `json:"topics"`
	Language    string   `json:"language"`
}

type repoEntry struct {
	info    *repoInfo // nil when GitHub says the repo doesn't exist
	fetched time.Time
}

// repoCall is a GitHub lookup in progress. Visitors who ask for the same
// repository while it runs wait for it instead of starting their own.
type repoCall struct {
	done  chan struct{}
	entry repoEntry
	err   error
}

// githubRepos proxies repository lookups to the GitHub API and caches them, so
// visitors never hit GitHub's rate limit themselves. Without a token GitHub
// allows 60 lookups an hour; set GITHUB_TOKEN to raise that.
type githubRepos struct {
	client *http.Client
	token  string

	mu    sync.Mutex
	cache map[string]repoEntry
	calls map[string]*repoCall
}

func newGithubRepos(token string) *githubRepos {
	return &githubRepos{
		client: &http.Client{Timeout: 5 * time.Second},
		token:  token,
		cache:  make(map[string]repoEntry),
		calls:  make(map[string]*repoCall),
	}
}

// ServeHTTP handles GET /api/github/{owner}/{repo}.
func (g *githubRepos) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	owner, repo := r.PathValue("owner"), r.PathValue("repo")
	if !githubOwner.MatchString(owner) || !githubRepo.MatchString(repo) || strings.Trim(repo, ".") == "" ||
		!githubOwners[strings.ToLower(owner)] {
		http.NotFound(w, r)
		return
	}
	key := strings.ToLower(owner + "/" + repo)

	g.mu.Lock()
	entry, cached := g.cache[key]
	g.mu.Unlock()

	if !cached || time.Since(entry.fetched) > repoCacheTTL {
		fresh, err := g.refresh(r.Context(), key, owner, repo)
		switch {
		case err == nil:
			entry = fresh
		case r.Context().Err() != nil:
			// The visitor left. The lookup carries on and is cached for the next one.
			return
		case cached:
			// GitHub is unreachable or rate limiting us: stale data beats none.
			log.Printf("github: %s: %v (serving cached copy)", key, err)
		default:
			log.Printf("github: %s: %v", key, err)
			http.Error(w, "GitHub lookup failed", http.StatusBadGateway)
			return
		}
	}

	if entry.info == nil {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "public, max-age=600")
	json.NewEncoder(w).Encode(entry.info)
}

// refresh looks key up on GitHub and caches the result. The lookup runs on its
// own rather than as part of the visitor's request, so it still finishes (and
// is cached) if they leave, and visitors who ask at the same time share it.
func (g *githubRepos) refresh(ctx context.Context, key, owner, repo string) (repoEntry, error) {
	g.mu.Lock()
	call, running := g.calls[key]
	if !running {
		call = &repoCall{done: make(chan struct{})}
		g.calls[key] = call
		go func() {
			info, err := g.fetch(owner, repo)
			call.entry, call.err = repoEntry{info: info, fetched: time.Now()}, err
			if err == nil {
				g.store(key, call.entry)
			}
			g.mu.Lock()
			delete(g.calls, key)
			g.mu.Unlock()
			close(call.done)
		}()
	}
	g.mu.Unlock()

	select {
	case <-call.done:
		return call.entry, call.err
	case <-ctx.Done():
		return repoEntry{}, ctx.Err()
	}
}

// fetch returns (nil, nil) when the repository doesn't exist or is private.
// The client's timeout bounds it.
func (g *githubRepos) fetch(owner, repo string) (*repoInfo, error) {
	req, err := http.NewRequest(http.MethodGet, githubAPI+"/repos/"+owner+"/"+repo, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "benmckallip.com")
	if g.token != "" {
		req.Header.Set("Authorization", "Bearer "+g.token)
	}

	resp, err := g.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	switch resp.StatusCode {
	case http.StatusOK:
	case http.StatusNotFound:
		return nil, nil
	default:
		return nil, fmt.Errorf("unexpected status %s", resp.Status)
	}

	var body struct {
		repoInfo
		Private bool `json:"private"`
	}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&body); err != nil {
		return nil, err
	}
	if body.Private {
		// GitHub only shows private repositories to a token that can read
		// them. Treat them as missing so the token never leaks them.
		return nil, nil
	}
	info := &body.repoInfo
	if info.Topics == nil {
		info.Topics = []string{}
	}
	return info, nil
}

func (g *githubRepos) store(key string, entry repoEntry) {
	g.mu.Lock()
	defer g.mu.Unlock()

	if _, exists := g.cache[key]; !exists && len(g.cache) >= repoCacheLimit {
		var oldest string
		for k, e := range g.cache {
			if oldest == "" || e.fetched.Before(g.cache[oldest].fetched) {
				oldest = k
			}
		}
		delete(g.cache, oldest)
	}
	g.cache[key] = entry
}
