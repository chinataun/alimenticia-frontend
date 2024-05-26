// informacion-nutricional.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dieta } from '../interface/interface.component';

@Injectable({
  providedIn: 'root',
})
export class DietaService {
  private baseUrl = 'http://localhost:3000/dietetica/dieta'; // Reemplaza con la URL correcta de tu backend

  constructor(private http: HttpClient) {}


  obtenerAlimentos(nombre?: string): Observable<any> {
    const url = `${this.baseUrl}/alimentos-saludables`;
    
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }

    return this.http.get(url, { params });
  }
  obtenerDiasSemanales(): Observable<any> {
    const url = `${this.baseUrl}/dias-semanales`;
    return this.http.get<any>(url);
  }
  obtenerComidasAlDia(): Observable<any> {
    const url = `${this.baseUrl}/comidas-aldia`;
    return this.http.get<any>(url);
  }
  agregarAlimentoDieta(id_alimento: number, momento_dia: string, cantidad: number): Observable<any> {
    const url = `${this.baseUrl}/agregarAlimento`;
    const body = { id_alimento, momento_dia, cantidad };
    return this.http.post(url, body);
  }

  obtenerDietaCompleta(): Observable<Dieta[]> {
    const url = `${this.baseUrl}/obtenerDietaCompleta`;
    return this.http.get<Dieta[]>(url);
  }
}
