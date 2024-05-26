import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { DieteticaRoutingModule } from './dietetica-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormExtensionsModule } from '../form-extensions/form-extensions.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NutricionComponent } from './nutricion/nutricion.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    CalculadoraComponent,
    NutricionComponent
  ],
  imports: [
    CommonModule,
    DieteticaRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormExtensionsModule,
    MatSnackBarModule,
    MatIconModule,
    FormsModule,
    MatPaginatorModule,
    MatTabsModule,
  ]
})
export class DieteticaModule { }
