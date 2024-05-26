import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { CategoriaReceta, Receta } from '../receta';
import { AuthService } from 'src/app/auth/auth.service';
import { RecetasService } from '../recetas.service';
import { ToastrService } from 'ngx-toastr';
import { NewRecetaComponent } from '../new-receta/new-receta.component';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { CategoriaService } from 'src/app/service/categoriasService';

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrl: './favorite-recipes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteRecipesComponent implements OnInit{

  favorite_recipes$ = this.recetasService.favoriteRecipes$;
  filteredRecetas$ = this.favorite_recipes$;
  
  categoriaSeleccionada: number = 0;
  categorias: CategoriaReceta[] | undefined;


  private destroy$ = new Subject<void>();
  isLoggedInObservable$ = this.authService.isLoggedIn$;

  constructor(
    private recetasService: RecetasService,
    private authService: AuthService,
    private dialog: MatDialog,
    private appService: AppService,
    private categoriaService: CategoriaService,
  ) {

    this.appService.changeBannerImage('assets/banner/3.svg');
    combineLatest([
      this.favorite_recipes$,
      this.categoriaService.getCategoriasReceta()
    ]).pipe(
      takeUntil(this.destroy$),
      map(([recetas, categorias]) => {
        const uniqueCategoriaIds = [...new Set(recetas.map(receta => receta.categoriaId))];
        return categorias.filter((categoria: { id: string; }) => uniqueCategoriaIds.includes(categoria.id));
      })
    ).subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  ngOnInit() {
    this.recetasService.updateFavoriteRecipes();
  }


  openNewRecipeDialog(): void {
    this.dialog.open(NewRecetaComponent);  
  }
  onCategorySelect(categoriaId: number) {
    this.categoriaSeleccionada = categoriaId;
    this.filteredRecetas$ = this.favorite_recipes$.pipe(
      map(recetas => 
        this.categoriaSeleccionada 
          ? recetas.filter(receta => String(receta.categoriaId) == String(this.categoriaSeleccionada))
          : recetas
      )
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
