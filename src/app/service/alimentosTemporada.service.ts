import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mes, Categorias, Alimento, DetallesAlimentosTemporada } from '../interface/interface.component';


@Injectable({
  providedIn: 'root',
})
export class AlimentoTemporadaServicie {
  private backendUrl = 'https://alimenticia-api-62c500e9b184.herokuapp.com/alimentos'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

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
}
