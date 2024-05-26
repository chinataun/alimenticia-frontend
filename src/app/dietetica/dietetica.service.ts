import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { Calculadora, CaloriasResponse } from './calculadora/calculadora.interface';
import { environment } from 'src/environments/environment';
import { ApiProduct, ApiResponse } from './dietetica.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class DieteticaService {
  private baseUrl = environment.API_BASE_URL;
// Crea un nuevo Subject
private productosSubject = new BehaviorSubject<ApiProduct[]>([]);
// Crea un Observable a partir del Subject
productos$ = this.productosSubject.asObservable();
  // private apiFoodsUrl = 

    // Crea un nuevo Subject para el total de productos
    private totalProductsSubject = new BehaviorSubject<number>(0);
    // Crea un Observable a partir del Subject
    totalProducts$ = this.totalProductsSubject.asObservable();

  private openFoodFactsUrlBarcode = 'https://world.openfoodfacts.org/api/v0/product';
  private openFoodFactsUrl = 'https://world.openfoodfacts.org/cgi/search.pl';

  constructor(private http: HttpClient,    private toastr: ToastrService,
  ) {}

  calcularCalorias(datos: Calculadora): Observable<CaloriasResponse> {
    return this.http.post<CaloriasResponse>(`${this.baseUrl}/api/dietetica/calculadora`, datos);
  }

  calcularCaloriasUsuarioRegistrado(datos: Calculadora): Observable<CaloriasResponse> {
    const httpOptions = {
      withCredentials: true,
    };
    return this.http.post<CaloriasResponse>(`${this.baseUrl}/api/dietetica/calcularRegistro`, datos,httpOptions);
  }

  searchProducts(productName: string, page: number = 1): Observable<ApiProduct[]> {
    const params = new HttpParams()
      .set('search_terms', productName)
      .set('search_simple', 1)
      .set('action', 'process')
      .set('sort_by', 'unique_scans_n')
      .set('page_size', '10')
      .set('page', page.toString())
      .set('lc', 'es')
      .set('countries', 'en:Spain')
      .set('json', 'true');

      return this.http.get<ApiResponse>(`${this.openFoodFactsUrl}`, { params })
      // .subscribe(response => {
      //   console.log('response', response);
      //   const productos = response.products.map(product => ({
      //     title: product.product_name_es,
      //     imageUrl: product.image_front_small_url,
      //     nutritionalInfo: product.nutriments,
      //     ecoScore: product.ecoscore_grade,
      //     nutriScore: product.nutrition_grades,
      //     novaGroup: product.nova_group,
      //     ingredientes: product.ingredients_text,
      //     numIngredientes: product.ingredients_n
      //   } as ApiProduct));
      //   // Emite los nuevos productos a través del Subject
      //   console.log('productos', productos);
      //   this.totalProductsSubject.next(response.count);
      //   this.productosSubject.next(productos);
      // }),
      .pipe(
        map(response => {
          console.log(response.products)
          const productos = response.products.map(product => ({
            title: product.product_name_es,
            imageUrl: product.image_front_small_url,
            nutritionalInfo: product.nutriments,
            ecoScore: product.ecoscore_grade,
            nutriScore: product.nutrition_grades,
            novaGroup: product.nova_group,
            ingredientes: product.ingredients_text_es,
            numIngredientes: product.ingredients_n,
            alergenos: product.allergens_from_ingredients
          } as ApiProduct));
          
          this.totalProductsSubject.next(response.count);
          // Ketchup - Heinz 
          console.log(productos)

         return productos;
        }),
        catchError(error => {
          console.log(error)
          if (error.status === 0) {
            // Aquí puedes manejar el error como quieras. Por ejemplo, podrías mostrar un mensaje de error.
            this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
            // const err = new Error(error); 
            // throwError(() => err);
            
          }
    
          // Reenvía el error para que cualquier suscriptor pueda manejarlo también.
          return of([]);
        })
      );
      // catchError(error => {
      //   if (error.status === 500) {
      //     // Aquí puedes manejar el error como quieras. Por ejemplo, podrías mostrar un mensaje de error.
      //     this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
      //     const err = new Error(error); 
      //     throwError(() => err);
      //   }
  
      //   // Reenvía el error para que cualquier suscriptor pueda manejarlo también.
      //   return of([]);
      // })
      ;
      // return this.http.get<ApiResponse>(`${this.openFoodFactsUrl}`, { params })
      // return this.http.get<any>(`${this.openFoodFactsUrl}`, { params }).pipe(
      //   map(response => {
      //     console.log('response', response);
      //     return response.products.map((product: { product_name_es: any; image_front_small_url: any; nutriments: any; ecoscore_grade: any; nutrition_grades: any; nova_group: any; }) => ({
      //       title: product.product_name_es,
      //       imageUrl: product.image_front_small_url,
      //       nutritionalInfo: product.nutriments,
      //       ecoScore: product.ecoscore_grade,
      //       nutriScore: product.nutrition_grades,
      //       novaGroup: product.nova_group
      //     } as ApiProduct))
      //   }),
      //   catchError(error => {
      //     console.error('Error:', error);
      //     return throwError(error);
      //   })
      // )
  }
  // searchProducts(productName: string): Observable<any[]> {
  //   search_terms=${encodeURIComponent(nombre)}&page=1&page_size=${pageSize}&json=true&lc=${language}&countries=${country}`);
  //   return this.http.get<any[]>(`http://localhost:3000/apiFoods?nombre=${encodeURIComponent(productName)}`);
  // }


}
