import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { MisListasComponent } from './mis-listas/mis-listas.component';
import { authGuard, authGuardChilds } from '../guards/auth.guard';
import { FavoriteRecipesComponent } from '../recetas/favorite-recipes/favorite-recipes.component';
import { CreatedRecipesComponent } from '../recetas/created-recipes/created-recipes.component';
import { CarritosComponent } from './carritos/carritos.component';

const routes: Route[] = [
  { path: 'profile', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'profile/recetas-favoritas', component: FavoriteRecipesComponent, canActivate: [authGuard] },
  { path: 'profile/mis-recetas', component: CreatedRecipesComponent, canActivate: [authGuard] },
  { path: 'profile/mis-listas', component: MisListasComponent, canActivate: [authGuard] },
  { path: 'profile/carritos', component: CarritosComponent, canActivate: [authGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}