import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlimentosTemporadaComponent } from './alimentos-temporada.component';
import { AlimentosTemporadaRoutingModule } from './alimentos-temporada-routing.module';
import { AlimentoDetailComponent } from './alimento-detail/alimento-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [AlimentosTemporadaComponent, AlimentoDetailComponent],
  imports: [
    CommonModule,
    AlimentosTemporadaRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [AlimentosTemporadaComponent]
})
export class AlimentosTemporadaModule { }
