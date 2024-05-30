import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { NutricionComponent } from './nutricion/nutricion.component';

const routes: Route[] = [
  { path: 'calculadora', component: CalculadoraComponent },
  { path: 'informacion-nutricional', component: NutricionComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DieteticaRoutingModule {}