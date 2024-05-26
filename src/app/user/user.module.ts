import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormExtensionsModule } from '../form-extensions/form-extensions.module';
import { MisListasComponent } from './mis-listas/mis-listas.component';
import { PerfilComponent } from './perfil/perfil.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { RecetasModule } from '../recetas/recetas.module';
import { SupermercadoFAvoritoComponent } from './supermercado-favorito/supermercado-favorito.component';
import { CpComponent } from './cp/cp.component';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CarritosComponent } from './carritos/carritos.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { EliminarComponent } from './eliminar/eliminar.component';

@NgModule({
  declarations: [
    MisListasComponent,
    PerfilComponent,
    ChangePasswordDialogComponent,
    SupermercadoFAvoritoComponent,
    CpComponent,
    CarritosComponent,
    SubmenuComponent,
    EliminarComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormExtensionsModule,
    MatButtonModule, 
    MatTooltipModule, 
    MatIconModule, 
    MatDividerModule, 
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RecetasModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    MatInputModule
  ],
  exports: [
    SubmenuComponent
  ]
})
export class UserModule {}