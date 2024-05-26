import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FavoritesCredentials, Receta } from '../receta';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetasService } from '../recetas.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject, Observable, map, of, switchMap, take, tap } from 'rxjs';
import { UserWithToken } from 'src/app/auth/model/user.interface';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-receta-listing',
  templateUrl: './receta-listing.component.html',
  styleUrl: './receta-listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecetaListingComponent {
  @Input() receta!: Receta;
  favorite$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  credentials!: FavoritesCredentials;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recetaService: RecetasService,
    private authService: AuthService,
    private toastr: ToastrService,
  
    private appService: AppService,
  ) {
    this.appService.changeBannerImage('assets/banner/3.svg');}

  ngOnInit(): void {
    this.authService.user$.pipe(
      take(1)
    ).subscribe(user => {
      if (user) {
        const recetaId = this.receta.id;
        const userId = user.userId;
        this.credentials = { recetaId, userId };

      } else {
        // Usuario no está autenticado
        
        this.favorite$.next(false);
      }
    });
    // this.favorite$ = this.checkFavoriteStatus();
    // this.authService.user$.subscribe(user => {
    //   if (user) {
    //     const recetaId = this.receta.id;
    //     const userId = user.userId;
    //     this.credentials = { recetaId, userId }; // Crea un objeto de tipo LoginCredentials con las propiedades email y password

    //     this.favorite$ = this.recetaService.isFavorite(this.credentials);

    //   } else {
    //     // Manejar el caso en que no se ha iniciado sesión
    //     this.favorite$ = of(false);
    //   }
    // });
  }

  // addToCart(): void {
  //   const cartItem = mapProductToCartItem(this.product);
  //   this.scService.addItem(cartItem);
  // }
  // checkFavoriteStatus(): Observable<boolean> {

  //   // const userId = 1; // Obtén el ID de usuario de alguna manera (p. ej., desde el servicio de autenticación)
  //   // return this.recetaService.isFavorite(this.receta.id, userId);

  // }
  toggleFavorite(recetaId: number): void {
    // if (!this.credentials) {
    //   this.toastr.error('Necesitas estar registrado para añadir a favoritos');

    //   return; // No hay credenciales disponibles
    // }

    // if (this.favorite$.value) {
    //   this.recetaService.removeFavorite(this.credentials).subscribe(() => {
    //     this.favorite$.next(false); // Actualizar el estado del favorito
    //     this.toastr.success('Receta eliminada de favoritos');

    //   });
    // } else {
    //   this.recetaService.addFavorite(this.credentials).subscribe(() => {
    //     this.favorite$.next(true); // Actualizar el estado del favorito
    //     this.toastr.success('Receta añadida a favoritos');


    //   });
    // }
    // // if (this.favorite === false) {
    //   this.favorite = true
    //   console.log("pepe true")
    // } else {
    //   this.favorite = false
    //   console.log("pepa false")
    // }
    // const recetaId = this.receta.id;
    // const userId = this.user$.userId;
    // const credentials: FavoritesCredentials = { recetaId, userId }; // Crea un objeto de tipo LoginCredentials con las propiedades email y password
    // this.credentials.recetaId = recetaId;
    // this.recetaService.getPedo().subscribe((response) => {
    //   console.log(response)
    // });
    // this.favorite$.subscribe({
    //   next: (respuesta) => {

    //     if (respuesta) {
    //       this.recetaService.removeFavorite(this.credentials).subscribe(() => {
    //         // Después de añadir como favorita, actualizamos el estado del observable
    //         this.favorite$ = this.recetaService.isFavorite(this.credentials);
    //       });
    //     } else {
    //       this.recetaService.addFavorite(this.credentials).subscribe({
    //         next: (respuesta) => {
    //           console.log(respuesta.message)
    //           this.favorite$ = this.recetaService.isFavorite(this.credentials);
    //         },
    //   //      error: () => this.signinForm.setErrors({ invalidCredentials: true }),
    //         error: (error) => {
    //           // this.toastr.error(`${error.error.msg}`, 'Usuario NO registrado');
    //           console.error('Error al registrar favorito:', error);
    //         },
    //       });
    //     }
    //   },
    // });
//     this.recetaService.isFavorite(this.credentials).subscribe({
//       next: (respuesta) => {

//         console.log(respuesta)
//       },
// //      error: () => this.signinForm.setErrors({ invalidCredentials: true }),
//       error: (error) => {
//         console.error('Error al registrar usuario:', error);
//       },
    // });
    // if (this.favorite$) {
    //   this.recetaService.removeFavorite(receta);
    // } else {
    //   this.recetaService.addFavorite(receta);
    // }
  }

  // removeFavorite(recetaId: number): void {
  //   this.recetaService.removeFavorite(this.credentials).subscribe(() => {
  //     // Después de añadir como favorita, actualizamos el estado del observable
  //     this.favorite$ = this.recetaService.isFavorite(this.credentials);
  //   });
  // }

  // addFavorite(recetaId: number): void {
  //   this.recetaService.addFavorite(this.credentials).subscribe(() => {
  //     // Después de añadir como favorita, actualizamos el estado del observable
  //     this.favorite$ = this.recetaService.isFavorite(this.credentials);
  //   });
  // }

  navigateToRecetaDetails(): void {
    this.router.navigate(['receta', this.receta.id], {
      relativeTo: this.route,
    });
  }
}
