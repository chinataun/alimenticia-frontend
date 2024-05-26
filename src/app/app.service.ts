import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth/auth.service';

const USER_LOCAL_STORAGE_KEY = 'token';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private bannerImageSource = new BehaviorSubject('assets/home-imagen/comparador.jpg');
  currentBannerImage$ = this.bannerImageSource.asObservable();

  changeBannerImage(image: string) {
    this.bannerImageSource.next(image);
  }
  constructor(
    private authService: AuthService
  ) {
    
    const userFromLocal = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
    if (userFromLocal) {      
      this.authService.setUserProfile(String(userFromLocal)).subscribe();
    }
  }

}