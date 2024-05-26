import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  servidor="https://alimenticia-api-62c500e9b184.herokuapp.com";
  constructor(private http: HttpClient) {}

  // registrarUsuario(nombre: string, email: string, contrasena: string,confirmarContrasena:string, apodo:string, imagen:string): Observable<any> {
  //   const body = { nombre, email, contrasena, confirmarContrasena, apodo, imagen };
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   return this.http.post(this.servidor + '/user/registro', body, { headers }).pipe(
  //     catchError((error) => {
  //       return throwError(error);
  //     })
  //   );
  // }

  registrarUsuario(formData: FormData): Observable<any>{
    const nombre = formData.get('nombre');
const edad = formData.get('apodo');

console.log('Nombre:', nombre); // Imprime: "John Doe"
console.log('Edad:', edad); // Imprime: "30"
    return this.http.post(`${this.servidor}/user/registro`, formData )

  }

  subirImagen(formData: FormData): Observable<any> {
    return this.http.post(`${this.servidor}/imagenes/usuario-imagen`, formData);
  }
}