import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResultadoProducto } from '../interface/interface.component';

@Injectable({
  providedIn: 'root',
})
export class BuscarSupermercadoService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  buscar(termino: string): Observable<{ dia: ResultadoProducto[], ahorramas: ResultadoProducto[] ,eroski:ResultadoProducto[]}> {
    const url = `${this.baseUrl}/buscar/${termino}`;
    return this.http.get<{ resultados: { dia: ResultadoProducto[], ahorramas: ResultadoProducto[] , eroski:ResultadoProducto[]} }>(url).pipe(
      map(response => response.resultados)
    );
  }

  buscarDetallado(marca: string, nombreProducto: string): Observable<{ resultado: ResultadoProducto, detalles: ResultadoProducto[] }> {
    const url = `${this.baseUrl}/buscarDetallado/${marca}/${nombreProducto}`;
    return this.http.get<{ resultado: ResultadoProducto, detalles: ResultadoProducto[] }>(url);
  }

  obtenerResultadosDesdeDB(idBusqueda: number): Observable<ResultadoProducto[]> {
    const url = `${this.baseUrl}/obtenerResultadosDesdeDB/${idBusqueda}`;
    return this.http.get<{ resultados: ResultadoProducto[] }>(url).pipe(
      map(response => response.resultados)
    );
  }
  
  

  obtenerBusquedasDesdeDB(termino: string): Observable<{ id: number }> {
    const url = `${this.baseUrl}/obtenerBusquedasDesdeDB/${termino}`;
    return this.http.get<{ id: number }>(url);
  }
  

  buscarExistente(termino: string): Observable<{ existente: boolean, id?: number }> {
    const url = `${this.baseUrl}/buscarExistente/${termino}`;
    return this.http.get<{ existente: boolean, id?: number }>(url);
  }
  
  
}
