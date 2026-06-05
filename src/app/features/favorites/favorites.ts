import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites';
import { RepoCard } from '../../shared/components/repo-card/repo-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, RepoCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  favorites = this.favoritesService.favorites;
  isEmpty = this.favoritesService.isEmpty;
  count = this.favoritesService.count;

  navigateToRepo(owner: string, name: string): void {
    this.router.navigate(['/repo', owner, name]);
  }
}
