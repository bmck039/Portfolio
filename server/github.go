package main

import (
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

// githubRepos proxies repository lookups to the GitHub API and caches them, so
// visitors never hit GitHub's rate limit themselves. Without a token GitHub
// allows 60 lookups an hour; set GITHUB_TOKEN to raise that.
type githubRepos struct {
	client *http.Client
	token  string

	mu    sync.Mutex
	cache map[string]repoEntry
}

func newGithubRepos(token string) *githubRepos {
	return &githubRepos{
		client: &http.Client{Timeout: 5 * time.Second},
		token:  token,
		cache:  make(map[string]repoEntry),
	}
}

// ServeHTTP handles GET /api/github/{owner}/{repo}.
func (g *githubRepos) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	owner, repo := r.PathValue("owner"), r.PathValue("repo")
	if !githubOwner.MatchString(owner) || !githubRepo.MatchString(repo) || strings.Trim(repo, ".") == "" {
		http.NotFound(w, r)
		return
	}
	key := strings.ToLower(owner + "/" + repo)

	g.mu.Lock()
	entry, cached := g.cache[key]
	g.mu.Unlock()

	if !cached || time.Since(entry.fetched) > repoCacheTTL {
		info, err := g.fetch(r, owner, repo)
		switch {
		case err == nil:
			entry = repoEntry{info: info, fetched: time.Now()}
			g.store(key, entry)
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

// fetch returns (nil, nil) when the repository doesn't exist or is private.
func (g *githubRepos) fetch(r *http.Request, owner, repo string) (*repoInfo, error) {
	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, githubAPI+"/repos/"+owner+"/"+repo, nil)
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

	info := &repoInfo{}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(info); err != nil {
		return nil, err
	}
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
