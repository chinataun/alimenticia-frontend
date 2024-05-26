import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable, Subscription, forkJoin, map, tap } from 'rxjs';
import { CarritoItem } from 'src/app/carrito/carrito-item.interface';
import { CarritoService } from 'src/app/carrito/carrito.service';
import { ProductoService } from '../producto.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-comparador',
  templateUrl: './comparador.component.html',
  styleUrl: './comparador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparadorComponent {
  cartProducts$ = this.cartService.items$;
  productosSimilares: any = {}; // replace with your similar product type
  totalCarrito!: number;
  carritoBarato: boolean = true;
  carritoCaro: boolean = true;
  carritoVacio: boolean = true;
  cartSupermarket!: string;
  loading = false;



  constructor(private cartService: CarritoService,
    private productoService: ProductoService,
    private cd: ChangeDetectorRef,
    private appService: AppService,
  ) {}

  ngOnInit(): void {
    this.appService.changeBannerImage('assets/banner/5.svg');
    this.cartService.hideCart();
    this.cartProducts$.pipe(
      tap((cartItems: CarritoItem[]) => {
        this.totalCarrito = cartItems.reduce((acc, item) => acc + (Number(item.producto.precioNormal) * item.cantidad), 0).toFixed(2) as any as number;
      })
    ).subscribe(
      (cartItems: CarritoItem[]) => {
        this.carritoVacio = cartItems.length === 0;
        this.getProductosSimilares(cartItems);
      }
    );
  }
  objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  getProductosSimilares(cartItems: CarritoItem[]): void {
    this.loading = true;
    const observables = cartItems.map(item => 
      this.productoService.getProductoSimilar(item.producto).pipe(
        map(productos => {
          const result: { [key: string]: any } = {}; // Add index signature
          for (const supermercado in productos) {
            let producto = productos[supermercado].productoSimilar;
            if (productos[supermercado].productoMarcaSimilar) {
              producto = productos[supermercado].productoMarcaSimilar;
            }
            result[supermercado] = { producto: producto, cantidad: item.cantidad, total: item.cantidad * producto.precioNormal };
          }
          return result;
        })
      )
    );

    forkJoin(observables).subscribe(results => {
      this.productosSimilares = results.reduce((acc, result) => {
        for (const supermercado in result) {
          if (!acc[supermercado]) {
            acc[supermercado] = { productos: [], total: 0 };
          }
          acc[supermercado].productos.push(result[supermercado]);
          acc[supermercado].total += Number(result[supermercado].total);
        }
        return acc;
      }, {});
      let cheapestSupermarket = this.cartSupermarket;
      let cheapestTotal = this.totalCarrito;
      let mostExpensiveSupermarket = this.cartSupermarket;
      let mostExpensiveTotal = this.totalCarrito;

      for (const supermercado in this.productosSimilares) {
        const total = Number(this.productosSimilares[supermercado].total);
        this.productosSimilares[supermercado].total = this.productosSimilares[supermercado].total.toFixed(2);
        if (total < cheapestTotal) {
          cheapestSupermarket = supermercado;
          cheapestTotal = total;
        }
        if (total > mostExpensiveTotal) {
          mostExpensiveSupermarket = supermercado;
          mostExpensiveTotal = total;
        }
      
      }

    
    if (cheapestSupermarket) {
      this.carritoBarato = false;
      this.productosSimilares[cheapestSupermarket].barato = true;
    }
    
    if (mostExpensiveSupermarket) {
      this.carritoCaro = false;
      this.productosSimilares[mostExpensiveSupermarket].caro = true;
    }
      this.loading = false;
      this.cd.detectChanges();
    });
  }
}
