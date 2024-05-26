import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiFoodsService } from 'src/app/service/apiFoods.service';

import { ApiFoodsDetalleService } from 'src/app/service/api-foods-detalle.service';

@Component({
  selector: 'app-api-foods',
  templateUrl: './api-foods.component.html',
  styleUrls: ['./api-foods.component.scss']
})

export class ApiFoodsComponent implements OnInit {
  productName: string = '';
  products: any[] = [];
  productsDetalle:any[]=[];

  constructor(private apiService: ApiFoodsService, 
    private apiFoodsDetalleService: ApiFoodsDetalleService,
    private router: Router) { }

  ngOnInit(): void {
  }

  searchProducts(): void {
    if (this.productName.trim() !== '') {
      this.apiService.searchProducts(this.productName).subscribe(
        (data: any) => {
          this.products = data;
          console.log(this.products)
        },
        (error) => {
          console.error('Error al buscar productos:', error);
        }
      );
    }
  }
  loadAction(product: any): void {
   // console.log('Cargar acción para el producto:', product.title);
    // Aquí puedes agregar más lógica según lo que necesites
    this.apiFoodsDetalleService.selectedProduct = product;
    //console.log(this.productsDetalle)
    const productName = product.title.replace(/\s+/g, '-').toLowerCase(); // Convertir el nombre del producto a un formato URL-friendly
    this.router.navigate(['dietetica', 'informacion-nutricional', productName]);
  }
  


}