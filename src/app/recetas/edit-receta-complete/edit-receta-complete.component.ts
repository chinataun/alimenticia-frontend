import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecetasService } from '../recetas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/producto/producto.service';
import { BehaviorSubject, Subscription, of, switchMap, takeUntil } from 'rxjs';
import { Producto } from 'src/app/producto/producto.categoria.interface';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Receta } from '../receta';
import { CategoriaService } from 'src/app/service/categoriasService';
import { ToastrService } from 'ngx-toastr';
import { emptyRecipeDontPublish } from 'src/app/form-extensions/validators/empty-recipe-dont-publish';

@Component({
  selector: 'app-edit-receta-complete',
  templateUrl: './edit-receta-complete.component.html',
  styleUrl: './edit-receta-complete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EditRecetaCompleteComponent {
  receta!: Receta
  categorias: any[] | undefined;
  supermercados: any[] = this.categoriaService.getSupermercadosActivos();
  dificultades: any[] = this.categoriaService.getDificultadReceta();
  @ViewChild('imageInput') imageInput!: ElementRef;
  
  isChecked = true;
  termino: string = '';
  idReceta: string | null = null;
  private recetaSubscription!: Subscription;

  imagenPreviews: string[] = [];

  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  recetaForm: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    supermercado: ['', Validators.required],
    imagen: ['', Validators.required],
    comensales: ['', Validators.required],
    tiempo: ['', Validators.required],
    categoriaId: ['', Validators.required],
    dificultad: ['', Validators.required],
    pasos: this.formBuilder.array([]),
    ingredientes: this.formBuilder.array([]),
    status: [''],
  },
  { 
    validators: emptyRecipeDontPublish 
  }
);
  
  get statusControl(): FormControl {
    return this.recetaForm.get('status') as FormControl;
  }
  get tituloControl(): FormControl {
    return this.recetaForm.get('titulo') as FormControl;
  }
  get supermercadoControl(): FormControl {
    return this.recetaForm.get('supermercado') as FormControl;
  }
  get imagenControl(): FormControl {
    return this.recetaForm.get('imagen') as FormControl;
  }
  get comensalesControl(): FormControl {
    return this.recetaForm.get('comensales') as FormControl;
  }
  get tiempoControl(): FormControl {
    return this.recetaForm.get('tiempo') as FormControl;
  }
  get categoriaIdControl(): FormControl {
    return this.recetaForm.get('categoriaId') as FormControl;
  }
  get dificultadControl(): FormControl {
    return this.recetaForm.get('dificultad') as FormControl;
  }
  get ingredientes() {
    return this.recetaForm.get('ingredientes') as FormArray;
  }
  get pasos() {
    return this.recetaForm.get('pasos') as FormArray;
  }
  constructor(
    private formBuilder: FormBuilder, 
    private recetasService: RecetasService, 
    private router: Router,
    private toastr: ToastrService, 
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private cd: ChangeDetectorRef,
  ) {
    this.idReceta = this.route.snapshot.paramMap.get('id');
    this.recetasService.getReceta(Number(this.idReceta)).pipe(
      switchMap(receta => {
        this.receta = receta;
        return this.categoriaService.getCategoriasReceta();
      })
    ).subscribe(categorias => {
      this.categorias = categorias;
      this.initForm();
    });
  }

  ngOnInit() {}
  

  
  initForm() {
    // const pasos = this.receta.pasos.map(paso => this.formBuilder.control(paso));
    // const ingredientes = this.receta.ingredientes.map(ingrediente => this.formBuilder.group(ingrediente));
  
    // this.recetaForm = 
    // this.receta.ingredientes.forEach((ingrediente: any) => {
    //   this.ingredientes.push(this.formBuilder.group(ingrediente));
    // });

    // this.receta.pasos.forEach((paso: any) => {
    //   this.pasos.push(this.formBuilder.control(paso));
    // });
    
    this.recetaForm.patchValue({
      status: this.receta.status,
      titulo: this.receta.titulo,
      descripcion: this.receta.descripcion,
      supermercado: this.receta.supermercado,
      imagen: this.receta.imagen,
      comensales: this.receta.comensales,
      tiempo: this.receta.tiempo,
      categoriaId: this.receta.categoriaId,
      dificultad: this.receta.dificultad
    });

    if (this.receta && this.receta.ingredientes) {

    this.receta.ingredientes.forEach((ingrediente: any) => {
      this.ingredientes.push(this.formBuilder.group(ingrediente));
    });
  }
  if (this.receta && this.receta.pasos) {

    this.receta.pasos.forEach((paso: any) => {
      this.pasos.push(this.formBuilder.group(paso));
    });
  }
}

  removeIngredient(index: number): void {
    this.ingredientes.removeAt(index);
  }
  addIngredient(producto: Producto): void {
    const ingrediente = this.formBuilder.group({
      nombre: producto.nombre,
      id: producto.id,
      precio: producto.precioNormal,
      imagen: producto.imagen,
      cantidad: ['', Validators.required]
    });
  
    this.ingredientes.push(ingrediente);
  }

  crearPaso(): FormGroup {
    return this.formBuilder.group({
      paso: ['', Validators.required],
      imagen: [''],
    });
  }
  addPaso() {
    this.pasos.push(this.crearPaso());
    console.log(this.pasos);
  }

  removePaso(index: number) {
    this.pasos.removeAt(index);
  }
  removeImagePaso(index: number) {
    console.log(index)
    // Elimina la imagen del formulario
    this.pasos.at(index).patchValue({
      imagen: ''
    });
    this.receta.pasos[index].imagen = '';
    console.log(this.pasos.at(index));
    // Elimina la vista previa de la imagen
    this.imagenPreviews[index] = '';
    this.imageInput.nativeElement.value = null;

    this.cd.detectChanges(); // Detecta los cambios

  }

  onFileChange(event: any, index: number) {
    if (event.target.files && event.target.files.length) {
      const element = event.target as HTMLInputElement;
      const file = element.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreviews[index] = reader.result as string;  // Guarda la vista previa de la imagen

        this.pasos.at(index).patchValue({
          imagen: file,
          paso: this.pasos.at(index).value.paso  // Guarda el paso en el formulario

        });
        this.cd.detectChanges(); // Detecta los cambios

      };
      reader.readAsDataURL(file);
    }
  }
  // onFileChange(event: any, index: number) {
  //   if (event.target.files && event.target.files.length) {
  //     const element = event.target as HTMLInputElement;
  //     const file = element.files?.[0];
  //     if (!file) {
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = () => {

  //       this.pasos.at(index).patchValue({
  //         imagen: reader.result as string,
  //         paso: this.pasos.at(index).value.paso  // Guarda el paso en el formulario
  
  //       });
  //       this.cd.detectChanges(); // Detecta los cambios
  //       console.log(this.pasos.at(index).value.imagen);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
  isDataUrl(url: string): boolean {
    return /^data:image\/[a-zA-Z]*;base64,/.test(url);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.buscarProductos();
  }

  onSlideToggleChange(event: MatSlideToggleChange): void {
    this.isChecked = event.checked;
  }


  reset(): void {
      this.productosSubject.next([]);
  }
  
  onUpdate() {
    if (this.recetaForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('idReceta', String(this.idReceta));
    formData.append('titulo', this.recetaForm.value.titulo ?? '');
    formData.append('supermercado', this.recetaForm.value.supermercado ?? '');
    formData.append('comensales', this.recetaForm.value.comensales ?? '');
    formData.append('tiempo', this.recetaForm.value.tiempo ?? '');
    formData.append('categoriaId', this.recetaForm.value.categoriaId ?? '');
    formData.append('dificultad', this.recetaForm.value.dificultad ?? '');
    formData.append('status', this.recetaForm.value.status ?? false);

    formData.append('ingredientes', JSON.stringify(this.recetaForm.value.ingredientes));

    this.recetaForm.value.pasos.forEach((paso: { paso: string, imagen: File | string; }, index: any) => {
      console.log(paso);
      if (paso.imagen instanceof File) {
        formData.append('imagen', paso.imagen);
        paso.imagen = '/public/uploads/' + paso.imagen.name;         

      }
    });
    
    
    formData.append('pasos', JSON.stringify(this.recetaForm.value.pasos));
    formData.forEach((value, key) => {
      console.log(key + ' ' + value);
    });
  //Enviar la receta al servidor
  this.recetasService.updateReceta(formData).subscribe({
    next: (response) => {
      this.toastr.success(`${response.message}`, 'Receta');
    },
    error: (error) => {
      this.toastr.error('Se ha producido un error. Intentelo de nuevo más tarde.');
    }
  });


  }
  buscarProductos(): void {
    this.productoService.getProductos(this.termino)      
    // .pipe(takeUntil(this.unsubscribe$))
    .subscribe(productos => {
      this.productosSubject.next(productos);
    });
  }

  ngOnDestroy() {
    if (this.recetaSubscription) {
      this.recetaSubscription.unsubscribe();
    }
  }

}
