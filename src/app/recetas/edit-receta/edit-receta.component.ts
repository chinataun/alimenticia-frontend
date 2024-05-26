import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user/user.service';
import { RecetasService } from '../recetas.service';

@Component({
  selector: 'app-edit-receta',
  templateUrl: './edit-receta.component.html',
  styleUrl: './edit-receta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRecetaComponent implements OnInit {
  receta: any; // Reemplaza 'any' con el tipo de tu receta
  serverUrl = 'https://alimenticia-api-62c500e9b184.herokuapp.com/'; 
  imagePreview!: string | ArrayBuffer;
  isLoading = false;

  imageFile: File | null = null;
  
  // recipeForm = new FormGroup({
  //   titulo: new FormControl('', [Validators.required]),
  //   descripcion: new FormControl('', [Validators.required]),
  //   supermercado: new FormControl('', [Validators.required]),
  //   imagen: new FormControl(''),
  //   comensales: new FormControl('', [Validators.required]),
  //   tiempo: new FormControl('', [Validators.required]),
  //   idCategoria: new FormControl('', [Validators.required]),
  // });

  recipeForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    supermercado: ['', Validators.required],
    imagen: [''],
    ingredientes: this.fb.array([]),
    pasos:  this.fb.array([]),
    comensales: ['', Validators.required],
    tiempo: ['', Validators.required],
    categoriaId: ['', Validators.required],
    dificultad: ['', Validators.required],
  });

  get tituloControl(): FormControl {
    return this.recipeForm.get('titulo') as FormControl;
  }
  get descripcionControl(): FormControl {
    return this.recipeForm.get('descripcion') as FormControl;
  }
  get supermercadoControl(): FormControl {
    return this.recipeForm.get('supermercado') as FormControl;
  }
  get imagenControl(): FormControl {
    return this.recipeForm.get('imagen') as FormControl;
  }
  get comensalesControl(): FormControl {
    return this.recipeForm.get('comensales') as FormControl;
  }
  get tiempoControl(): FormControl {
    return this.recipeForm.get('tiempo') as FormControl;
  }
  get categoriaIdControl(): FormControl {
    return this.recipeForm.get('categoriaId') as FormControl;
  }
  get dificultadControl(): FormControl {
    return this.recipeForm.get('dificultad') as FormControl;
  }

  constructor(
    public dialogRef: MatDialogRef<EditRecetaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService, 
    private recetasService: RecetasService, 
    private cd: ChangeDetectorRef
  ) { // Reemplaza 'any' con el tipo de tu receta
      this.receta = data.receta;
    }

  ngOnInit() {
    // Rellena el formulario con los datos de la receta
    this.recipeForm.patchValue({
      titulo: this.receta.titulo,
      descripcion: this.receta.descripcion,
      supermercado: this.receta.supermercado,
      imagen: this.receta.imagen,
      comensales: this.receta.comensales,
      tiempo: this.receta.tiempo,
      categoriaId: this.receta.categoriaId,
      dificultad: this.receta.dificultad
    });
    
    console.log(this.receta.ingredientes);
    // Llena los FormArray de ingredientes y pasos con los datos de la receta
    this.receta.ingredientes.forEach((ingrediente: any) => {
      this.ingredientes.push(this.fb.group(ingrediente));
    });
  
    this.receta.pasos.forEach((paso: any) => {
      this.pasos.push(this.fb.control(paso));
    });
  
    this.imagePreview = this.serverUrl + this.receta.imagen;
  }
  // Copia los métodos para agregar y eliminar ingredientes y pasos
get ingredientes() {
  return this.recipeForm.get('ingredientes') as FormArray;
}

addIngrediente() {
  this.ingredientes.push(this.fb.group({ ingrediente: '', cantidad: '' }));
}

deleteIngrediente(index: number) {
  this.ingredientes.removeAt(index);
}

get pasos() {
  return this.recipeForm.get('pasos') as FormArray;
}

addPaso() {
  this.pasos.push(this.fb.control(''));
}

deletePaso(index: number) {
  this.pasos.removeAt(index);
}
  // Método para manejar la actualización de la receta
  onUpdate() {
    if (this.recipeForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('idReceta', this.receta.id);
    formData.append('titulo', this.recipeForm.value.titulo ?? '');
    formData.append('descripcion', this.recipeForm.value.descripcion ?? '');
    formData.append('supermercado', this.recipeForm.value.supermercado ?? '');
    formData.append('comensales', this.recipeForm.value.comensales ?? '');
    formData.append('tiempo', this.recipeForm.value.tiempo ?? '');
    formData.append('categoriaId', this.recipeForm.value.categoriaId ?? '');
    formData.append('dificultad', this.recipeForm.value.dificultad ?? '');
    formData.append('ingredientes', JSON.stringify(this.recipeForm.value.ingredientes));
    formData.append('pasos', JSON.stringify(this.recipeForm.value.pasos));

      if (this.imageFile) {        
        formData.append('imagen', this.imageFile!);
      } 

    // Enviar la receta al servidor
    this.recetasService.updateReceta(formData).subscribe({
      next: (response) => {
        this.toastr.success(`${response.message}`, 'Perfil actualizado');

    // Cerrar el diálogo
    this.dialogRef.close();
      },
      error: (error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
      }
    }
    );


  }


  onFileChange(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (!file) {
      return;
    }
    console.log(file);
    this.imageFile = file;
    const reader = new FileReader();
    this.isLoading = true;
    reader.onload = e => {
      this.imagePreview = reader.result as string | ArrayBuffer;
      this.isLoading = false; // La imagen ha terminado de cargar

      this.cd.detectChanges(); // Detecta los cambios
    };
    reader.readAsDataURL(file);
  }
}
