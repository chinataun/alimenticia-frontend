import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subscription, of, throwError } from 'rxjs';
import { catchError, defaultIfEmpty, delay, map, switchMap, tap } from 'rxjs/operators';
import { SigninCredentials } from '../auth/login-credentials';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FavoritesCredentials, Receta } from '../recetas/receta';
import { AuthService } from '../auth/auth.service';
import { RecetasService } from '../recetas/recetas.service';
import { ToastrService } from 'ngx-toastr';
import { ChangePassword, UserProfile } from './model/user-profile.interface';
import { Carrito } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseUrl = environment.API_BASE_URL;

  private carritos = new BehaviorSubject<Carrito[]>([]);
  carritos$ = this.carritos.asObservable();

  private user_profile = new BehaviorSubject<UserProfile | null >(null);
  user_profile$ = this.user_profile.asObservable();

  private user_id: number | undefined;
  private subscription: Subscription;

  userImage$: Observable<string>;

  userCp$: Observable<string>;


  private selectedSupermarket = new BehaviorSubject<string | null | undefined>(null);
  selectedSupermarketChanged$ = this.selectedSupermarket.asObservable();


  private favorite_recetas = new BehaviorSubject<Receta[]>([]);
  favorite_recetas$ = this.favorite_recetas.asObservable();

  private mis_recetas = new BehaviorSubject<Receta[]>([]);
  mis_recetas$ = this.mis_recetas.asObservable();

  userId!: Number | undefined;

  constructor(
    private httpClient: HttpClient, 
    private authService: AuthService,
    private toastr: ToastrService, 
    private recetasService: RecetasService) {
      
      this.subscription = this.authService.user$.subscribe(user => {
        this.user_id = user?.userId;
      });
      this.getUserProfile().subscribe(user => {
        this.user_profile.next(user);
        this.selectedSupermarket.next(user?.supermercado)  
      });

      this.userId = this.user_profile.value?.id;

      this.userImage$ = this.user_profile$.pipe(
        map(user => user?.imagen || ''), // Use the empty string as a fallback value if user?.imagen is undefined
        defaultIfEmpty('')
      );
      this.userCp$ = this.user_profile$.pipe(
        map(user => user?.cp || ''), // Use the empty string as a fallback value if user?.imagen is undefined
        defaultIfEmpty('')
      );
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
  isUsernameAvailable(username: string): Observable<boolean> {
    const result = username === 'admin' ? false : true;
    return of(result).pipe(delay(1000));
  }


  
  getUserProfile(): Observable<UserProfile | null> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (!userId) {
          return of(null);
        }
        const params = new HttpParams().set('userId', String(userId));
        return this.httpClient.get<UserProfile>(`${this.baseUrl}/api/user`, {params});
      })
    );
  }

  
  updateUser(userProfile: FormData): Observable<any> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        userProfile.append('userId', String(userId));
        const params = new HttpParams().set('userId', String(userId));
        return this.httpClient.put<UserProfile>(`${this.baseUrl}/api/user/edit`, userProfile, {params});
      })
    );
  }

 
  isOldPasswordValid(oldPassword: string): Observable<boolean> {

        const params = new HttpParams()
        .set('oldPassword', oldPassword)
        .set('userId', String(this.user_id));// Fix: Pass oldPassword as a separate argument to the set method
        return this.httpClient.get<boolean>(`${this.baseUrl}/api/user/check-password`, {params}).pipe(map(response => response))
        .pipe(delay(1000));
  }

  changePassword(data: ChangePassword): Observable<any> {
    const params = new HttpParams()
    .set('userId', String(this.user_id))
    return this.httpClient.put<ChangePassword>(`${this.baseUrl}/api/user/change-password`, data, {params});    
  }


  // getSupermarket(): Observable<any> {
  //   const params = new HttpParams().set('cp', String(cp));
  //   return this.httpClient.get(`${this.baseUrl}/api/user/supermarket`, {params}).pipe(
  //     map((response: any) => {
  //       return response; // Fix: Access the 'supermarkets' property using bracket notation
  //     })
  //   );
  // }
  getSupermarket(): Observable<any> {
    return this.user_profile$.pipe(
      switchMap(user => {
        const params = new HttpParams().set('cp', String(user?.cp));
        return this.httpClient.get(`${this.baseUrl}/api/user/supermarket`, {params}).pipe(
          map((response: any) => {
            return response;
          })
        );
      })
    );
  }
  setSupermercadoFavorito(supermercado: any): void {
    const params = new HttpParams()
    .set('userId', String(this.user_id))
    this.httpClient.put<any>(`${this.baseUrl}/api/user/setSupermarketFavorite`, supermercado, {params})
    .subscribe((response) => {
      this.toastr.success(response.msg);
      this.user_profile.next(response.user);
      this.selectedSupermarket.next(response.user.supermercado)
      
    })
  }

  updateCp(cp: any): void {
    const params = new HttpParams()
    .set('userId', String(this.user_id))
    .set('cp', cp);
    this.httpClient.put<any>(`${this.baseUrl}/api/user/setCp`, cp, {params}).subscribe((response) => {
      this.toastr.success(response.msg);
      this.user_profile.next(response.user);
      
    })
  }

  getCarritos(): Observable<Carrito[]> {
    const params = new HttpParams().set('userId', String(this.user_id));
    return this.httpClient.get<Carrito[]>(`${this.baseUrl}/api/user/compras`, {params}).pipe(
      tap(results => {
        this.carritos.next(results);
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
  
  eliminarCarrito(id: string): Observable<Carrito[]> {
    const params = new HttpParams()
    .set('userId', String(this.user_id))
    .set('id', id);
    return this.httpClient.delete<Carrito[]>(`${this.baseUrl}/api/user/compras`, {params}).pipe(
      tap((results) => {
        this.carritos.next(results);
        this.toastr.success('Carrito eliminado correctamente');
        
      })
    )
  }

  deleteUser(userId: string): Observable<any> {
    const params = new HttpParams()
    .set('userId', userId)
    return this.httpClient.delete(`${this.baseUrl}/api/user/`, {params});
  }
}