import { Component, Injectable, OnInit } from "@angular/core";
import { ApiFoodsDetalleService } from "src/app/service/api-foods-detalle.service";

@Component({
    selector: 'app-api-foods',
    templateUrl: './api-foods-detalle.component.html',
    styleUrls: ['./api-foods-detalle.component.scss']
  })

  
@Injectable({
    providedIn: 'root'
  })
  export class ApiFoodsDetalleComponent implements OnInit {
    productsDetalle:any;
     constructor(private apiFoodsDetalleService: ApiFoodsDetalleService){}


    ngOnInit(): void {
        this.productsDetalle=this.apiFoodsDetalleService.selectedProduct;
        console.log(this.productsDetalle);
    }
    
  }