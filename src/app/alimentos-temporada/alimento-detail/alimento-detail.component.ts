import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlimentosTemporadaService } from '../alimentos-temporada.service';
import { Observable, map, of, tap } from 'rxjs';
import { Alimento } from '../alimentos-temporada.interface';
import { Productos } from '../alimentoProducto.interface';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-alimento-detail',
  templateUrl: './alimento-detail.component.html',
  styleUrl: './alimento-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class AlimentoDetailComponent {
  alimento$ =  this.alimentosTemporadaService.alimento$;
  productos$!: Observable<Productos>;
  categoria = '';
  productos: Productos = {};

  supermercados: string[] = [];
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  loading = true;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private alimentosTemporadaService: AlimentosTemporadaService
  ) {}

getMesClass(mes: string, alimento: Alimento): string {
  if (alimento.temporada.temporada.includes(mes.toLowerCase())) {
    return 'enTemporada';
  } else if (alimento.temporada.entrando.includes(mes.toLowerCase())) {
    return 'entrando';
  } else {
    return 'noDisponible';
  }
}

  ngOnInit() {
    
    // this.appService.changeBannerImage('assets/banner/4.svg');

    this.loading = true;
    
    const nombre = this.route.snapshot.paramMap.get('nombre') ?? '';
    
    this.alimento$ = this.alimentosTemporadaService.getAlimento(nombre).pipe(
      tap((alimento: Alimento) => {
        this.appService.changeBannerImage('assets/banner/' + alimento.categoria.nombre.toLowerCase() + '/banner-' + nombre + '.png');
      }
    ));
    
    this.productos$ = this.alimentosTemporadaService.getBusquedaAlimento(nombre).pipe(
      
      tap((productos: Productos) => {
        this.productos = productos;
        this.supermercados = Object.keys(productos);
        this.loading = false;
      })
    );
  }

  volver() {
    window.history.back();
  }
}
