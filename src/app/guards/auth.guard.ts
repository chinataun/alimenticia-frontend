import { Injectable, inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';

Injectable({
  providedIn: 'root'
})
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isloggedIn) => isloggedIn || router.createUrlTree(['/login'])
  ));
  //if (authService.isAuth()) {
  //  return true;
  //} else {
   //return  router.parseUrl('/login');
  // return router.createUrlTree(['/login'])
  //}


  //return true;
};

export const authGuardChilds: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isloggedIn) => isloggedIn || router.createUrlTree(['/login'])
  ));
  //if (authService.isAuth()) {
  //  return true;
  //} else {
   //return  router.parseUrl('/login');
  // return router.createUrlTree(['/login'])
  //}


  //return true;
};