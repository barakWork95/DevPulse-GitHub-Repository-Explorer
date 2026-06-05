import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SearchStateService } from '../services/search-state';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const searchState = inject(SearchStateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Something went wrong.';

      if (error.status === 403) message = 'GitHub API rate limit exceeded. Try again in a minute.';
      else if (error.status === 404) message = 'Repository not found.';
      else if (error.status === 0) message = 'Network error. Check your connection.';

      searchState.setError(message);
      return throwError(() => error);
    }),
  );
};
