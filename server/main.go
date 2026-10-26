package main

import (
	"context"
	"errors"
	"flag"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path"
	"strings"
	"syscall"
	"time"
)

func main() {
	healthcheck := flag.Bool("healthcheck", false, "probe the running server and exit 0 if it is healthy")
	flag.Parse()

	port := env("PORT", "8080")
	if *healthcheck {
		os.Exit(probe("http://127.0.0.1:" + port + "/healthz"))
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok\n"))
	})
	// API routes go here. Unknown /api/ paths 404 instead of falling through to the frontend.
	mux.Handle("GET /api/github/{owner}/{repo}", newGithubRepos(os.Getenv("GITHUB_TOKEN")))
	mux.Handle("GET /api/", http.NotFoundHandler())
	// GET also matches HEAD. Other methods, CONNECT included, get 405.
	mux.Handle("GET /", frontend(os.DirFS(env("STATIC_DIR", "../frontend/build"))))

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Printf("listening on %s", srv.Addr)
		if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatal(err)
		}
	}()

	<-ctx.Done()
	log.Print("shutting down")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal(err)
	}
}

// frontend serves the built pages. A request for /about is answered with
// about.html (or about/index.html), and anything that doesn't resolve to a
// file gets 404.html if the site has one.
func frontend(dist fs.FS) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
		if name == "" {
			name = "index.html"
		}

		for _, candidate := range []string{name, name + ".html", name + "/index.html"} {
			info, err := fs.Stat(dist, candidate)
			if err != nil || info.IsDir() {
				continue
			}
			if strings.HasPrefix(candidate, "assets/") {
				// Vite puts a content hash in these filenames, so they never change.
				w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			} else {
				w.Header().Set("Cache-Control", "no-cache")
			}
			http.ServeFileFS(w, r, dist, candidate)
			return
		}

		page, err := fs.ReadFile(dist, "404.html")
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Cache-Control", "no-cache")
		w.WriteHeader(http.StatusNotFound)
		w.Write(page)
	})
}

func probe(url string) int {
	client := http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return 1
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return 1
	}
	return 0
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
