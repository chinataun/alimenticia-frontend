import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FavoritesCredentials, Receta, RecetaCredentials, UserRecetaCredentials } from './receta';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { UserProfile } from '../user/model/user-profile.interface';
import { Autor } from '../user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private baseUrl = environment.API_BASE_URL;
  userId!: number | undefined;


  private autor = new BehaviorSubject<Autor>({} as Autor);
  autor$ = this.autor.asObservable();

  private recetasSubject = new BehaviorSubject<Receta[]>([]);
  recetas$ = this.recetasSubject.asObservable();

  private favoriteRecipesSubject = new BehaviorSubject<Receta[]>([]);
  favoriteRecipes$ = this.favoriteRecipesSubject.asObservable();

  private createdRecipesSubject = new BehaviorSubject<Receta[]>([]);
  createdRecipes$ = this.createdRecipesSubject.asObservable();  

  private recetaSubject = new BehaviorSubject<Receta>({} as Receta);
  receta$ = this.recetaSubject.asObservable();

  constructor(
    private httpClient: HttpClient, 
    private authService: AuthService, 
    private toastr: ToastrService,
    private router: Router,
    ) {
      this.authService.user$.subscribe(user => {
        this.userId = user?.userId;
      })
  };

  //dones
  getRecetas(): Observable<Receta[]> {
    return this.httpClient.get<Receta[]>(`${this.baseUrl}/api/recetas`)
    .pipe(
      tap(results => {
        this.recetasSubject.next(results);
      }),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return of([]);
      })
    );
  };
  
  updateRecipes(): void {
    this.getRecetas().subscribe(
      recipes => this.createdRecipesSubject.next(recipes)
    );
  }

  //dones
  getFavoriteRecipes(): Observable<Receta[]> {
    if (!this.userId) {
      return of([]);
    }
    const params = new HttpParams().set('userId', String(this.userId));
    //Si no hay user ide no se realiza la llamada
    return this.httpClient.get<Receta[]>(`${this.baseUrl}/api/recetas/recetas-favoritas`, {params})
    .pipe(
      tap(results => {
        this.favoriteRecipesSubject.next(results);
      }),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return of([]);
      })
    );
  }
  updateFavoriteRecipes(): void {
    this.getFavoriteRecipes().subscribe(
      recipes => {this.favoriteRecipesSubject.next(recipes);}
    );
  }

  addFavorite(receta: Receta): Observable<any> {
    const recetaId = receta.id;
    const userId = Number(this.userId);
    const credentials: FavoritesCredentials = { recetaId, userId };
    return this.httpClient.post<any>(`${this.baseUrl}/api/recetas/addFavorite`, credentials).pipe(
      tap(() => this.updateFavoriteRecipes()
      ),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return EMPTY;
      })
    );
  }
  removeFavoriteRecipe(receta: Receta): Observable<any> {
    const recetaId = receta.id;
    const userId = Number(this.userId);
    const credentials: FavoritesCredentials = { recetaId, userId };
    return this.httpClient.post<any>(`${this.baseUrl}/api/recetas/removeFavorite`, credentials).pipe(
      tap(() => this.updateFavoriteRecipes()
      ),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return EMPTY;
      })
    );
  }

  //dones
  getCreatedRecipes(): Observable<Receta[]> {

    const params = new HttpParams().set('userId', String(this.userId));
    return this.httpClient.get<Receta[]>(`${this.baseUrl}/api/recetas/mis-recetas`, {params})
    .pipe(
      tap(results => {
        this.createdRecipesSubject.next(results);
      }),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return of([]);
      })
    );
  }
  updateCreatedRecipes(): void {
    this.getCreatedRecipes().subscribe(
      recipes => {this.createdRecipesSubject.next(recipes);}
    );
  }
  removeCreatedRecipe(receta: Receta): Observable<any> {
    const recetaId = receta.id;
    const userId = Number(this.userId);
    const credentials: FavoritesCredentials = { recetaId, userId };
    return this.httpClient.post<any>(`${this.baseUrl}/api/recetas/removeCreated`, credentials).pipe(
      tap(() => this.updateCreatedRecipes()
      ),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return EMPTY;
      })
    );
  }
  isFavorite(recipeId: Receta): Observable<boolean> {
    return this.favoriteRecipes$.pipe(map(recipes => 
      recipes.some(recipe => recipe.id === recipeId.id)));
  }  

  //dones
  getReceta(id: number): Observable<Receta> {
    const params = new HttpParams().set('id', String(id));
    return this.httpClient.get<Receta>(`${this.baseUrl}/api/recetas/receta/${id}`).pipe(
      map(receta => {
        if (typeof receta.ingredientes === 'string' && typeof receta.pasos === 'string') {
          receta.ingredientes = JSON.parse(receta.ingredientes);
          receta.pasos = JSON.parse(receta.pasos);
        }
        if (receta.votos) {
          receta.votos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return receta;
      }),
      tap(receta => {
        this.recetaSubject.next(receta);
      })
    );
  };

  addReceta(receta: FormData): Observable<any> {
    receta.append('userId', String(this.userId));
    return this.httpClient.post<any>(`${this.baseUrl}/api/recetas/add`, receta).pipe(
      tap((newReceta) => {
        const currentRecetas = this.recetasSubject.getValue();
        this.recetasSubject.next([...currentRecetas, newReceta.receta]);
        //redirigir a la edicion de la receta creada
        this.router.navigate(['/recetas/receta/edit', newReceta.receta.id]);
      }),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return EMPTY;
      })
    );
  }
  updateReceta(receta: FormData): Observable<any> {
    
    return this.httpClient.put<any>(`${this.baseUrl}/api/recetas/edit`, receta).pipe(
      tap(() => {
        this.updateRecipes();
        this.updateCreatedRecipes();
      }),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return EMPTY;
      })
    );
  }

  updateRecetaActualizada(receta: Receta): void {
    this.recetaSubject.next(receta);
  }
  
  getUserRecetas(id: string | null): Observable<Autor> {
    const params = new HttpParams().set('userId', id || '');

    return this.httpClient.get<Autor>(`${this.baseUrl}/api/recetas/user`, {params})
      .pipe(
        tap(autor => {
          this.autor.next(autor);
        }),
        catchError((error) => {
          this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
          if (error.status === 401) {
            const err = new Error(error); 
            throwError(() => err);
          }
          return of({} as Autor);
        })
      );
  }

  votarReceta(idReceta: number, puntuacion: number, comentario?: string): Observable<any> {
    const userId = this.userId;
    const body = { userId, idReceta, puntuacion, comentario };
    return this.httpClient.post<any>(`${this.baseUrl}/api/recetas/votar`, body).pipe(
    // Utiliza el operador switchMap para obtener la receta actualizada después de votar
    // Utiliza el operador tap para emitir la receta actualizada a través de recetaSubject
    tap(
      (results) => {
        this.recetaSubject.next(results.receta)
        this.toastr.success(results.message);
      }
    ),
      catchError((error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        if (error.status === 401) {
          const err = new Error(error); 
          throwError(() => err);
          //return throwError(new InvalidCredentialsError());
        }
        
        return EMPTY;
      })
    );
    
  }

  isVoted(idReceta: number): Observable<{voted: boolean, rating?: number, comment?: string}> {
    const params = new HttpParams().set('userId', String(this.userId)).set('recetaId', String(idReceta));
    return this.httpClient.get<{voted: boolean, rating?: number, comment?: string}>(`${this.baseUrl}/api/recetas/isVoted`, {params});
  }

}