import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesSeleccionadoService {
  private mesSeleccionadoSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private categoriaSeleccionadaSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  setMesSeleccionado(mes: string) {
    this.mesSeleccionadoSubject.next(mes);
  }

  setCategoriaSeleccionada(categoria: string) {
    this.categoriaSeleccionadaSubject.next(categoria);
  }

  getMesSeleccionado(): Observable<string> {
    return this.mesSeleccionadoSubject.asObservable();
  }

  getCategoriaSeleccionada(): Observable<string> {
    return this.categoriaSeleccionadaSubject.asObservable();
  }
}
