import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, filter, of, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MovieService } from './services/movie.service';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { AlphanumericDirective } from '../../core/directives/alphanumeric.directive';
import { Movie } from './models/Movie';
import { SearchResponse } from './models/SearchResponse';
import {
  COLLECTION_DIALOG_CONFIG,
  MOVIE_DETAILS_DIALOG_CONFIG,
} from '../../core/constants/dialog-config.constants';
import {
  MovieDetailsDialogComponent,
} from './components/movie-details/movie-details-dialog.component';
import {
  AddToCollectionDialogComponent,
} from './components/add-to-collection-dialog/add-to-collection-dialog.component';
import { getPaginationPages, isValidPageChange } from './utils/pagination.helper';

@Component({
  selector: 'app-search-page',
  imports: [
    AlphanumericDirective,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MovieCardComponent,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly searchSubject = new Subject<{ query: string; page: number }>();

  protected readonly searchQuery = signal('');
  protected readonly movies = signal<Movie[]>([]);
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(0);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedMovies = signal<Set<number>>(new Set());

  protected readonly hasResults = computed(() => this.movies().length > 0);
  protected readonly hasError = computed(() => this.error() !== null);
  protected readonly canAddToCollection = computed(() => this.selectedMovies().size > 0);
  protected readonly selectedCount = computed(() => this.selectedMovies().size);

  constructor() {
    this.setupSearch();
    this.setupRouteListener();
  }

  private setupRouteListener(): void {
    this.route.queryParams
      .pipe(
        filter((params) => !!params['movieId']),
        takeUntilDestroyed(),
      )
      .subscribe((params) => {
        this.openMovieDialog(+params['movieId']);
      });
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        switchMap(({ query, page }) => {
          this.isLoading.set(true);
          this.error.set(null);
          return this.movieService.searchMovies(query, page).pipe(
            catchError((err) => {
              this.error.set('Failed to search movies. Please try again.');
              console.error('Search error:', err);
              return of({
                page: 0,
                results: [],
                total_pages: 0,
                total_results: 0,
              } as SearchResponse);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.movies.set(response.results);
        this.totalPages.set(response.total_pages);
        this.currentPage.set(response.page);
        this.isLoading.set(false);
      });
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    if (query.length >= 3) {
      this.currentPage.set(1);
      this.selectedMovies.set(new Set());
      this.searchSubject.next({ query, page: 1 });
    } else {
      this.movies.set([]);
      this.totalPages.set(0);
    }
  }

  protected onPageChange(page: number): void {
    if (!isValidPageChange(page, this.currentPage(), this.totalPages())) {
      return;
    }
    this.currentPage.set(page);
    this.searchSubject.next({ query: this.searchQuery(), page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected onMovieClick(movie: Movie): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { movieId: movie.id },
      queryParamsHandling: 'merge',
    });
  }

  private openMovieDialog(movieId: number): void {
    const dialogRef = this.dialog.open(MovieDetailsDialogComponent, {
      ...MOVIE_DETAILS_DIALOG_CONFIG,
      data: { movieId },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { movieId: null },
        queryParamsHandling: 'merge',
      });
    });
  }

  protected onSelectionChange(event: { movie: Movie; selected: boolean }): void {
    const selectedSet = new Set(this.selectedMovies());
    if (event.selected) {
      selectedSet.add(event.movie.id);
    } else {
      selectedSet.delete(event.movie.id);
    }
    this.selectedMovies.set(selectedSet);
  }

  protected isMovieSelected(movieId: number): boolean {
    return this.selectedMovies().has(movieId);
  }

  protected onAddToCollection(): void {
    const selectedMoviesList = this.movies().filter((m) => this.selectedMovies().has(m.id));
    
    const dialogRef = this.dialog.open(AddToCollectionDialogComponent, {
      ...COLLECTION_DIALOG_CONFIG,
      data: { movies: selectedMoviesList },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.added) {
        this.selectedMovies.set(new Set());
      }
    });
  }

  protected getPageNumbers(): number[] {
    return getPaginationPages(this.currentPage(), this.totalPages());
  }
}
