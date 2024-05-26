import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    isLoggedIn: boolean = false;
    userId!: number; // Agrega la propiedad userId
    constructor( private router: Router) { }
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean {
      if (this.isAuth()) {
        return true; // Usuario autenticado, permite el acceso
      } else {
        this.router.navigate(['/user/iniciar-sesion']); // Usuario no autenticado, redirige al inicio de sesión
        return false; // Deniega el acceso
      }
    }

// Método para obtener el ID del usuario solo si está autenticado
getUserIdIfAuthenticated(): number | undefined {
  return this.isLoggedIn ? this.userId : undefined;
}
    isAuth():boolean
    {
      return this.isLoggedIn;
    }
  
    login(userId: number) {
      // Lógica de inicio de sesión
      this.isLoggedIn = true;
      this.userId = userId; // Almacena el ID del usuario
    }
  
    logout() {
      // Lógica de cierre de sesión
      this.isLoggedIn = false;
    }
}
