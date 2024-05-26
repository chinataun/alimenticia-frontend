import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categoria, Dificultad, RecetaActualizada, Unidades } from '../interface/interface.component';
import { AuthService } from './authService.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RecetasActualizadasService {

  private baseUrl = environment.API_BASE_URL;
  categorias$ = this.getCategories()

  servidor="https://alimenticia-api-62c500e9b184.herokuapp.com";

  constructor(private http: HttpClient,private authService: AuthService) {}

obtnerRecetassubidasPorElUsuario():Observable<RecetaActualizada[]> {
  const url = `${this.servidor}/prueba/recetas/misrecetas`;

  // Configura las opciones de la solicitud para permitir cookies si es necesario
  const httpOptions = {
    withCredentials: true,
  };

  return this.http.get<RecetaActualizada[]>(url, httpOptions);
}
  crearReceta(receta: FormData): Observable<{ id_receta: number }> {
    const httpOptions = {
      withCredentials: true,
    };
  
    return this.http.post<{ id_receta: number }>(`${this.servidor}/prueba/crearRecetaConIngredientes`, receta,httpOptions);
  }

//obtner el ultimo id de la base de datos para la creacion de recetas:
buscarProductos(marca: string, nombreAlimento: string): Observable<any> {
  // Implementa lógica para buscar productos en el backend
  const params = new HttpParams().set('marca', marca).set('nombrealimento', nombreAlimento);
  return this.http.get(`${this.servidor}/recetasActualizadas/buscar`, { params });
}

obtenerCategorias(): Observable<Categoria[]> {
  return this.http.get<Categoria[]>(`${this.servidor}/prueba/categorias`);
}
getCategories(): Observable<Categoria[]> {
  return this.http.get<Categoria[]>(`${this.baseUrl}/prueba/categorias`);
}


obtenerDificultades(): Observable<Dificultad[]> {
  return this.http.get<Dificultad[]>(`${this.servidor}/prueba/dificultad`);
}

buscarRecetas(nombre: string, nombrecategoria: string): Observable<any> {
  const params = new HttpParams()
    .set('titulo', nombre)
    .set('id_categoria', nombrecategoria)
    

  return this.http.get(`${this.servidor}/prueba/buscar-recetas`, { params });
}



getAllRecetas():Observable<any>{
  return this.http.get(`${this.servidor}/prueba/obtenerRecetas`); // Reemplaza '/api/recetas' con tu ruta real.
}
obtenerUnidades(): Observable<Unidades[]> {
  return this.http.get<Unidades[]>(`${this.servidor}/prueba/unidades-medida`);
}

obtenerDetallesReceta(idReceta: number): Observable<any> {
  const url = `${this.servidor}/prueba/receta/${idReceta}`;
  return this.http.get<RecetaActualizada>(url);
}
private recetaSeleccionadaIdSource = new BehaviorSubject<number | null>(null);
  recetaSeleccionadaId$ = this.recetaSeleccionadaIdSource.asObservable();

  setRecetaSeleccionadaId(recetaId: number | null) {
    this.recetaSeleccionadaIdSource.next(recetaId);
  }


  agregarRecetaFavorita(usuarioId: number, recetaId: number): Observable<any> {
    return this.http.post(`${this.servidor}/user/usuarios/${usuarioId}/favoritos/${recetaId}`, {});
  }

  private idRecetaSeleccionada?: number;

  setIdRecetaSeleccionada(idReceta: number): void {
    this.idRecetaSeleccionada = idReceta;
  }

  getIdRecetaSeleccionada(): number | undefined {
    return this.idRecetaSeleccionada;
  }



  imagenReceta(rutaImagen?: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers, withCredentials: true, responseType: 'blob' as 'json' };
    const url = `${this.servidor}/imagenes/recetas-imagen/${rutaImagen}`;
    return this.http.get(url, options) as Observable<Blob>;
  }
  
}