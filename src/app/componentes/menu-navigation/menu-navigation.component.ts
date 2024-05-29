import { Component, Input, ViewChild, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, map } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CarritoService } from 'src/app/carrito/carrito.service';
import { NewRecetaComponent } from 'src/app/recetas/new-receta/new-receta.component';
import { CpComponent } from 'src/app/user/cp/cp.component';
import { SupermercadoFAvoritoComponent } from 'src/app/user/supermercado-favorito/supermercado-favorito.component';
import { UserService } from 'src/app/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-navigation',
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.scss']
})
export class MenuNavigationComponent {

  private baseUrl = environment.API_BASE_URL;

  userProfile$ = this.userService.user_profile$
  
  isLoggedInObservable$ = this.authService.isLoggedIn$;

  carritoCount$ = this.carritoService.carritoCount$;
  
  user_picture$: Observable<string | null> = this.userService.userImage$.pipe(map((image) => image ? `${this.baseUrl}/${image}` : null));

  mesSeleccionado: string = '';
  categoriaSeleccionada: string = '';


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService, 
    private dialog: MatDialog,
    public carritoService: CarritoService
  ) {
    // this.isLoggedInObservable$ = this.authService.isLoggedIn$;
  }
  openNewRecipeDialog(): void {
    this.dialog.open(NewRecetaComponent);  
  }
  // ngOnInit() {
  //   this.actualizarValoresDesdeAlimentosTemporada();
  // }


  // actualizarValoresDesdeAlimentosTemporada() {
  //   this.mesSeleccionado = this.alimentosTemporadaComponent.mesSeleccionado;
  //   this.categoriaSeleccionada = this.alimentosTemporadaComponent.categoriaSeleccionada;
  // }
  // formarURL(): string {
  //   // Construir la URL utilizando los valores de mes y categoría seleccionados
  //   return `/alimentosTemporada/${this.mesSeleccionado}/${this.categoriaSeleccionada}`;
  // }
  // toggleMenu() {
  //   // this.isMenuOpen = !this.isMenuOpen; // Cambia el estado del menú
  // }
  // @Output() closeDrawer = new EventEmitter<void>();

  // @HostListener('click') onClick(): void {
  //   this.closeDrawer.emit();
  // }
  openSupermercadoModal(): void {
    this.dialog.open(SupermercadoFAvoritoComponent);
  }
  
  openCPModal(): void {
  this.dialog.open(CpComponent);

  // dialogRef.afterClosed().subscribe(result => {
  //   if (result) {
  //     this.userService.updateCp(result);
  //   }
  // });
  }

  logout() {
    // Realiza la lógica de cierre de sesión y actualiza el estado de autenticación
    this.authService.logOut();
  }

  private actualizarURL() {
    // Llamar al método de AlimentosTemporadaComponent para actualizar la URL
   // this.alimentosTemporada.actualizarURL();
  }
}
