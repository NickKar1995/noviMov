import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { CollectionsService } from '../../../collections-page/services/collections.service';
import { Movie } from '../../models/Movie';

export type AddToCollectionDialogData = {
  movies: Movie[];
};

@Component({
  selector: 'app-add-to-collection-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatListModule, MatRadioModule],
  templateUrl: './add-to-collection-dialog.component.html',
  styleUrl: './add-to-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddToCollectionDialogComponent>);
  protected readonly data = inject<AddToCollectionDialogData>(MAT_DIALOG_DATA);
  protected readonly collectionsService = inject(CollectionsService);

  protected readonly selectedCollectionId = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly collections = this.collectionsService.collections;

  protected onCancel(): void {
    if (!this.isSubmitting()) {
      this.dialogRef.close();
    }
  }

  protected onAdd(): void {
    const collectionId = this.selectedCollectionId();
    if (collectionId && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.collectionsService.addMoviesToCollection(collectionId, this.data.movies);
      this.dialogRef.close({ collectionId, added: true });
    }
  }

  protected onSelectCollection(collectionId: string): void {
    this.selectedCollectionId.set(collectionId);
  }

  protected getMovieCountText(): string {
    const count = this.data.movies.length;
    return count === 1 ? '1 movie' : `${count} movies`;
  }

  protected hasCollections(): boolean {
    return this.collections().length > 0;
  }
}
