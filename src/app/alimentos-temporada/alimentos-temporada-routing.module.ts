import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlimentosTemporadaComponent } from './alimentos-temporada.component';
import { AlimentoDetailComponent } from './alimento-detail/alimento-detail.component';

const routes: Route[] = [
  { path: 'temporada', component: AlimentosTemporadaComponent },
  { path: ':nombre', component: AlimentoDetailComponent },
  // { path: 'recipes/add', component: RecetasAddComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AlimentosTemporadaRoutingModule {}