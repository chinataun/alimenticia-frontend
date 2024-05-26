import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListaCompra2, RespuestaListaCompra, ResultadoProducto } from '../interface/interface.component';

@Injectable({
    providedIn: 'root'
  })
  export class ListaCompraService {
    servidor="https://alimenticia-api-62c500e9b184.herokuapp.com";
  
    constructor(private http: HttpClient) {}
  
    agregarProductoALista(producto: any): Observable<RespuestaListaCompra> {
      const url = `${this.servidor}/lista_compras/create`;
      return this.http.post<RespuestaListaCompra>(url, producto);
    }
  
    obtenerListasCompra(usuarioId: number): Observable<ListaCompra2[]> {
      const httpOptions = {
        withCredentials: true,
      };
      const url = `${this.servidor}/lista_compras/listasCompra/${usuarioId}`;
      return this.http.get<ListaCompra2[]>(url,httpOptions);
    }

      guardarListaCompra(listaCompra: any): Observable<any> {
       
        const url = `${this.servidor}/lista_compras/crear`;
        return this.http.post<any>(url, listaCompra);
      }
  }