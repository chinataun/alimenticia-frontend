import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SigninCredentials } from '../login-credentials';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { passwordsMustBeEqual } from 'src/app/form-extensions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  
  signinForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cp: new FormControl('', [Validators.required, Validators.minLength(5), Validators.min(0)]),
      password: new FormControl('', Validators.required),
      password_confirm: new FormControl('', Validators.required),

    },
    passwordsMustBeEqual
  );
  errorMessage?: string;
  loading: boolean = false;
  // contrasena = new FormControl(null, [
  //   Validators.required,
  //   Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/),
  // ]);
  // confirmarContrasena = new FormControl(null, [
  //   Validators.required,
  //   Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/),
  // ]);

  get usernameControl(): FormControl {
    return this.signinForm.get('username') as FormControl;
  }

  get emailControl(): FormControl {
    return this.signinForm.get('email') as FormControl;
  }

  get cpControl(): FormControl {
    return this.signinForm.get('cp') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.signinForm.get('password') as FormControl;
  }

  get passwordConfirmControl(): FormControl {
    return this.signinForm.get('password_confirm') as FormControl;
  }


  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private authService: AuthService, 
  ) {}

  matchPassword(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmarContrasena')?.value;
    if (password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null; 
  }

  signIn(): void {
    const username = this.signinForm.value.username || ''; 
    const email = this.signinForm.value.email || ''; 
    const cp = this.signinForm.value.cp || '';
    const password = this.signinForm.value.password || '';
    const password_confirm = this.signinForm.value.password_confirm || '';
    const credentials: SigninCredentials = { username, email, cp, password, password_confirm };
    this.signinForm.markAsPending();


    this.authService.signIn(credentials).subscribe({
      next: (respuesta) => {
        this.loading = false;
        this.toastr.success(`${respuesta.msg} `, 'Usuario registrado y logado');
        
        this.authService.authenticate(respuesta.token);

        
        // this.router.navigate(['/login']);
        this.router.navigate(['']);
      },
//      error: () => this.signinForm.setErrors({ invalidCredentials: true }),
      error: (error) => {
        this.loading = false;
        this.toastr.error(`${error.error.msg}`, 'Usuario NO registrado');
        console.error('Error al registrar usuario:', error);
      },
    });
  }
  
}
