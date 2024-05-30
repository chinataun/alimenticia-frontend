import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { Alimento } from './alimentos-temporada.interface';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private http: HttpClient,
    private httpClient: HttpClient, 
    private toastr: ToastrService) {}

  getAlimentos(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.baseUrl}/api/alimentos/temporada`);
  }


  getAlimentos2(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.baseUrl}/api/alimentos/temporada`).pipe(
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
    return this.http.get<Alimento[]>(`${this.baseUrl}/api/alimentos/${mes}`);
  }
}
