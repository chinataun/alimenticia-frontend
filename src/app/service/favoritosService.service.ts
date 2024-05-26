import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recetas } from '../interface/interface.component';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private recetasFavoritasSubject = new BehaviorSubject<Recetas[]>([]);
  recetasFavoritas$: Observable<Recetas[]> = this.recetasFavoritasSubject.asObservable();

  setRecetasFavoritas(recetas: Recetas[]) {
    this.recetasFavoritasSubject.next(recetas);
  }
}
