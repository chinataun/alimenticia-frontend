import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** A hero's name can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmarContrasena')?.value;
        if (password !== confirmPassword) {
          return { 'passwordMismatch': true };
        }
        return null; // Agregar esta línea al final
    };
  }