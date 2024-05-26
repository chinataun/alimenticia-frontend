import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PerfilComponent } from '../perfil/perfil.component';
import { UserService } from '../user.service';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-cp',
  templateUrl: './cp.component.html',
  styleUrl: './cp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CpComponent {

  codigoPostal$ = this.userService.user_profile$.pipe(
    map(user => user?.cp)
  );
  codigoPostal: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<CpComponent>,
    private userService: UserService,
  ) {
    this.codigoPostal$.subscribe(cp => this.codigoPostal = cp);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  updateCp(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.codigoPostal = target.value;
  }
  
  onConfirm(): void {
    this.userService.updateCp(this.codigoPostal); // Actualiza el código postal aquí
    this.dialogRef.close();
  }
}
