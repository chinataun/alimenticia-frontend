import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/user.service';
import { Producto } from './producto.categoria.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl = environment.API_BASE_URL;

  private productosSubject = new BehaviorSubject<any[]>([]);
  productos$ = this.productosSubject.asObservable();
  userSuper!: string | undefined;
  userMarket$ = this.userService.user_profile$.pipe(
    map(user => user?.supermercado)
    );
  
  constructor(
    private httpClient: HttpClient, 
    private authService: AuthService, 
    private toastr: ToastrService,
    private userService: UserService,
  ) {
    this.userMarket$.subscribe(supermercado => this.userSuper = supermercado);
   }

  getProductos(termino: string): Observable<any[]> {

    let supermk: string | null = null; 

    if (this.userSuper !== undefined) {
      supermk = this.userSuper;
    } else {
      supermk = this.getSupermercado();
    }
  
    const params = new HttpParams().set('marca', String(supermk));
    return this.httpClient.get<any[]>(`${this.baseUrl}/api/productos/buscar/${termino}`, {params})
    .pipe(
      tap(results => {
        console.log(results);
        this.productosSubject.next(results);
      }),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return of([]);
      })
    );
  };

  getProductoSimilar(producto: Producto): Observable<any> {
    // producto.super = producto.super.toLowerCase();
    console.log(JSON.stringify(producto));
    const params = new HttpParams().set('producto', JSON.stringify(producto));
    return this.httpClient.get<any[]>(`${this.baseUrl}/api/productos/similar/`, {params});
  }
    
  // Guardar el supermercado en sessionStorage cuando un usuario no registrado elige un supermercado
  setSupermercado(supermercado: string) {
      sessionStorage.setItem('supermercado', supermercado);

  }

  // Obtener el supermercado de sessionStorage
  getSupermercado(): string | null {
    return sessionStorage.getItem('supermercado');
  }

  deleteSupermercado() {
    sessionStorage.removeItem('supermercado');
  }

}
