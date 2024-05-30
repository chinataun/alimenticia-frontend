
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { CommonModule } from '@angular/common';
import { authGuard, authGuardChilds } from './guards/auth.guard';
import { BuscadorComponent } from './producto/buscador/buscador.component';
import { ComparadorComponent } from './producto/comparador/comparador.component';

import { SigninComponent } from './auth/sign-in/sign-in.component';

const routes: Routes = [

{path:'', component:HomeComponent},

{
  path: 'alimentos',
  loadChildren: () => import('./alimentos-temporada/alimentos-temporada.module').then((m) => m.AlimentosTemporadaModule),
},
{
  path: 'user',
  loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  canActivateChild: [authGuardChilds],
  canLoad: [authGuardChilds],
},

{
  path: 'recetas',
  loadChildren: () => import('./recetas/recetas.module').then((m) => m.RecetasModule),
},

{
  path: 'dietetica',
  loadChildren: () => import('./dietetica/dietetica.module').then((m) => m.DieteticaModule),
},

{path:'buscador', component: BuscadorComponent},
{path:'comparador', component:ComparadorComponent},

{path:'user/iniciar-sesion', component:SigninComponent},

];
@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
