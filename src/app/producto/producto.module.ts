import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscadorComponent } from './buscador/buscador.component';
import { ProductoListingComponent } from './producto-listing/producto-listing.component';
import { ProductoDetailsComponent } from './producto-details/producto-details.component';
import { CarritoModule } from '../carrito/carrito.module';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ComparadorComponent } from './comparador/comparador.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormExtensionsModule } from '../form-extensions/form-extensions.module';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
// import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    BuscadorComponent,
    ProductoListingComponent,
    ProductoDetailsComponent,
    ComparadorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CarritoModule,
    MatCardModule, 
    MatIconModule, 
    MatDividerModule,
    MatPaginatorModule,
    MatTooltipModule, 
    MatInputModule,
    ReactiveFormsModule,
    FormExtensionsModule,
    MatButtonModule

  ],
  exports: [
    BuscadorComponent, 
    ProductoListingComponent,
  ]
})
export class ProductoModule { }
