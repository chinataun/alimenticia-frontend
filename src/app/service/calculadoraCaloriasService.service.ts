import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalculadoraCalorias, CaloriasResponse } from '../interface/interface.component';


@Injectable({
  providedIn: 'root',
})
export class CalculadoraCaloriasService {
  private apiUrl = 'http://localhost:3000'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {}

  calcularCalorias(datos: CalculadoraCalorias): Observable<CaloriasResponse> {
    return this.http.post<CaloriasResponse>(`${this.apiUrl}/dietetica/calcular`, datos);
  }

  calcularCaloriasUsuarioRegistrado(datos: CalculadoraCalorias): Observable<CaloriasResponse> {
    const httpOptions = {
      withCredentials: true,
    };
    return this.http.post<CaloriasResponse>(`${this.apiUrl}/dietetica/calcularRegistro`, datos,httpOptions);
  }
}