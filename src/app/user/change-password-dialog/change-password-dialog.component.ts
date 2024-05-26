import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { ChangePassword } from '../model/user-profile.interface';
import { passwordsMustBeEqual } from 'src/app/form-extensions';
import { checkValidOldPasword } from 'src/app/form-extensions/validators/check-valid-old-password.async.validator';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordDialogComponent {

  changePasswordForm = new FormGroup(
    {
      oldPassword: new FormControl('', {
        asyncValidators: checkValidOldPasword(this.userService),
        updateOn: 'blur',
      }),
      password: new FormControl('', [Validators.required]),
      password_confirm: new FormControl('', [Validators.required]),
    },
    {
      validators: passwordsMustBeEqual,
    }
  );
  // newUsernameControl = new FormControl('miNombreActual', {
  //   asyncValidators: checkValidOldPasword(this.userService),
  //   updateOn: 'blur',
  // });
  get oldPasswordControl(): FormControl {
    return this.changePasswordForm.get('oldPassword') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.changePasswordForm.get('password') as FormControl;
  }

  get passwordConfirmControl(): FormControl {
    return this.changePasswordForm.get('password_confirm') as FormControl;
  }


  constructor(
      public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
      private toastr: ToastrService, private userService: UserService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePassword(): void {

    const oldPassword = this.changePasswordForm.get('oldPassword')?.value; 
    const newPassword = this.changePasswordForm.get('password')?.value;
    const newPasswordRepeat = this.changePasswordForm.get('password_confirm')?.value;

    const changePasswordCredentials: ChangePassword = {
      oldPassword: oldPassword ?? '',
      newPassword: newPassword ?? '',
      newPasswordRepeat: newPasswordRepeat ?? '',
    };

    this.userService.changePassword(changePasswordCredentials).subscribe({
      next: (response) => {
        this.toastr.success(`${response.msg}`, 'Change Password');
        this.dialogRef.close(this.changePasswordForm.value);
      },
      error: () => {
        this.toastr.error('Error al cambiar la contraseña');
      }
    })
      

  }




}
