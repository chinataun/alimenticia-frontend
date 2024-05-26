import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubmenuComponent } from '../submenu/submenu.component';
import { UserService } from '../user.service';
import { UserProfile } from '../model/user-profile.interface';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SupermercadoFAvoritoComponent } from '../supermercado-favorito/supermercado-favorito.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilComponent {

  user$: Observable<UserProfile | null> = this.userService.user_profile$;
  supermercados: any;

  // Update the type to include null
  imagePreview!: string | ArrayBuffer;
  serverUrl = 'http://localhost:3000/'; 
  isLoading = false; // Nueva propiedad para rastrear el estado de carga de la imagen

  perfilForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    nombre: [''],
    apellidos: [''],
    cp: ['', [Validators.required, Validators.minLength(5), Validators.min(0)]],
    imagen: [''],
  });

  get usernameControl(): FormControl {
    return this.perfilForm.get('username') as FormControl;
  }
  get emailControl(): FormControl {
    return this.perfilForm.get('email') as FormControl;
  }
  get nombreControl(): FormControl {
    return this.perfilForm.get('nombre') as FormControl;
  }
  get apellidosControl(): FormControl {
    return this.perfilForm.get('apellidos') as FormControl;
  }
  get cpControl(): FormControl {
    return this.perfilForm.get('cp') as FormControl;
  }
  get imagenControl(): FormControl {
    return this.perfilForm.get('imagen') as FormControl;
  }

  constructor(private fb: FormBuilder,
    private toastr: ToastrService, 
    private dialog: MatDialog,
    private userService: UserService, 
    private cd: ChangeDetectorRef,
    ) { }


  ngOnInit() {
    this.userService.user_profile$.subscribe(userProfiles => {
      console.log(userProfiles)
      const {imagen,  ...userProfile } = userProfiles as UserProfile;
      this.perfilForm.patchValue(userProfile || {});
      this.imagePreview = this.serverUrl + imagen;
      
    }); 
  }

  imageFile: File | null = null;

  onImageChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (!file) {
      return;
    }
    console.log(file);
    this.imageFile = file;
    const reader = new FileReader();
    this.isLoading = true;
    reader.onload = e => {
      this.imagePreview = reader.result as string | ArrayBuffer;
      this.isLoading = false; // La imagen ha terminado de cargar

      this.cd.detectChanges(); // Detecta los cambios
    };
    reader.readAsDataURL(file);
  }

  onEdit() {
    if (this.perfilForm.valid) {

      const formData = new FormData();

      formData.append('username', this.perfilForm.value.username!);
      formData.append('email', this.perfilForm.value.email!);
      formData.append('nombre', this.perfilForm.value.nombre!);
      formData.append('apellidos', this.perfilForm.value.apellidos!);
      formData.append('cp', this.perfilForm.value.cp!);

      if (this.imageFile) {        
        formData.append('imagen', this.imageFile!);
      } 

      this.perfilForm.markAsPending();
      this.userService.updateUser(formData).subscribe({
        next: (response) => {
          this.toastr.success(`${response.message}`, 'Perfil actualizado');
        }
      });
      this.cd.detectChanges(); // Detecta los cambios
    }
  }
  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.changePassword(result);
    });
  }

  changePassword(data: any): void {
    // Aquí puedes abrir el modal para cambiar la contraseña
  }
}