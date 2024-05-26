import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoItem } from 'src/app/carrito/carrito-item.interface';
import { CarritoService } from 'src/app/carrito/carrito.service';
import { ProductoService } from '../producto.service';
import { Producto, ProductoItem } from '../producto.categoria.interface';

@Component({
  selector: 'app-producto-listing',
  templateUrl: './producto-listing.component.html',
  styleUrl: './producto-listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductoListingComponent {
  @Input() producto!: any;
  @Input() showButtonsProduct!: 'edit' | 'search';
  @Output() buttonClick = new EventEmitter<void>();

  productos: any = [];
  

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private route: ActivatedRoute,
    private productoService: ProductoService, 
    private cd: ChangeDetectorRef,
  ) {}

  // addToCart(): void {
  //   const cartItem = this.mapProductToCartItem(this.producto);
  //   this.carritoService.addItem(cartItem);
  // }
  onButtonClick(producto: Producto): void {
    this.buttonClick.emit();
  }

  navigateToProductDetails(): void {
    this.router.navigate(['products', this.producto.id], {
      relativeTo: this.route,
    });
  }



  buscarProductoSimilar(producto: Producto, event: Event ): void {
    event.preventDefault();
    this.productoService.getProductoSimilar(producto).subscribe(productos => {
      this.productos = Object.entries(productos).map(([key, value]) => ({key, value}));
      console.log(this.productos);
      this.cd.detectChanges();
    });
  }
}
