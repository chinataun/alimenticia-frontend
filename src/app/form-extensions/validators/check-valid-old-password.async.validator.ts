import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
  } from '@angular/forms';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { UserService } from 'src/app/user/user.service';
  
  export function checkValidOldPasword(
    userService: UserService
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return userService
        .isOldPasswordValid(control.value)
        .pipe(
          map((isValid) =>
            isValid ? null : { checkValidOldPasword: true }
          )
        );
    };
  }