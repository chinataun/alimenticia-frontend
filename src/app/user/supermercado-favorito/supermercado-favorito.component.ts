import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PerfilComponent } from '../perfil/perfil.component';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, map, of } from 'rxjs';
import { ProductoService } from 'src/app/producto/producto.service';

@Component({
  selector: 'app-supermercado-favorito',
  templateUrl: './supermercado-favorito.component.html',
  styleUrl: './supermercado-favorito.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupermercadoFAvoritoComponent implements OnInit{
  supermercados$!: Observable<any[]>;
  isLoggedInObservable$ = this.authService.isLoggedIn$;
  defaultSupermarkets = ['dia', 'ahorramas', 'eroski', 'alcampo'];

  constructor(    
    public dialogRef: MatDialogRef<SupermercadoFAvoritoComponent>,
    private userService: UserService,
    private authService: AuthService,
    private productService: ProductoService, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    }

  ngOnInit(): void {
    if (this.data && this.data.supermarkets) {
      this.supermercados$ = of(this.data.supermarkets);
    } else {    
    this.supermercados$ = this.userService.getSupermarket().pipe(map(supermarkets => {
      const supermarketNames = supermarkets.map((supermarket: { name: any; }) => supermarket.name.toLowerCase().trim());
      const uniqueSupermarkets = Object.values(supermarkets.reduce((acc: { [x: string]: any; }, supermarket: { name: any; rating: number; }) => {
        const name = supermarket.name.toLowerCase().trim();
        if (!acc[name]) {
          acc[name] = supermarket;
        } else if (acc[name].rating < supermarket.rating) {
          acc[name] = supermarket;
        }
        return acc;
      }, {}));

      this.defaultSupermarkets.forEach(supermarket => {
        if (!supermarketNames.includes(supermarket)) {
          uniqueSupermarkets.push({
            name: supermarket,
            address: 'El supermercado no se encuentra cerca, si quiere puede elegirlo igualmente para las busquedas',
            location: {
              lat: null,
              lng: null
            },
            rating: null,
            disabled: true
          });
        }
      });
      return uniqueSupermarkets;
    }))
  }
  }

  seleccionarSupermercado(supermercado: any) {
    this.userService.setSupermercadoFavorito(supermercado);
    this.dialogRef.close();
  }

  seleccionarSupermercadoDefault(supermercado: any) {
    this.productService.setSupermercado(supermercado);
    this.dialogRef.close();
  }

}
