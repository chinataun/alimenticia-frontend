import {
    AbstractControl,
    FormControl,
    ValidationErrors,
    ValidatorFn,
  } from '@angular/forms';
  
  export const passwordsMustBeEqual: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const newPassword = group.get('password') as FormControl;
    const passwordConfirm = group.get('password_confirm') as FormControl;
  
    return newPassword.value === passwordConfirm.value
      ? null
      : { passwordsMustBeEqual: true };
  };