import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Repository, SearchResponse } from '../../models/github.models';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.github.com';

  searchRepositories(
    query: string,
    page: number = 1,
    perPage: number = 12,
  ): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('sort', 'stars')
      .set('order', 'desc')
      .set('page', page)
      .set('per_page', perPage);

    return this.http.get<SearchResponse>(`${this.baseUrl}/search/repositories`, { params });
  }

  getRepository(owner: string, name: string): Observable<Repository> {
    return this.http.get<Repository>(`${this.baseUrl}/repos/${owner}/${name}`);
  }

  getReadme(owner: string, name: string): Observable<string> {
    return this.http
      .get<{ content: string; encoding: string }>(`${this.baseUrl}/repos/${owner}/${name}/readme`)
      .pipe(
        map((res) => {
          const decoded = atob(res.content.replace(/\n/g, ''));
          return decodeURIComponent(escape(decoded)); // fix encoding artifacts
        }),
        catchError(() => of('No README available.')),
      );
  }
}
