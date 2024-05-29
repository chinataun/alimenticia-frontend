import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, filter, map } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SupermercadoFAvoritoComponent } from 'src/app/user/supermercado-favorito/supermercado-favorito.component';
import { UserService } from 'src/app/user/user.service';
import { CategoriaService } from 'src/app/service/categoriasService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  supermercados!: any[]

  hasSupermarket$: Observable<boolean> = this.authService.userProfile$.pipe(
    filter(user => user !== null),
    map(user => user?.supermercado !== null)
  );

  private subscription!: Subscription;
  
  constructor(
    private authService: AuthService, 
    private dialog: MatDialog,
    private appService: AppService,
    private categoriaService: CategoriaService,
  ) {
    this.supermercados = this.categoriaService.getSupermercadosActivos();
  }

  ngOnInit() {
    this.appService.changeBannerImage('assets/banner/comparador.jpg');
    this.subscription = this.hasSupermarket$.subscribe(hasSupermercadoFavorito => {
      if (!hasSupermercadoFavorito) {

        this.dialog.open(SupermercadoFAvoritoComponent)
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
