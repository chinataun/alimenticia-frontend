// detallesAlimentoService.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesAlimentoService {
  private mesSource = new BehaviorSubject<string>('');
  private categoriaSource = new BehaviorSubject<string>('');

  mes$ = this.mesSource.asObservable();
  categoria$ = this.categoriaSource.asObservable();

  constructor() {}

  setMes(mes: string) {
    this.mesSource.next(mes);
  }

  setCategoria(categoria: string) {
    this.categoriaSource.next(categoria);
  }

  obtenerValoresIniciales(): { mes: string, categoria: string } {
    return { mes: this.mesSource.value, categoria: this.categoriaSource.value };
  }
}
