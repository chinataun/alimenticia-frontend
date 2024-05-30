import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RecetasComponent } from './recetas.component';
import { RecetaDetailsComponent } from './receta-details/receta-details.component';
import { CommonModule } from '@angular/common';
import { EditRecetaCompleteComponent } from './edit-receta-complete/edit-receta-complete.component';
import { RecetasUserComponent } from './recetas-user/recetas-user.component';
import { RecetasCategoriaComponent } from './recetas-categoria/recetas-categoria.component';

const routes: Route[] = [
  { path: '', component: RecetasComponent },
  // { path: 'recipes/add', component: RecetasAddComponent, canActivate: [authGuard] },
  { path: 'receta/:id', component: RecetaDetailsComponent },
  { path: 'receta/edit/:id', component: EditRecetaCompleteComponent },
  { path: 'autor/:id', component: RecetasUserComponent },
  { path: 'categoria/:nombre', component: RecetasCategoriaComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RecetasRoutingModule {}