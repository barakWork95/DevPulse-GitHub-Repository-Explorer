import { Injectable, signal, computed, effect } from '@angular/core';
import { Repository } from '../../models/github.models';

const STORAGE_KEY = 'devpulse_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly favorites = signal<Repository[]>(this.loadFromStorage());

  // computed — auto-updates when favorites signal changes
  readonly count = computed(() => this.favorites().length);
  readonly isEmpty = computed(() => this.favorites().length === 0);

  constructor() {
    // effect() runs whenever favorites signal changes — auto-syncs to localStorage
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites()));
    });
  }

  isFavorite(id: number): boolean {
    return this.favorites().some((r) => r.id === id);
  }

  toggleFavorite(repo: Repository): void {
    if (this.isFavorite(repo.id)) {
      this.favorites.update((current) => current.filter((r) => r.id !== repo.id));
    } else {
      this.favorites.update((current) => [...current, repo]);
    }
  }

  private loadFromStorage(): Repository[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
