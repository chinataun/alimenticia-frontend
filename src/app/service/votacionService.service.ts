// votacion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {
  private baseUrl = "https://alimenticia-api-62c500e9b184.herokuapp.com/prueba/recetas"; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  obtenerPuntuacionTotalReceta(idReceta: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/puntuacion/${idReceta}`);
  }
  votarReceta(idReceta: number, idUsuario: number, puntuacion: number, comentario:string): Observable<any> {
    const httpOptions = {
      withCredentials: true,
    };
    const url = `${this.baseUrl}/${idReceta}/votar`;
    const body = { id_usuario: idUsuario, puntuacion,comentario };
  
    return this.http.post(url, body,httpOptions).pipe(
      catchError(error => {
        console.error('Error en la votación:', error);
        throw error;
      })
    );
  }
  
}
