import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetasComponent } from './recetas.component';
import { RecetaDetailsComponent } from './receta-details/receta-details.component';
import { RecetasRoutingModule } from './recetas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormExtensionsModule } from '../form-extensions/form-extensions.module';
import { RecetaListingComponent } from './receta-listing/receta-listing.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

import {MatDividerModule} from '@angular/material/divider';
import { NewRecetaComponent } from './new-receta/new-receta.component';
import { MatCardModule } from '@angular/material/card';
import { FavoriteRecipesComponent } from './favorite-recipes/favorite-recipes.component';
import { RecetaCardComponent } from './receta-card/receta-card.component';
import { CreatedRecipesComponent } from './created-recipes/created-recipes.component';
import { EditRecetaComponent } from './edit-receta/edit-receta.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { EditRecetaCompleteComponent } from './edit-receta-complete/edit-receta-complete.component';
import { ProductoModule } from '../producto/producto.module';
import {
  MatSlideToggleModule,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { RecetasUserComponent } from './recetas-user/recetas-user.component';
import { RecetasCategoriaComponent } from './recetas-categoria/recetas-categoria.component';
import { VotesComponent } from './votes/votes.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RemoveAccentsPipe } from './remove-accents.pipe';

@NgModule({
  declarations: [
    VotesComponent,
    RecetasComponent, 
    RecetaDetailsComponent,
    RecetaListingComponent,
    NewRecetaComponent,
    FavoriteRecipesComponent,
    CreatedRecipesComponent,
    RecetaCardComponent,
    EditRecetaComponent,
    EditRecetaCompleteComponent,
    RecetasUserComponent,
    RecetasCategoriaComponent,
    VotesComponent,
    RemoveAccentsPipe
  ],
  imports: [
    CommonModule,
    RecetasRoutingModule,
    ProductoModule,
    ReactiveFormsModule,
    FormExtensionsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule, 
    MatTooltipModule, 
    MatIconModule, 
    MatDividerModule, 
    MatDialogModule, 
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
  ],
  exports: [
    RecetasComponent,
    RecetaListingComponent, 
    FavoriteRecipesComponent,
    CreatedRecipesComponent
  ],
})
export class RecetasModule { }
