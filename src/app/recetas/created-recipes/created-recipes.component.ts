import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { RecetasService } from '../recetas.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriaReceta, Receta } from '../receta';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/auth/model/user.interface';
import { NewRecetaComponent } from '../new-receta/new-receta.component';
import { AppService } from 'src/app/app.service';
import { CategoriaService } from 'src/app/service/categoriasService';

@Component({
  selector: 'app-created-recipes',
  templateUrl: './created-recipes.component.html',
  styleUrl: './created-recipes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatedRecipesComponent {
  isLoggedInObservable$ = this.authService.isLoggedIn$;

  createdRecipes$ = this.recetasService.createdRecipes$;
  filteredRecetas$ = this.createdRecipes$;

  categoriaSeleccionada: number = 0;
  categorias: CategoriaReceta[] | undefined;
  
  private destroy$ = new Subject<void>();

  userId$: Observable<Number | undefined> = this.authService.user$
    .pipe(
      map((user: User | null) => user?.userId)
    );


  constructor(
    private authService: AuthService,
    private recetasService: RecetasService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private appService: AppService,
    private categoriaService: CategoriaService,
  ) {

    this.appService.changeBannerImage('assets/banner/3.svg');
    combineLatest([
      this.createdRecipes$,
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
    this.recetasService.updateCreatedRecipes();
  }

  openNewRecipeDialog(): void {
    this.dialog.open(NewRecetaComponent);  
  }
  onCategorySelect(categoriaId: number) {
    this.categoriaSeleccionada = categoriaId;
    this.filteredRecetas$ = this.createdRecipes$.pipe(
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
