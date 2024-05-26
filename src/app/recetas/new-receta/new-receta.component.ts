import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Receta, RecetaCredentials, UserRecetaCredentials } from '../receta';
import { RecetasService } from '../recetas.service';
import { finalize } from 'rxjs';
import { CategoriaService } from 'src/app/service/categoriasService';

@Component({
  selector: 'app-new-receta',
  templateUrl: './new-receta.component.html',
  styleUrl: './new-receta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewRecetaComponent implements OnInit {
  @Output() recipeCreated = new EventEmitter<void>();

  imagePreview!: string | ArrayBuffer;
  serverUrl = 'https://alimenticia-api-62c500e9b184.herokuapp.com/'; 
  isLoading = false; // Nueva propiedad para rastrear el estado de carga de la imagen
  categorias: any[] | undefined;
  supermercados: any[] = this.categoriaService.getSupermercadosActivos();
  dificultades: any[] = this.categoriaService.getDificultadReceta();

  recipeForm = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    ingredientes: this.fb.array([]),
    pasos:  this.fb.array([]),
    supermercado: new FormControl('', [Validators.required]),
    imagen: new FormControl(''),
    comensales: new FormControl('', [Validators.required]),
    tiempo: new FormControl('', [Validators.required]),
    categoriaId: new FormControl(null, [Validators.required]),
    dificultad: new FormControl('', [Validators.required]),    
  });
  
  constructor(public dialogRef: MatDialogRef<NewRecetaComponent>,
    private fb: FormBuilder, private toastr: ToastrService,
    private recetasService: RecetasService,
    private cd: ChangeDetectorRef,
    private categoriaService: CategoriaService
    ) {}


  get tituloControl(): FormControl {
    return this.recipeForm.get('titulo') as FormControl;
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

  

  ngOnInit(): void {  
    this.categoriaService.getCategoriasReceta().subscribe(data => {
      this.categorias = data;
    }); 
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }


  imageFile: File | null = null;

  onImageChange(event: Event): void {
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


  create(): void {
    const formData = new FormData();

    formData.append('titulo', this.recipeForm.value.titulo!);
    formData.append('supermercado', this.recipeForm.value.supermercado!);
    formData.append('comensales', this.recipeForm.value.comensales!);
    formData.append('tiempo', this.recipeForm.value.tiempo!);
    formData.append('categoriaId', this.recipeForm.value.categoriaId!);
    formData.append('dificultad', this.recipeForm.value.dificultad!);
    if (this.imageFile) {        
      formData.append('imagen', this.imageFile!);
    } 

    this.recipeForm.markAsPending();

    this.recetasService.addReceta(formData).subscribe({
      next: (result) => {
        this.recipeForm.reset();
        // Emite el evento
        // this.recipeCreated.emit();
        this.dialogRef.close(this.recipeForm.value);
        this.toastr.success(`${result.msg} creada correctamente`, "Receta creada");
      },
      error: (error) => {
        this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
        console.error('Error al registrar receta:', error);
      }
    }); 

  }

}
