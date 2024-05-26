import {
    AbstractControl,
    FormControl,
    ValidationErrors,
    ValidatorFn,
  } from '@angular/forms';
  
  export const emptyRecipeDontPublish: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pasos = group.get('pasos') as FormControl;
    const ingredientes = group.get('ingredientes') as FormControl;
    const status = group.get('status') as FormControl;
   
    if (status && status.value === true) {
      if (pasos && pasos.value.length === 0 ||
        ingredientes && ingredientes.value.length === 0) {
          return  { emptyRecipeDontPublish: true };
      }
    }
    return null
  };