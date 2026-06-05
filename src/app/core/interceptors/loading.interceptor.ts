import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { SearchStateService } from '../services/search-state';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const searchState = inject(SearchStateService);

  searchState.setLoading(true);

  return next(req).pipe(finalize(() => searchState.setLoading(false)));
};
