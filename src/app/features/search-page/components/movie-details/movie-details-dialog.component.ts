import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { MovieDetails } from '../../models/MovieDetails';
import { GuestSessionService } from '../../../../core/services/guest-session.service';
import type { SpokenLanguage } from '../../models/SpokenLanguge';

export type MovieDetailsDialogData = {
  movieId: number;
};

@Component({
  selector: 'app-movie-details-dialog',
  imports: [
    DecimalPipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSliderModule,
    MatSnackBarModule,
    FormsModule,
  ],
  templateUrl: './movie-details-dialog.component.html',
  styleUrl: './movie-details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<MovieDetailsDialogComponent>);
  private readonly data = inject<MovieDetailsDialogData>(MAT_DIALOG_DATA);
  private readonly movieService = inject(MovieService);
  private readonly guestSessionService = inject(GuestSessionService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly movie = signal<MovieDetails | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly userRating = signal(5);
  protected readonly isSubmittingRating = signal(false);

  protected readonly hasError = computed(() => this.error() !== null);
  protected readonly formattedBudget = computed(() => {
    const budget = this.movie()?.budget;
    return budget ? this.formatCurrency(budget) : 'N/A';
  });
  protected readonly formattedRevenue = computed(() => {
    const revenue = this.movie()?.revenue;
    return revenue ? this.formatCurrency(revenue) : 'N/A';
  });
  protected readonly formattedDate = computed(() => {
    const date = this.movie()?.release_date;
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  });
  protected readonly languages = computed(() => {
    return (
      this.movie()
        ?.spoken_languages.map((lang: SpokenLanguage) => lang.english_name)
        .join(', ') || 'N/A'
    );
  });

  ngOnInit(): void {
    this.loadMovieDetails();
  }

  private loadMovieDetails(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.movieService
      .getMovieDetails(this.data.movieId)
      .pipe(
        catchError((err) => {
          console.error('Failed to load movie details:', err);
          this.error.set('Failed to load movie details. Please try again.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((movie: MovieDetails | null) => {
        if (movie) {
          this.movie.set(movie);
        }
      });
  }

  protected getImageUrl(path: string | null): string {
    return this.movieService.getImageUrl(path, 'w780');
  }

  protected onClose(): void {
    this.dialogRef.close();
  }

  protected onSubmitRating(): void {
    const rating = this.userRating();
    if (rating < 0.5 || rating > 10) {
      this.snackBar.open('Rating must be between 0.5 and 10', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmittingRating.set(true);

    this.guestSessionService
      .getOrCreateSession()
      .pipe(
        switchMap((sessionId) => {
          if (!sessionId) {
            throw new Error('Failed to create guest session');
          }
          return this.movieService.rateMovie(this.data.movieId, sessionId, rating);
        }),
        catchError((err) => {
          console.error('Failed to submit rating:', err);
          this.snackBar.open('Failed to submit rating. Please try again.', 'Close', {
            duration: 3000,
          });
          return of(null);
        }),
        finalize(() => this.isSubmittingRating.set(false)),
      )
      .subscribe((response: { success: boolean } | null) => {
        if (response?.success) {
          this.snackBar.open('Rating submitted successfully!', 'Close', { duration: 3000 });
        }
      });
  }

  protected formatRatingValue(value: number): string {
    return value.toFixed(1);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
