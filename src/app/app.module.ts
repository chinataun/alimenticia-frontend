import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from './componenets/header/header.component';
import { MenuNavigationComponent } from './componenets/menu-navigation/menu-navigation.component';
import { FooterComponent } from './componenets/footer/footer.component';
import { HomeComponent } from './componenets/home/home.component';
import { AuthService } from './service/authService.service';
import { ToastrModule } from 'ngx-toastr';
import { MatTabsModule } from '@angular/material/tabs';

import { NgChartsModule } from 'ng2-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileUploadComponentComponent } from './file-upload-component/file-upload-component.component';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthModule } from './auth/auth.module';
import { LoggingInterceptor } from './logging.interceptor';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthHeaderInterceptor } from './auth/auth-header.interceptor';
import { UserModule } from './user/user.module';
import { RecetasModule } from './recetas/recetas.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AlimentosTemporadaModule } from './alimentos-temporada/alimentos-temporada.module';
import { ProductoModule } from './producto/producto.module';
import { CarritoModule } from './carrito/carrito.module';
import { MatBadgeModule } from '@angular/material/badge';

import { VotesComponent } from './recetas/votes/votes.component';
import { ApiFoodsComponent } from './api-foods/api-foods.component';
import { ApiFoodsDetalleComponent } from './api-foods/api-foods-detalle/api-foods-detalle.component';
import { CaloriasComponent } from './pages/calorias/calorias.component';
import { DieteticaModule } from './dietetica/dietetica.module';
import { ConfirmDialogComponent } from './componenets/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    ApiFoodsComponent,
    FooterComponent,
    HeaderComponent,
    MenuNavigationComponent,
    HomeComponent,
    CaloriasComponent,
    FileUploadComponentComponent,  
    PageNotFoundComponent,
    ApiFoodsDetalleComponent,
    ApiFoodsComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule,
    MatSelectModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    DropdownModule,
    AuthModule,
    UserModule,
    AlimentosTemporadaModule,
    ProductoModule,
    CarritoModule,
    RecetasModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule,  
    MatIconModule,
    FormsModule, 
    MatTabsModule,
    DieteticaModule,
    MatIconModule,
    MatBadgeModule
  ],
  exports: [    
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    AuthService, DialogService, 
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHeaderInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoggingInterceptor,
    multi: true,
  },]
  ,
  bootstrap: [AppComponent],

})
export class AppModule { }
