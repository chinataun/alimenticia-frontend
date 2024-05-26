import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RespuestaBusquedaRelacionada } from '../interface/interface.component';


@Injectable({
    providedIn: 'root'
  })
  export class ListaComparadorService {
    private baseUrl = 'http://localhost:3000'; // Reemplaza con la URL de tu servidor
  
    constructor(private http: HttpClient) {}
  
    buscarDetallado(marca: string, nombreProducto: string): Observable<RespuestaBusquedaRelacionada> {
        const url = `${this.baseUrl}/buscarDetallado/${marca.toLowerCase()}/${encodeURIComponent(nombreProducto)}`;
        // Convertir la marca a minúsculas para asegurar consistencia en las URLs
        return this.http.get<RespuestaBusquedaRelacionada>(url);
      }
      
  }