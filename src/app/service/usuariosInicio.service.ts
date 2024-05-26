import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Usuario } from '../interface/interface.component';
@Injectable({
  providedIn: 'root'
})
export class UsuariosInicioService {

  servidor="https://alimenticia-api-62c500e9b184.herokuapp.com";
  constructor(private http: HttpClient) {}

  inicioUsuario( email: string, contrasena: string): Observable<any> {
    const body = {  email, contrasena };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers, withCredentials: true };
    return this.http.post(this.servidor + '/user/iniciar-sesion', body,  options).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
 
  obtenerInformacionUsuario(): Observable<Usuario> {
    // Utiliza el servidor y ruta correctos para obtener la información del usuario
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers, withCredentials: true };
    return this.http.get<Usuario>(`${this.servidor}/user/informacion`,options);
  }

  obtenerRutaImagenUsuario(rutaImagen?: string): Observable<{ rutaImagen: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers, withCredentials: true };
    const url = `${this.servidor}${rutaImagen}`;
    return this.http.get<{ rutaImagen: string }>(url, options);
  }
  
  

  imagenUsuario(rutaImagen?: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers, withCredentials: true, responseType: 'blob' as 'json' };
    const url = `${this.servidor}/imagenes/usuario-imagen/${rutaImagen}`;
    return this.http.get(url, options) as Observable<Blob>;
  }
  
}