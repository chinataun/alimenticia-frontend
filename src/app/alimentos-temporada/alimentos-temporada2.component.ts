import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlimentosTemporadaService } from './alimentos-temporada.service';
import { Alimento } from './alimentos-temporada.interface';
import { Router } from '@angular/router';
import { Observable, Subscription, catchError, map, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-alimentos-temporada',
  templateUrl: './alimentos-temporada.component.html',
  styleUrl: './alimentos-temporada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // animations: [
  //   trigger('fadeInOut', [
  //     transition(':enter', [
  //       style({ opacity: 0 }),
  //       animate('0.5s', style({ opacity: 1 }))
  //     ]),
  //     transition(':leave', [
  //       animate('0.5s', style({ opacity: 0 }))
  //     ])
  //   ])
  // ]
  // animations: [
  //   trigger('fadeInOut', [
  //     transition('* <=> *', [
  //       query(':enter', [
  //         style({ opacity: 0, transform: 'translateY(-15px)' }),
  //         stagger('50ms', animate('550ms ease-out', style({ opacity: 1, transform: 'none' })))
  //       ], { optional: true }),
  //       query(':leave', [
  //         animate('550ms ease-out', style({ opacity: 0 }))
  //       ], { optional: true })
  //     ])
  //   ])
  // ]
})
export class AlimentosTemporadaComponent {
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mesActual: string = this.meses[new Date().getMonth()];
  mesSeleccionado: string = this.mesActual;

  categoriaSeleccionada: string = 'all';
  // alimentos: Alimento[] = [];
  // En tu componente
  alimentos: Alimento[] = [];
  alimentosActivos$: Observable<Alimento[]> | undefined;
  alimentosEntrando$: Observable<Alimento[]> | undefined;
  alimentosNoDisponibles$: Observable<Alimento[]> | undefined;
  alimentos2$ = this.alimentosTemporadaService.alimentos$;
  alimentos2Subscription$: Subscription | undefined;

  constructor(private router: Router,private alimentosTemporadaService: AlimentosTemporadaService) { 
    this.mesSeleccionado = this.mesActual;

  }
  
  ngOnInit() {
    this.mesSeleccionado = this.mesActual;
// Guarda la suscripción en una variable
this.alimentos2Subscription$ = this.alimentos2$.subscribe(alimentos => {
  // this.alimentos = alimentos;
  this.cambiarMesSeleccionado(this.mesSeleccionado);
});
    this.cargarAlimentos()
    // this.alimentosTemporadaService.getAlimentos().pipe(
    //   catchError(error => {
    //     console.error('Error loading alimentos:', error);
    //     return of([]);
    //   })
    // ).subscribe(alimentos => {
    //   this.alimentos = alimentos;
    //   this.cambiarMesSeleccionado(this.mesSeleccionado);
    // });
  }

  cambiarMesSeleccionado(mes: string) {
    this.mesSeleccionado = mes;
    this.filtrarAlimentos()
  }

  cambiarCategoriaSeleccionada(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.categoriaSeleccionada = selectElement.value;
    this.filtrarAlimentos();
  }

  filtrarAlimentos() {
    this.alimentos2$ = this.alimentos2$.pipe(
      map(alimentos => {
        if (this.categoriaSeleccionada !== 'all') {
          return alimentos.filter(alimento => alimento.categoria.nombre === this.categoriaSeleccionada);
        }
        return alimentos;
      })
    );
  
    this.alimentosActivos$ = this.getAlimentosPorEstado('enTemporada');
    this.alimentosEntrando$ = this.getAlimentosPorEstado('entrando');
    this.alimentosNoDisponibles$ = this.getAlimentosPorEstado('noDisponible');
  }


 // En tu componente
cargarAlimentos() {
  this.alimentos2$ = this.alimentosTemporadaService.getAlimentos().pipe(
    catchError(error => {
      console.error('Error loading alimentos:', error);
      return of([]);
    }),
    shareReplay(1) // Comparte la misma respuesta entre varios suscriptores
  );

  this.alimentosActivos$ = this.getAlimentosPorEstado('enTemporada');
  this.alimentosEntrando$ = this.getAlimentosPorEstado('entrando');
  this.alimentosNoDisponibles$ = this.getAlimentosPorEstado('noDisponible');
  // this.mesSeleccionado = mes;
  // this.alimentosTemporadaService.getAlimentos(this.mesSeleccionado).subscribe(
  //   (alimentos: Alimento[]) => {
  //     this.alimentos = alimentos;
  //   },
  //   error => {
  //     console.error('Error loading alimentos:', error);
  //   }
  // );
}
// Extrae la lógica de filtrado y clasificación a una función separada
getAlimentosPorEstado(estado: string) {
  return this.alimentos2$.pipe(
    map(alimentos => alimentos.filter(alimento => this.getEstadoAlimento(alimento) === estado)),
    map(alimentos => alimentos.sort((a, b) => a.nombre.localeCompare(b.nombre)))
  );
}


onAlimentoClick(alimento: Alimento) {
  this.router.navigate(['/detalle-alimento', alimento.id]);
}
// Actualizar el método getEstadoAlimento
getEstadoAlimento(alimento: Alimento): 'enTemporada' | 'entrando' | 'noDisponible' {
  if (alimento.temporadas[0].temporada.includes(this.mesSeleccionado.toLowerCase())) {
    return 'enTemporada';
  } else if (alimento.temporadas[0].entrando.includes(this.mesSeleccionado.toLowerCase())) {
    return 'entrando';
  } else {
    return 'noDisponible';
  }
}

ngOnDestroy() {
  // Asegúrate de desuscribirte de los Observables
  if (this.alimentos2Subscription$) {
    this.alimentos2Subscription$.unsubscribe();
  }
}

trackByFn(index: number, alimento: Alimento) {
  return alimento.id; // o cualquier otra propiedad única del alimento
}
}
