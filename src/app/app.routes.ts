import { Routes } from '@angular/router';
import { repoDetailResolver } from './features/repo-detail/repo-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then((m) => m.Search),
  },
  {
    path: 'repo/:owner/:name',
    loadComponent: () => import('./features/repo-detail/repo-detail').then((m) => m.RepoDetail),
    resolve: { repo: repoDetailResolver },
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites').then((m) => m.Favorites),
  },
  {
    path: '**',
    redirectTo: 'search',
  },
];
