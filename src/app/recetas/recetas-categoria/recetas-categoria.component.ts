import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecetasService } from '../recetas.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from 'src/app/service/categoriasService';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/auth/model/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Receta } from '../receta';
import { AppService } from 'src/app/app.service';
import { NewRecetaComponent } from '../new-receta/new-receta.component';

@Component({
  selector: 'app-recetas-categoria',
  templateUrl: './recetas-categoria.component.html',
  styleUrl: './recetas-categoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecetasCategoriaComponent {
  recetas$: Observable<Receta[]> = this.recetasService.recetas$;
  id: string | null = null;
  isLoggedInObservable$ = this.authService.isLoggedIn$;
  userId$: Observable<Number | undefined> = this.authService.user$
  .pipe(
    map((user: User | null) => user?.userId)
  );
  constructor(    
    private authService: AuthService,
    private recetasService: RecetasService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,

    private categoriaService: CategoriaService,
    private appService: AppService,
  ) {
    this.appService.changeBannerImage('assets/banner/3.svg');
      this.id = this.route.snapshot.paramMap.get('nombre'); 
     }
     openNewRecipeDialog(): void {
      this.dialog.open(NewRecetaComponent);  
    }
     editRecipe(receta: Receta): void {
      //redirigir a la edicion de la receta creada
      this.router.navigate(['/recetas/receta/edit', receta.id]);
    }
   
    deleteRecipe(receta: Receta): void {
      this.recetasService.removeCreatedRecipe(receta).subscribe((result) => {
        this.toastr.success(result.message);
      });
    }

    ngOnInit() {
    this.recetasService.updateFavoriteRecipes();
    this.recetas$ = this.recetasService.getRecetas().pipe(
      map(recetas =>
               recetas.filter(receta => String(receta.categoriaReceta.nombre.toLowerCase()) == this.id) 
    )
  );
}

}
