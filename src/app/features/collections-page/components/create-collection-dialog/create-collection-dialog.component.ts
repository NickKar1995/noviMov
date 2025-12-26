import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

type CollectionForm = {
  title: FormControl<string>;
  description: FormControl<string>;
};

@Component({
  selector: 'app-create-collection-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-collection-dialog.component.html',
  styleUrl: './create-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCollectionDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateCollectionDialogComponent>);

  readonly isSubmitting = signal(false);

  readonly form = new FormGroup<CollectionForm>({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
  });

  onCancel(): void {
    if (!this.isSubmitting()) {
      this.dialogRef.close();
    }
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const formValue = this.form.getRawValue();
      this.dialogRef.close(formValue);
    }
  }

  getTitleError(): string {
    const control = this.form.controls.title;
    if (control.hasError('required')) {
      return 'Title is required';
    }
    if (control.hasError('minlength')) {
      return 'Title must be at least 3 characters';
    }
    if (control.hasError('maxlength')) {
      return 'Title must not exceed 50 characters';
    }
    return '';
  }

  getDescriptionError(): string {
    const control = this.form.controls.description;
    if (control.hasError('maxlength')) {
      return 'Description must not exceed 200 characters';
    }
    return '';
  }
}
