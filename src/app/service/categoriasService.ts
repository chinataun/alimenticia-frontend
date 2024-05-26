import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private url = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  getCategoriasReceta(): Observable<any> {
    return this.http.get<any>(this.url + '/api/categorias/recetas');
  }

  getCategoriasAlimento(): Observable<any> {
    return this.http.get<any>(this.url + '/api/categorias/alimentos');
  }

  getSupermercadosActivos(): any[] {
    return [
      { name: 'alcampo' },
      { name: 'ahorramas' },
      { name: 'dia' },
      { name: 'eroski' },
    ];
  }

  getDificultadReceta(): any[] {
    return [
      { nombre: 'Fácil' },
      { nombre: 'Medio' },
      { nombre: 'Difícil' },
      { nombre: 'Experto' },
    ];
  }

}