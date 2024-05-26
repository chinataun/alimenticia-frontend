import { InformacionNutricional } from './../interface/interface.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InformacionNutricionalService {
  private baseUrl  = 'http://localhost:3000/dietetica/informacion-nutricional';

  constructor(private http: HttpClient) {}

  obtenerTodosLosAlimentos(): Observable<any>{
    return this.http.get(`${this.baseUrl}`); // Reemplaza '/api/recetas' con tu ruta real.
  }

 /* buscarAlimentos(nombre: string): Observable<InformacionNutricional[]> {
    return this.http.get<InformacionNutricional[]>(`${this.baseUrl}/buscar/${nombre}`);
  }
*/
// InformacionNutricionalService
buscar(nombre: string): Observable<any> {
  // Crea un objeto HttpParams para agregar los parámetros de búsqueda
  let params = new HttpParams();

  if (nombre) {
    params = params.set('nombre', nombre); // Change 'titulo' to 'nombre'
  }

  // Realiza la solicitud GET con los parámetros de búsqueda
  return this.http.get(`${this.baseUrl}/buscar`, { params: params });
}



}
