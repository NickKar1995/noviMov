import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CollectionsService } from '../../services/collections.service';
import { Movie } from '../../../search-page/models/Movie';
import {
  MovieCardComponent
} from '../../../search-page/components/movie-card/movie-card.component';
import {
  MovieDetailsDialogComponent
} from '../../../search-page/components/movie-details/movie-details-dialog.component';
import { MovieCollection } from '../../models/MovieCollection';

@Component({
  selector: 'app-collection-details-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MovieCardComponent,
    RouterLink,
  ],
  templateUrl: './collection-details-page.component.html',
  styleUrl: './collection-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionDetailsPageComponent implements OnInit {
  private readonly collectionsService = inject(CollectionsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly collection = signal<MovieCollection | null>(null);
  protected readonly notFound = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundCollection = this.collectionsService.getCollection(id);
      if (foundCollection) {
        this.collection.set(foundCollection);
      } else {
        this.notFound.set(true);
      }
    } else {
      this.notFound.set(true);
    }
  }

  protected onBack(): void {
    this.router.navigate(['/collections']);
  }

  protected onDeleteCollection(): void {
    const currentCollection = this.collection();
    if (currentCollection) {
      if (confirm(`Are you sure you want to delete "${currentCollection.title}"?`)) {
        this.collectionsService.deleteCollection(currentCollection.id);
        this.router.navigate(['/collections']);
      }
    }
  }

  protected onRemoveMovie(movie: Movie): void {
    const currentCollection = this.collection();
    if (currentCollection) {
      this.collectionsService.removeMovieFromCollection(currentCollection.id, movie.id);
      const updated = this.collectionsService.getCollection(currentCollection.id);
      this.collection.set(updated ?? null);
    }
  }

  protected onViewMovieDetails(movie: Movie): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { movieId: movie.id },
    });
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  protected getMovieCount(): number {
    return this.collection()?.movies.length ?? 0;
  }
}
