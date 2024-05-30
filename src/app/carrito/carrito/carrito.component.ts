import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { CarritoItem } from '../carrito-item.interface';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarritoComponent {
  @HostListener('document:click', ['$event'])
  clickout(event: { target: { closest: (arg0: string) => any; }; }) {
    if (
      this.cartVisible 
      && !event.target.closest('.cart-container') 
      && !event.target.closest('.cart-icon')
      && !event.target.closest('.cart-icon-mobile')
      && !event.target.closest('.delete-item')
      && !event.target.closest('.addItem')
      
    ) {
      this.carritoService.toggleCartVisibility();
    }
  }
  isLoggedIn$ = this.authService.isLoggedIn$;
  carritoItems$ = this.carritoService.items$;
  total$ = this.carritoService.total$;
  itemsCount$ = this.carritoService.itemsCount$;
  cartVisible = false;
  
  constructor(
    public carritoService: CarritoService,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
  ) {
    this.carritoService.isCartVisible$.subscribe(visible => {
      this.cartVisible = visible;
    });
  }

  ngOnInit(): void {
    this.appService.changeBannerImage('assets/banner/5.svg');
  }

  deleteItem(itemToDelete: CarritoItem): void {
    this.carritoService.deleteItem(itemToDelete);
  }
  clearCarrito(): void {
    this.carritoService.clearCarrito();
  }
  saveCarrito(): void {
    this.carritoService.saveCarrito();
  }



  
}
