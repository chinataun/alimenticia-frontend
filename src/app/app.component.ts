import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CarritoService } from './carrito/carrito.service';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  bannerImage!: string;
  isCartVisible = false;
  isMenuOpened = false;
  carritoCount$ = this.carritoService.carritoCount$;

  constructor(private appService: AppService, public carritoService: CarritoService) {
    this.appService.changeBannerImage('assets/banner/comparador.jpg');
  }


  ngOnInit() {
    this.appService.currentBannerImage$.subscribe(image => this.bannerImage = image);
  }

  toggleCartVisibility(): void {
    this.isCartVisible = !this.isCartVisible;
  }

  showMenu(): void {
    this.isCartVisible = false;
    this.isMenuOpened = true;
  }

  hideMenu(): void {
    this.isMenuOpened = false;
  }
}