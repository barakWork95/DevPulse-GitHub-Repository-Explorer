import { Component, computed, inject, input, output } from '@angular/core';
import { Repository } from '../../../models/github.models';
import { FormatNumberPipe } from '../../pipes/format-number-pipe';
import { FavoritesService } from '../../../core/services/favorites';

@Component({
  selector: 'app-repo-card',
  standalone: true,
  imports: [FormatNumberPipe],
  templateUrl: './repo-card.html',
  styleUrl: './repo-card.scss',
})
export class RepoCard {
  repo = input.required<Repository>();
  selected = output<Repository>();

  readonly favoritesService = inject(FavoritesService);

  isFavorite = computed(() => this.favoritesService.isFavorite(this.repo().id));

  onSelect(): void {
    this.selected.emit(this.repo());
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation(); // prevent card click
    this.favoritesService.toggleFavorite(this.repo());
  }
}
