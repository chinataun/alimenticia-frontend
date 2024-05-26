import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { EMPTY, Observable, catchError, finalize, map, of, tap, throwError } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { ApiProduct, ApiResponse } from '../dietetica.interface';
import { DieteticaService } from '../dietetica.service';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nutricion',
  templateUrl: './nutricion.component.html',
  styleUrl: './nutricion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NutricionComponent {
  nutricionForm!: FormGroup;
  termino: string = '';
  productName: string = '';
  productos$!: Observable<ApiProduct[]>;
  totalProducts$: Observable<number>; // Deberías obtener este valor de la API
  isLoading = false;

  constructor(
    private appService: AppService,
    private dieteticaService: DieteticaService,
    private formBuilder: FormBuilder
  ){
    this.totalProducts$ = this.dieteticaService.totalProducts$;

    // this.appService.changeBannerImage('assets/banner/nutricion.png');
    this.appService.changeBannerImage('assets/banner/1.svg');
    this.nutricionForm = this.formBuilder.group({
      termino: ['', Validators.required]
    })
  }

  get terminoControl(): FormControl {
    return this.nutricionForm.get('termino') as FormControl;
  }

  ngOnInit(): void {
  }

  buscar(): void {
    this.termino = this.nutricionForm.get('termino')?.value;
    console.log(this.termino)
      this.searchProducts(this.termino);
    
  }

  pageChanged(event: PageEvent): void {
    this.searchProducts(this.termino, event.pageIndex + 1);
  }

  searchProducts(termino: string, page: number = 1): void {
    // this.dieteticaService.searchProducts(termino, page);
    // this.productos$ = this.dieteticaService.searchProducts(this.termino);this.dieteticaService.searchProducts(this.termino).subscribe();
    this.isLoading = true;
    this.productos$ = this.dieteticaService.searchProducts(termino, page).pipe(
      finalize(() => this.isLoading = false),
      catchError(error => {
        this.isLoading = false;
        console.error('Error al buscar productos', error);
        return EMPTY;
      })
    );
     
  }

  
 
}
