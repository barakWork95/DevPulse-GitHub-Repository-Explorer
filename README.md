# 🔍 DevPulse — GitHub Repository Explorer

A modern Angular 22 application for searching and exploring GitHub repositories. Built to demonstrate advanced Angular patterns including Signals, RxJS pipelines, lazy loading, HTTP interceptors, and functional resolvers.

**[Live Demo](https://your-demo-url.netlify.app)** · **[GitHub](https://github.com/barakWork95/devpulse)**

---

## ✨ Features

- 🔎 **Real-time search** with debounced RxJS pipeline — no unnecessary API calls
- 📄 **Repo detail page** with live README rendering
- ❤️ **Favorites** — persisted across sessions via localStorage
- 🌙 **Dark / Light theme** toggle with system preference detection
- ⚡ **Lazy loaded routes** — each feature module loads only when needed

---

## 🛠️ Tech Stack

| Technology                  | Why I chose it                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------- |
| **Angular 22**              | Standalone components, no NgModules — cleaner and more maintainable                     |
| **Signals**                 | Reactive state without BehaviorSubject boilerplate — simpler and more performant        |
| **RxJS**                    | `switchMap` + `debounceTime` for search pipeline — cancels stale requests automatically |
| **Lazy Loading**            | `loadComponent()` per route — initial bundle stays small                                |
| **Functional Interceptors** | `HttpInterceptorFn` for global loading & error handling — no class boilerplate          |
| **ResolveFn**               | Pre-fetches repo data before navigation — no loading spinner in detail page             |

---

## 🏗️ Architecture

src/app/
├── core/
│ ├── services/ # GithubService, SearchStateService, FavoritesService, ThemeService
│ └── interceptors/ # LoadingInterceptor, ErrorInterceptor
├── features/
│ ├── search/ # Lazy loaded — RxJS search pipeline
│ ├── repo-detail/ # Lazy loaded — ResolveFn pre-fetch + README render
│ └── favorites/ # Lazy loaded — Signal-based persistence
├── shared/
│ ├── components/ # RepoCard, Navbar
│ └── pipes/ # FormatNumberPipe (1200 → 1.2k)
└── models/ # TypeScript interfaces for GitHub API

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/barakWork95/devpulse.git
cd devpulse

# Install dependencies
npm install

# Start dev server
ng serve
```

Open `http://localhost:4200`

---

## 💡 Key Technical Decisions

**Signals over BehaviorSubject for state** — `SearchStateService` uses `signal()` and `computed()` instead of RxJS subjects. Signals are synchronous, require no subscription cleanup, and integrate directly with Angular's change detection.

**RxJS for the async pipeline** — The search input uses `valueChanges → debounceTime(400) → distinctUntilChanged() → switchMap()`. `switchMap` is critical here: it automatically cancels the previous HTTP request when the user types again, preventing race conditions.

**Functional interceptors** — Both interceptors use `HttpInterceptorFn` instead of class-based `HttpInterceptor`. This allows using `inject()` inside them and avoids the need for a class + `implements` boilerplate.

**ResolveFn over component-level loading** — The repo detail route uses a functional resolver to pre-fetch data before navigation. The component receives data synchronously in `ngOnInit` with no loading state needed.

---

## 📁 What I'd Add Next

- GitHub OAuth for higher API rate limits (60 → 5000 req/hour)
- Pagination with page controls
- Unit tests with Jest + Angular Testing Library
- PWA support for offline favorites access
