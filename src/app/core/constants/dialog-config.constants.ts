import { MatDialogConfig } from '@angular/material/dialog';

/**
 * Shared Material Dialog configuration presets
 * Use these constants to maintain consistent dialog sizes across the application
 */

/**
 * Standard size for movie details dialogs
 */
export const MOVIE_DETAILS_DIALOG_CONFIG: Partial<MatDialogConfig> = {
  width: '90vw',
  maxWidth: '1000px',
  maxHeight: '90vh',
  panelClass: 'movie-details-dialog',
} as const;

/**
 * Standard size for collection management dialogs
 */
export const COLLECTION_DIALOG_CONFIG: Partial<MatDialogConfig> = {
  width: '600px',
  maxWidth: '90vw',
  disableClose: true,
} as const;

/**
 * Compact size for simple dialogs
 */
export const COMPACT_DIALOG_CONFIG: Partial<MatDialogConfig> = {
  width: '500px',
  maxWidth: '90vw',
} as const;
