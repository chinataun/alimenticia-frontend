import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, throwError, map, of } from 'rxjs';
import { LoginCredentials, SigninCredentials } from './login-credentials';
import { environment } from '../../environments/environment';
import { catchError, ignoreElements, switchMap, tap } from 'rxjs/operators';
import { User, UserWithToken } from './model/user.interface';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../user/model/user-profile.interface';

const USER_LOCAL_STORAGE_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = environment.API_BASE_URL;
  
  private user = new BehaviorSubject<UserWithToken | null>(null);
  user$ = this.user.asObservable();

  private userProfile = new BehaviorSubject<UserProfile | null >(null);
  userProfile$ = this.userProfile.asObservable();
  

  active$!: Observable<{value: boolean}>;
  
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(Boolean));

  hasSupermarket$: Observable<boolean> = this.userProfile$.pipe(
    map(user => user?.supermercado !== null)
  );

  constructor(
    private router: Router, 
    private httpClient: HttpClient, 
    private toastr: ToastrService,
  ) {
    this.loadUserFromLocalStorage();

    // this.setUserProfile(userFromLocal);
  }

  logIn(credentials: LoginCredentials): Observable<never> {
    return this.httpClient
      .post<UserWithToken>(`${this.baseUrl}/api/user/login`, credentials)
      .pipe(
        tap((userToken) => {
          this.saveTokenToLocalStore(userToken.token)
          this.pushNewUser(userToken.token)
          this.setUserProfile(userToken.token).subscribe();
          sessionStorage.removeItem('supermercado');
        }),
        tap(() => this.toastr.success('Login correcto')),
        tap(() => this.redirectToHome()),
        ignoreElements(),
        catchError((error) => {
          if (error.status === 401) {
            this.toastr.error(error.error.msg);
            // const err = new Error(error); 
            // throwError(() => err);
            //return throwError(new InvalidCredentialsError());
          }
          
          return EMPTY;
        })
      );
  }

  authenticate(token: string): void {
    this.saveTokenToLocalStore(token)
    this.pushNewUser(token)
    this.setUserProfile(token).subscribe();
  }
  
  setUserProfile(token: string): Observable<UserProfile> {

    const payload = jwtDecode(token) as UserWithToken;
    const params = new HttpParams().set('userId', String(payload.userId));
    return this.httpClient.get<UserProfile>(`${this.baseUrl}/api/user`, {params}).pipe(
      tap(user => {
        this.userProfile.next(user);
      })
    )
  }

  updateUserProfile(user: UserProfile): void {
    this.userProfile.next(user)
  }

  logOut(): void {
    this.removeUserFromLocalStorage();
    this.user.next(null);
    this.userProfile.next(null);
    this.router.navigateByUrl('/login');
  }

  private redirectToHome(): void {
    this.router.navigate(['/']);
  }

  getUserId(): Observable<number | null> {
    return this.user$.pipe(
      map(user => user?.userId ?? null)
    );
  }

  private pushNewUser(token: string) {
    this.user.next(this.decodeToken(token));
  }

  private decodeToken(userToken: string): UserWithToken {
    const p = jwtDecode(userToken);
    const userInfo = jwtDecode(userToken) as User;
    return { ...userInfo, token: userToken };
  }
  
  private loadUserFromLocalStorage(): void {
    const userFromLocal = localStorage.getItem(USER_LOCAL_STORAGE_KEY);

    userFromLocal && this.pushNewUser(userFromLocal);
  }

  private saveTokenToLocalStore(userToken: string): void {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, userToken);
  }

  private removeUserFromLocalStorage(): void {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
  }


  signIn(credentials: SigninCredentials): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/user/signin`, credentials);
   }
  
}

