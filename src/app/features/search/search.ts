import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  takeUntil,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { GithubService } from '../../core/services/github';
import { SearchStateService } from '../../core/services/search-state';
import { RepoCard } from '../../shared/components/repo-card/repo-card';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DecimalPipe, RepoCard],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private readonly destroy$ = new Subject<void>();

  private readonly githubService = inject(GithubService);
  private readonly searchState = inject(SearchStateService);
  private readonly router = inject(Router);

  // expose signals to template
  results = this.searchState.results;
  isLoading = this.searchState.isLoading;
  error = this.searchState.error;
  totalCount = this.searchState.totalCount;
  hasResults = this.searchState.hasResults;

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400), // wait 400ms after user stops typing
        distinctUntilChanged(), // ignore if same value as before
        switchMap((query) => {
          // cancel previous request, start new one
          if (!query || query.trim().length < 2) {
            this.searchState.reset();
            return of(null);
          }
          this.searchState.setLoading(true);
          return this.githubService.searchRepositories(query).pipe(
            catchError((err) => {
              this.searchState.setError('Something went wrong. Please try again.');
              return of(null);
            }),
          );
        }),
        takeUntil(this.destroy$), // auto-unsubscribe on component destroy
      )
      .subscribe((response) => {
        if (response) {
          this.searchState.setResults(response.items, response.total_count);
        }
        this.searchState.setLoading(false);
      });
  }

  navigateToRepo(owner: string, name: string): void {
    this.router.navigate(['/repo', owner, name]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
