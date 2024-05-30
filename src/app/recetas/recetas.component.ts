import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RecetasService } from './recetas.service';
import { MatDialog } from '@angular/material/dialog';
import { NewRecetaComponent } from './new-receta/new-receta.component';
import { BehaviorSubject, Observable, Subject, combineLatest, concatMap, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { CategoriaReceta, Receta } from './receta';
import { User } from '../auth/model/user.interface';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CategoriaService } from '../service/categoriasService';
import { AppService } from '../app.service';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})  // updateFavoriteRecipes(): void {
  //   this.httpClient.get<Receta[]>(/* tu URL aquí */).subscribe(
  //     recipes => this.favoriteRecipesSubject.next(recipes)
  //   );
  // }
export class RecetasComponent implements OnInit{

  isLoggedInObservable$ = this.authService.isLoggedIn$;
  recetas$ = this.recetasService.recetas$;
  filteredRecetas$ = this.recetas$;

  categoriaSeleccionada: number = 0;
  categorias: CategoriaReceta[] | undefined;
  
  favorite$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  userId$: Observable<Number | undefined> = this.authService.user$
    .pipe(
      map((user: User | null) => user?.userId)
    );
    private destroy$ = new Subject<void>();
  constructor(
    private appService: AppService,
    private authService: AuthService,
    private recetasService: RecetasService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,

    private categoriaService: CategoriaService,
  ) {
    combineLatest([
      this.recetas$,
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
    // this.appService.changeBannerImage('assets/banner/recetas.png');
    this.appService.changeBannerImage('assets/banner/3.svg');
    this.recetasService.updateFavoriteRecipes();
    this.recetasService.updateRecipes();
  }

  openNewRecipeDialog(): void {
    this.dialog.open(NewRecetaComponent);  
  }

  onCategorySelect(categoriaId: number) {
    this.categoriaSeleccionada = categoriaId;
    this.filteredRecetas$ = this.recetas$.pipe(
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
