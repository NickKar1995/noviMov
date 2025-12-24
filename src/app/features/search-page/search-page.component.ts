import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MovieDetailsDialogComponent } from './components/movie-details/movie-details-dialog.component';

@Component({
  selector: 'app-search-page',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    MovieCardComponent,
    AlphanumericDirective
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {
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

  ngOnInit(): void {
    // Check if there's a movieId in the query params on init
    const movieId = this.route.snapshot.queryParams['movieId'];
    if (movieId) {
      this.openMovieDialog(+movieId);
    }
  }

  private setupRouteListener(): void {
    this.route.queryParams
      .pipe(
        filter((params) => !!params['movieId']),
        takeUntilDestroyed(),
      )
      .subscribe((params) => {
        const movieId = +params['movieId'];
        if (movieId) {
          this.openMovieDialog(movieId);
        }
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
              return of({ page: 0, results: [], total_pages: 0, total_results: 0 } as SearchResponse);
            })
          );
        }),
        takeUntilDestroyed()
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
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
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
      data: { movieId },
      width: '90vw',
      maxWidth: '1000px',
      maxHeight: '90vh',
      panelClass: 'movie-details-dialog',
    });

    dialogRef.afterClosed().subscribe(() => {
      // Remove movieId query param when dialog closes
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
    // TODO: Open collection selection popup
    console.log('Add to collection:', selectedMoviesList);
  }

  protected getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); 
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1); 
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); 
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); 
        pages.push(total);
      }
    }

    return pages;
  }
}
