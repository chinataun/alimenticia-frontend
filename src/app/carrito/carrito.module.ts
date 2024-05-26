import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoComponent } from './carrito/carrito.component';
import { CarritoItemComponent } from './carrito-item/carrito-item.component';
import { ComparadorComponent } from '../producto/comparador/comparador.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthModule } from '../auth/auth.module';
import { MatTooltip } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    CarritoComponent,
    CarritoItemComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule, 
    RouterModule,
    AuthModule,
    MatTooltip
  ],
  exports: [
    CarritoComponent
  ]
})
export class CarritoModule { }
