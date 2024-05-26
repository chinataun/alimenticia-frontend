import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { Mes, Categorias, DetallesAlimentosTemporada } from '../interface/interface.component';
import { Alimento } from './alimentos-temporada.interface';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/authService.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlimentosTemporadaService {


  private baseUrl = environment.API_BASE_URL;
  
  private alimentosSubject = new BehaviorSubject<Alimento[]>([]);
  alimentos$ = this.alimentosSubject.asObservable();


  private alimentoSubject = new BehaviorSubject<Alimento>({} as Alimento);
  alimento$ = this.alimentoSubject.asObservable();

  private productosSubject = new BehaviorSubject<any>({});
  productos$ = this.productosSubject.asObservable();

  private apiUrl = 'http://localhost:3000';  // Cambia esto a la URL de tu API

  private backendUrl = 'http://localhost:3000/alimentos'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient,
    private httpClient: HttpClient, 
    private authService: AuthService, 
    private toastr: ToastrService) {}

  // obtenerTodosLosMeses(): Observable<Mes[]> {
  //   const url = `${this.backendUrl}/alimentos/alimentoTemporada`;
  //   return this.http.get<Mes[]>(url);
  // }

  // obtenerCategoriasPorMes(mes: string): Observable<Categorias[]> {
  //   const url = `${this.backendUrl}/alimentos/alimentoTemporada/${mes}`;
  //   return this.http.get<Categorias[]>(url);
  // }

  // obtenerAlimentosPorMesYCategoria(mes: string, categoria: string): Observable<Alimento[]> {
  //   const url = `${this.backendUrl}/alimentos/alimentoTemporada/${mes}/${categoria}`;
  //   return this.http.get<Alimento[]>(url);
  // }

  // obtenerDetallesAlimento(mes: string, categoria: string, nombre: string): Observable<DetallesAlimentosTemporada> {
  //   const url = `${this.backendUrl}/alimentos/alimentoTemporada/${mes}/${categoria}/${nombre}`;
  //   return this.http.get<DetallesAlimentosTemporada>(url);
  // }

  obtenerTodosLosMeses(): Observable<Mes[]> {
    return this.http.get<Mes[]>(`${this.backendUrl}/alimentoTemporada/meses`);
  }

  obtenerTodasLasCategorias(): Observable<Categorias[]> {
    return this.http.get<Categorias[]>(`${this.backendUrl}/alimentoTemporada/categorias`);
  }

  obtenerAlimentosPorMesYCategoria(mes: string, categoria: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/alimentoTemporada/${mes}/${categoria}`);
  }

  obtenerDetallesAlimento(mes: string, categoria: string, nombre: string): Observable<DetallesAlimentosTemporada> {
    return this.http.get<DetallesAlimentosTemporada>(`${this.backendUrl}/alimentoTemporada/${mes}/${categoria}/${nombre}`);
  }


  getAlimentos(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.apiUrl}/api/alimentos/temporada`);
  }


  getAlimentos2(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.apiUrl}/api/alimentos/temporada`).pipe(
      tap(results => {
        this.alimentosSubject.next(results);
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
    )
  }

  getAlimento(nombre: string): any {
    return this.httpClient.get<Alimento>(`${this.baseUrl}/api/alimentos/${nombre}`);
  };

  getBusquedaAlimento(nombre: string): any {
    return this.httpClient.get<any>(`${this.baseUrl}/api/alimentos/busqueda/${nombre}`);
  };

  getAlimentosByMonth(mes: string): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.apiUrl}/api/alimentos/${mes}`);
  }
}
