import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/Movie';

@Component({
  selector: 'app-movie-card',
  imports: [DecimalPipe, MatCardModule, MatCheckboxModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent {
  private readonly movieService = inject(MovieService);

  readonly movie = input.required<Movie>();
  readonly selected = input<boolean>(false);
  readonly movieClick = output<Movie>();
  readonly selectionChange = output<{ movie: Movie; selected: boolean }>();

  protected getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path);
  }

  protected onMovieClick(): void {
    this.movieClick.emit(this.movie());
  }

  protected onSelectionChange(checked: boolean): void {
    this.selectionChange.emit({ movie: this.movie(), selected: checked });
  }
}
