import { Injectable, signal, computed } from '@angular/core';
import { Repository } from '../../models/github.models';

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  // --- state signals ---
  readonly results = signal<Repository[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly totalCount = signal<number>(0);

  // --- computed signals (derived state) ---
  readonly hasResults = computed(() => this.results().length > 0);
  readonly isEmpty = computed(
    () => !this.isLoading() && !this.hasResults() && this.error() === null,
  );

  // --- mutations ---
  setResults(items: Repository[], total: number): void {
    this.results.set(items);
    this.totalCount.set(total);
    this.error.set(null);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  setError(message: string): void {
    this.error.set(message);
    this.isLoading.set(false);
  }

  reset(): void {
    this.results.set([]);
    this.totalCount.set(0);
    this.error.set(null);
    this.isLoading.set(false);
  }
}
