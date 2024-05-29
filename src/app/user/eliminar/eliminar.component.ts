import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/componentes/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrl: './eliminar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EliminarComponent {

  @Input() userId!: number;
  
  constructor(
    private userService: UserService, 
    private router: Router, 
    public dialog: MatDialog,
    private authService: AuthService
  ) { }


  deleteUser(userId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '¿Estás seguro de que quieres eliminar este usuario?',
        content: 'Se eliminarán todas tus recetas, votaciones y tus listas guardadas'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(String(userId)).subscribe(() => {
          this.authService.logOut()
          this.router.navigate(['/']);
        });
      }
    });
  }

  
}
