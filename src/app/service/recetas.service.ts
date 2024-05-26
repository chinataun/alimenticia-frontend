import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LastRecetaIdResponse, RecetaActualizada, Recetas } from '../interface/interface.component';
import { AuthService } from './authService.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RecetasService {

  servidor="http://localhost:3000";

  constructor(private http: HttpClient,private authService: AuthService) {}

 /* getAllRecetas():Observable<any>{
    return this.http.get(`${this.servidor}/recetas`); // Reemplaza '/api/recetas' con tu ruta real.
  }*/

  getAllRecetas():Observable<any>{
    return this.http.get(`${this.servidor}/prueba/obtenerRecetas`); // Reemplaza '/api/recetas' con tu ruta real.
  }


  getRecetasByName(name: string):Observable<any> {
    return this.http.get(`${this.servidor}/recetas/${name}`); // Reemplaza '/api/recetas' con tu ruta real.
  }
  buscarRecetas(nombre: string, dificultad: string): Observable<any> {
    // Crea un objeto HttpParams para agregar los parámetros de búsqueda
    let params = new HttpParams();

    if (nombre) {
      params = params.set('titulo', nombre);
    }

    if (dificultad) {
      params = params.set('dificultad', dificultad);
    }

    // Realiza la solicitud GET con los parámetros de búsqueda
    return this.http.get(`${this.servidor}/recetas/search`, { params: params });
  }

  agregarRecetaFavorita(usuarioId: number, recetaId: number): Observable<any> {
    return this.http.post(`${this.servidor}/user/usuarios/${usuarioId}/favoritos/${recetaId}`, {});
  }

  obtenerRecetasFavoritas(usuarioId: number): Observable<Recetas[]> {
    const url = `${this.servidor}/user/usuarios/${usuarioId}/favoritos`;

    // Configura las opciones de la solicitud para permitir cookies
    const httpOptions = {
      withCredentials: true,
    };

    return this.http.get<Recetas[]>(url, httpOptions);
  }
  obtenerRecetaFavorita(usuarioId: number, recetaId: number): Observable<Recetas> {
    const url = `${this.servidor}/user/usuarios/${usuarioId}/recetas/${recetaId}`;
  
    // Configura las opciones de la solicitud para permitir cookies
    const httpOptions = {
      withCredentials: true,
    };
  
    return this.http.get<Recetas>(url, httpOptions);
  }
  
  crearReceta(nuevaReceta:Recetas):Observable<Recetas>{
    const url = `${this.servidor}/recetas/crear`;
  
    // Configura las opciones de la solicitud para permitir cookies
    const httpOptions = {
      withCredentials: true,
    };
  
    return this.http.post<Recetas>(url, nuevaReceta, httpOptions);
  }

//obtner el ultimo id de la base de datos para la creacion de recetas:

getLastRecetaId(): Observable<number> {
  const url = `${this.servidor}/recetas/lastid`;

  return this.http.get<LastRecetaIdResponse>(url).pipe(
    map(response => response.lastId)
  );
}




eliminarRecetaPorId(recetaId: number): Observable<any> {
  const url = `${this.servidor}/recetas/eliminar/${recetaId}`;

  // Configura las opciones de la solicitud para permitir cookies si es necesario
  const httpOptions = {
    withCredentials: true,
  };

  return this.http.delete(url, httpOptions);
}
actualizarReceta(recetaId: number, titulo: string, tipo_plato: string, dificultad: string): Observable<any> {
  const url = `${this.servidor}/recetas/modificar/${recetaId}`;

  // Configura las opciones de la solicitud para permitir cookies si es necesario
  const httpOptions = {
    withCredentials: true,
  };

  const body = { titulo, tipo_plato, dificultad };

  return this.http.put(url, body, httpOptions);
}

}
