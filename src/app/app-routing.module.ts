
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { InicioSesionUsuarioComponent } from './pages/inicio-sesion-usuario/inicio-sesion-usuario.component';
import { HomeComponent } from './componenets/home/home.component';
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
import { ApiFoodsDetalleComponent } from './api-foods/api-foods-detalle/api-foods-detalle.component';
import { ApiFoodsComponent } from './api-foods/api-foods.component';
import { CaloriasComponent } from './pages/calorias/calorias.component';

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
//{path:'perfil', component:UsuarioPerfilComponent,canActivate: [AuthService]},
// {path:'perfil', component:UsuarioPerfilComponent},
// Asegúrate de que esta ruta esté presente y tenga dos parámetros opcionales
// { path: 'alimentosTemporada/:mes/:categoria', component: AlimentosTemporadaComponent,},
// { path: 'alimentoTemporada/:mes/:categoria/:nombre', component: InformacionAlimentosTemporadaComponent },
// {path: 'recetas-favoritas', component: UsuarioListaRecetasFavoritasComponent , canActivate: [authGuard] },
// {path:'mis-recetas', component:UsuarioRecetasSubidasComponent, canActivate: [authGuard] },
// {path:'dietetica/calcular', component:CaloriasComponent},
{path: 'dieteticas/informacion-nutricional', component:ApiFoodsComponent},
{ path: 'dieteticas/informacion-nutricional/:productName', component: ApiFoodsDetalleComponent },
  // Otras rutas definidas aquí
// { path: 'informacion-receta/:id', component: InformacionRecetaComponent },
// { path: 'crear-receta', component: RecetasActualizadasCrearComponent },
/* {
  path: '**',
  component: PageNotFoundComponent,
}, */

];
@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
