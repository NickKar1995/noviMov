import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appAlphanumeric]',
  // Here I am using it as a validator with multi: true to allow multiple validators, in case I forget
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlphanumericDirective,
      multi: true
    }
  ]
})
export class AlphanumericDirective implements Validator {
  readonly minLength = input<number>(3);

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    // Check minimum length
    if (value.length < this.minLength()) {
      errors['minlength'] = {
        requiredLength: this.minLength(),
        actualLength: value.length
      };
    }

    // Check alphanumeric (letters, numbers and spaces only)
    const alphanumericRegex = /^[a-zA-Z0-9\s]*$/;
    if (!alphanumericRegex.test(value)) {
      errors['alphanumeric'] = {
        value: value
      };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}
