
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { InicioSesionUsuarioComponent } from './pages/inicio-sesion-usuario/inicio-sesion-usuario.component';
import { HomeComponent } from './componentes/home/home.component';
// import { ListarRecetasComponent } from './pages/listar-recetas/listar-recetas.component';

// import { ListaDietasComponent } from './pages/lista-dietas/lista-dietas.component';
// import { InformacionRecetaComponent } from './pages/informacion-receta/informacion-receta.component';
// import { RecetasActualizadasCrearComponent } from './pages/recetas-actualizadas-crear/recetas-actualizadas-crear.component';
import { CommonModule } from '@angular/common';
import { authGuard, authGuardChilds } from './guards/auth.guard';
import { BuscadorComponent } from './producto/buscador/buscador.component';
import { ComparadorComponent } from './producto/comparador/comparador.component';

import { SigninComponent } from './auth/sign-in/sign-in.component';
import { RecetaListingComponent } from './recetas/receta-listing/receta-listing.component';

const routes: Routes = [

{path:'', component:HomeComponent},
/* {
  path: 'user',
  loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  canActivateChild: [IsLoggedInGuard],
  canLoad: [IsLoggedInGuard],
},
 */
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
{path:'recetasa', component:RecetaListingComponent},

];
@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
