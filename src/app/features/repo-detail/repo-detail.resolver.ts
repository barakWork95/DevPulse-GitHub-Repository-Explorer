import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GithubService } from '../../core/services/github';
import { Repository } from '../../models/github.models';

// Functional resolver — no class needed, just inject() inside the function
export const repoDetailResolver: ResolveFn<Repository> = (route) => {
  const githubService = inject(GithubService);
  const owner = route.paramMap.get('owner')!;
  const name = route.paramMap.get('name')!;

  return githubService.getRepository(owner, name);
};
