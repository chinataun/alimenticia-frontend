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

  private productosSubject = new BehaviorSubject<ApiProduct[]>([]);
  productos$ = this.productosSubject.asObservable();

  private totalProductsSubject = new BehaviorSubject<number>(0);
  totalProducts$ = this.totalProductsSubject.asObservable();

  private openFoodFactsUrl = 'https://world.openfoodfacts.org/cgi/search.pl';

  constructor(
    private http: HttpClient,    
    private toastr: ToastrService,
  ) {}

  calcularCalorias(datos: Calculadora): Observable<CaloriasResponse> {
    return this.http.post<CaloriasResponse>(`${this.baseUrl}/api/dietetica/calculadora`, datos);
  }

  searchProducts(productName: string, page: number = 1, pageSize: number = 10): Observable<ApiProduct[]> {
    const params = new HttpParams()
      .set('search_terms', productName)
      .set('search_simple', 1)
      .set('action', 'process')
      .set('sort_by', 'unique_scans_n')
      .set('page_size', pageSize.toString())
      .set('page', page.toString())
      .set('lc', 'es')
      .set('countries', 'en:Spain')
      .set('json', 'true');

      return this.http.get<ApiResponse>(`${this.openFoodFactsUrl}`, { params })
       .pipe(
        map(response => {
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

         return productos;
        }),
        catchError(error => {
          if (error.status === 0) {
            this.toastr.error('Se ha producido un error en la API de search food facts. Intentelo de nuevo más tarde.');
          }
          return of([]);
        })
      );
  }
}
