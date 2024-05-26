import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AlimentosTemporadaService } from './alimentos-temporada.service';
import { Alimento } from './alimentos-temporada.interface';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { AppService } from '../app.service';

@Component({
  selector: 'app-alimentos-temporada',
  templateUrl: './alimentos-temporada.component.html',
  styleUrls: ['./alimentos-temporada.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // animations: [
  //   trigger('listAnimation', [
  //     transition('* <=> *', [
  //       query(':enter', [
  //         style({ opacity: 0, transform: 'translateY(-100px)' }),
  //         stagger('100ms', [
  //           animate('500ms ease-out', style({ opacity: 1, transform: 'none' }))
  //         ])
  //       ], { optional: true }),
  //       query(':leave', [
  //         animate('500ms ease-out', style({ opacity: 0, transform: 'translateY(-100px)' }))
  //       ], { optional: true })
  //     ])
  //   ])
  // ]
})
export class AlimentosTemporadaComponent implements OnInit, OnDestroy {
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mesActual: string = this.meses[new Date().getMonth()];
  categoriaSeleccionada: string = 'all';
  mesSeleccionado: string = this.mesActual;

  alimentos$: Observable<Alimento[]> | undefined;
  alimentosFiltrados$: Observable<{ active: Alimento[], inactive: Alimento[] }> | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    private appService: AppService,
    private router: Router, 
    private alimentosTemporadaService: AlimentosTemporadaService) { }

  ngOnInit() {

    this.appService.changeBannerImage('assets/banner/4.svg');
    this.alimentos$ = this.alimentosTemporadaService.getAlimentos().pipe(
      tap(alimentos => console.log('Alimentos:', alimentos)),
      catchError(error => {
        console.error('Error loading alimentos:', error);
        return of([]);
      }),
      shareReplay(1),
      takeUntil(this.destroy$)
    );

    this.alimentosFiltrados$ = this.alimentos$?.pipe(
      map(alimentos => this.filtrarAlimentosPorCategoriaYMes(this.filtrarAlimentosPorCategoria(alimentos)))
    );
  }

  cambiarMesSeleccionado(mes: string) {
    this.mesSeleccionado = mes;
    this.alimentosFiltrados$ = this.alimentos$?.pipe(
      map(alimentos => this.filtrarAlimentosPorCategoriaYMes(this.filtrarAlimentosPorCategoria(alimentos))),
      tap(alimentosFiltrados => console.log('Alimentos filtrados:', alimentosFiltrados))

    );
  }

  cambiarCategoriaSeleccionada(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.categoriaSeleccionada = selectElement.value;
    this.alimentosFiltrados$ = this.alimentos$?.pipe(
      map(alimentos => this.filtrarAlimentosPorCategoriaYMes(this.filtrarAlimentosPorCategoria(alimentos))),
      tap(alimentosFiltrados => console.log('Alimentos filtrados:', alimentosFiltrados))

    );
  }

  private filtrarAlimentosPorCategoria(alimentos: Alimento[]): Alimento[] {
    return alimentos.filter(alimento => this.categoriaSeleccionada === 'all' || alimento.categoria.nombre === this.categoriaSeleccionada);
  }

  private filtrarAlimentosPorCategoriaYMes(alimentos: Alimento[]): { active: Alimento[], inactive: Alimento[] } {
    const alimentosFiltrados = this.filtrarAlimentosPorCategoria(alimentos);

    const enTemporada: Alimento[] = [];
    const entrando: Alimento[] = [];
    const inactive: Alimento[] = [];
  
    alimentosFiltrados.forEach(alimento => {
      const estado = this.getEstadoAlimento(alimento);
      if (estado === 'enTemporada') {
        enTemporada.push(alimento);
      } else if (estado === 'entrando') {
        entrando.push(alimento);
      } else {
        inactive.push(alimento);
      }
    });
  
    // Ordena los alimentos por nombre
    enTemporada.sort((a, b) => a.nombre.localeCompare(b.nombre));
    entrando.sort((a, b) => a.nombre.localeCompare(b.nombre));
    inactive.sort((a, b) => a.nombre.localeCompare(b.nombre));
  
    // Combina 'enTemporada' y 'entrando' en 'active'
    const active = [...enTemporada, ...entrando];
  
    return { active, inactive };
  }

  onAlimentoClick(alimento: Alimento) {
    this.router.navigate(['/alimentos', alimento.nombre.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')]);
  }

  getEstadoAlimento(alimento: Alimento): 'enTemporada' | 'entrando' | 'noDisponible' {
    if (alimento.temporada.temporada.includes(this.mesSeleccionado.toLowerCase())) {
      return 'enTemporada';
    } else if (alimento.temporada.entrando.includes(this.mesSeleccionado.toLowerCase())) {
      return 'entrando';
    } else {
      return 'noDisponible';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, alimento: Alimento) {
    return alimento.id;
  }
}