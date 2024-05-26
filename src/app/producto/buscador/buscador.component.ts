import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductoService } from '../producto.service';
import { CarritoService } from 'src/app/carrito/carrito.service';
import { BehaviorSubject, EMPTY, Observable, Subject, combineLatest, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { Categoria, Producto } from '../producto.categoria.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SupermercadoFAvoritoComponent } from 'src/app/user/supermercado-favorito/supermercado-favorito.component';
import { CategoriaService } from 'src/app/service/categoriasService';
import { AppService } from 'src/app/app.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuscadorComponent {
  hasSupermarket$: Observable<string | undefined> = this.authService.userProfile$.pipe(
    filter(user => user !== null),
    map(user => user?.supermercado)
  );

  isLoggedInObservable$ = this.authService.isLoggedIn$;
  
  termino: string = '';
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  selectedSupermarket = new BehaviorSubject<string | undefined | null>(this.productService.getSupermercado());
  selectedSupermarket$ = this.selectedSupermarket.asObservable();

  currentSubcategories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  currentSubcategories$ = this.currentSubcategories.asObservable();

  productos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  hayProductos$ = this.productos$.pipe(
    map(productos => !!productos && productos.length > 0)
  );
  
  isCartVisible = false;
  filtros = new BehaviorSubject<{ [key: string]: boolean }>({});

  filtrosCategorias = new BehaviorSubject<{ [key: string]: boolean }>({});
  filtrosSubcategorias = new BehaviorSubject<{ [key: string]: boolean }>({});

  private unsubscribe$ = new Subject<void>();
  compraForm!: FormGroup;
  

  constructor(
    public carritoService: CarritoService,
    private productService: ProductoService, 
    private shoppingcartService: CarritoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private categoriasService: CategoriaService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.appService.changeBannerImage('assets/banner/5.svg');
    this.compraForm = this.formBuilder.group({
      termino: ['', Validators.required]
    })
  } 

  get terminoControl(): FormControl {
    return this.compraForm.get('termino') as FormControl;
  }

  get categorias$(): Observable<Categoria[]> {
    return this.productos$.pipe(
      map(productos => {
        const categorias = new Map<string, Set<string>>();
    
        for (const producto of productos) {
          if (!categorias.has(producto.categoriaSuper2)) {
            categorias.set(producto.categoriaSuper2, new Set<string>());
          }
        
          const subcategorias = categorias.get(producto.categoriaSuper2);
          if (subcategorias) {
            subcategorias.add(producto.categoriaSuper3);
          }
        }
    
        return Array.from(categorias.entries()).map(([categoria, subcategorias]) => ({
          categoria,
          subcategorias: Array.from(subcategorias)
        }));
      })
    );
  }
  get productosFiltrados$(): Observable<any[]> {
    return combineLatest([this.productos$, this.filtrosCategorias, this.filtrosSubcategorias]).pipe(
      map(([productos, filtrosCategorias, filtrosSubcategorias]) => {
        return productos.filter(producto => {
          // Si hay filtros de subcategoría activos, filtra por subcategoría
          if (Object.keys(filtrosSubcategorias).length > 0) {
            return filtrosSubcategorias[producto.categoriaSuper3];
          }
          // Si no, filtra por categoría
          return filtrosCategorias[producto.categoriaSuper2];
        });
      })
    );
  }

  resetFilters(): void {
    this.filtrosCategorias.next({});
    this.filtrosSubcategorias.next({});
    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.buscarProductos();
  }
  
  resetFiltersWithoutSearch(): void {
    this.filtrosCategorias.next({});
    this.filtrosSubcategorias.next({});
    this.selectedCategory = '';
    this.selectedSubcategory = '';
  }

  // onSubmit(event: Event): void {
  //   event.preventDefault();
  //   this.buscarProductos();
  // }
  
  buscar(): void {    
    this.termino = this.compraForm.get('termino')?.value;
    this.buscarProductos()
    
  }

  onCategoryClick(categoria: string, subcategoria?: string): void {
    // Si se ha seleccionado una subcategoría, actualiza los filtros de subcategoría
    if (subcategoria) {
      const updatedFiltrosSubcategorias = { [subcategoria]: true };
      this.filtrosSubcategorias.next(updatedFiltrosSubcategorias);
    } else {
      // Si no se ha seleccionado una subcategoría, actualiza los filtros de categoría
      const updatedFiltrosCategorias = { [categoria]: true };
      this.filtrosCategorias.next(updatedFiltrosCategorias);
      // Y resetea los filtros de subcategoría
      this.filtrosSubcategorias.next({});
    }

  this.categorias$.pipe(
    take(1),
    map(categorias => categorias.find(c => c.categoria === categoria)?.subcategorias || [])
  ).subscribe(subcategorias => {
    this.currentSubcategories.next(subcategorias);
  });

    this.selectedCategory = categoria;
    this.selectedSubcategory = subcategoria || '';
  }
  onSubcategoryClick(subcategoria: string): void {
  const updatedFiltrosSubcategorias = { [subcategoria]: true };
  this.filtrosSubcategorias.next(updatedFiltrosSubcategorias);

  this.selectedSubcategory = subcategoria;
}
  toggleCartVisibility(): void {
    this.isCartVisible = !this.isCartVisible;
  }


  onButtonClick(producto: Producto): void {
    const cartItem = this.mapProductToCartItem(producto);
    this.carritoService.addItem(cartItem);
    this.carritoService.isCartVisible.next(true);
  }


  mapProductToCartItem(producto: Producto): any {  
    return { producto: producto, cantidad: 1};
  }

  ngOnInit(): void {
    this.userService.selectedSupermarketChanged$
    .pipe(takeUntil(this.unsubscribe$))
    .pipe(filter(supermercado =>supermercado !== null))
    .subscribe(supermercado => {
      console.log(supermercado);
      if (supermercado) {
        this.selectedSupermarket.next(supermercado);
      } else {
        if (this.productService.getSupermercado()) {
          const supermercado = this.productService.getSupermercado();
          this.selectedSupermarket.next(supermercado);
        } else {
          this.openSupermercadoModal()
        }
      }
      
    });

  }
  openSupermercadoModal(): void {
    this.isLoggedInObservable$.pipe(takeUntil(this.unsubscribe$)).subscribe(isLoggedIn => {
      const supermarkets = isLoggedIn ? null : this.categoriasService.getSupermercadosActivos();
      const dialogRef = this.dialog.open(SupermercadoFAvoritoComponent, 
        { data: { supermarkets: supermarkets }});
  
      dialogRef.afterClosed().subscribe(() => {
        const selectedSupermarket = this.productService.getSupermercado();
        if (selectedSupermarket) {
          this.selectedSupermarket.next(selectedSupermarket);
          this.resetFilters();
        }
      });
    });
  }

  buscarProductos(): void {
    if(this.termino){
    this.productService.getProductos(this.termino)      
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(productos => {
      this.productos$.next(productos);
      const initialFiltrosCategorias = productos.reduce((acc, producto) => {
        acc[producto.categoriaSuper2] = true;
        return acc;
      }, {} as { [key: string]: boolean });

      const initialFiltrosSubcategorias = productos.reduce((acc, producto) => {
        acc[producto.categoriaSuper3] = true;
        return acc;
      }, {} as { [key: string]: boolean });

      this.filtrosCategorias.next(initialFiltrosCategorias);
      this.filtrosSubcategorias.next(initialFiltrosSubcategorias);
      this.shoppingcartService.itemsCount$.subscribe(count => {
        this.isCartVisible = count > 0;
      });

    });
    }

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
