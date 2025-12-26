import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CollectionsService } from './services/collections.service';
import {
  CreateCollectionDialogComponent
} from './components/create-collection-dialog/create-collection-dialog.component';
import { MovieCollection } from './models/MovieCollection';
import { COLLECTION_DIALOG_CONFIG } from '../../core/constants/dialog-config.constants';

@Component({
  selector: 'app-collections-page',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './collections-page.component.html',
  styleUrl: './collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsPageComponent {
  private readonly collectionsService = inject(CollectionsService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly collections = this.collectionsService.collections;
  protected readonly hasCollections = computed(() => this.collections().length > 0);

  protected onCreateCollection(): void {
    const dialogRef = this.dialog.open(CreateCollectionDialogComponent, COLLECTION_DIALOG_CONFIG);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newCollection = this.collectionsService.createCollection({
          title: result.title,
          description: result.description,
        });
        this.router.navigate(['/collections', newCollection.id]);
      }
    });
  }

  protected onViewCollection(collection: MovieCollection): void {
    this.router.navigate(['/collections', collection.id]);
  }

  protected getMovieCount(collection: MovieCollection): number {
    return collection.movies.length;
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
