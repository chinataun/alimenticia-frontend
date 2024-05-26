import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginCredentials } from '../login-credentials';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  constructor(private authService: AuthService, private toastr: ToastrService) {}

  logIn(): void {
    const email = this.loginForm.value.email || ''; // Asegúrate de manejar el caso en que email sea null o undefined
    const password = this.loginForm.value.password || ''; // Asegúrate de manejar el caso en que password sea null o undefined
    const credentials: LoginCredentials = { email, password }; // Crea un objeto de tipo LoginCredentials con las propiedades email y password
    this.loginForm.markAsPending();
    this.authService.logIn(credentials).subscribe();
  }
}