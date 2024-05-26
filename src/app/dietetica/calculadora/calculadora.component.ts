import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Calculadora } from './calculadora.interface';
import { DieteticaService } from '../dietetica.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrl: './calculadora.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculadoraComponent implements OnInit {
  calculadoraForm!: FormGroup;
  datosCalculadora: Calculadora = {
    sexo: '',
    edad: 0,
    peso: 0,
    altura: 0,
    actividad_fisica: '',
  };
  caloriasRecomendadas: number | undefined;
  usuarioRegistrado: boolean = false;
  mensajeGuardadoExitoso: string | undefined;
  resultado: number | null = 0;

  @ViewChild('formDirective') private formDirective!: NgForm;


  constructor(
    private appService: AppService,
    private calculadoraService: DieteticaService, 
    private authService: AuthService,   
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // this.appService.changeBannerImage('assets/banner/calculadora.png');
    this.appService.changeBannerImage('assets/banner/2.svg');
    this.calculadoraForm = this.formBuilder.group({
      sexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      peso: ['', [Validators.required, Validators.min(1)]],
      altura: ['', [Validators.required, Validators.min(1)]],
      actividadFisica: ['', Validators.required]
    });
  }

  get sexoControl(): FormControl {
    return this.calculadoraForm.get('sexo') as FormControl;
  }

  get edadControl(): FormControl {
    return this.calculadoraForm.get('edad') as FormControl;
  }

  get pesoControl(): FormControl {
    return this.calculadoraForm.get('peso') as FormControl;
  }

  get alturaControl(): FormControl {
    return this.calculadoraForm.get('altura') as FormControl;
  }

  get actividadFisicaControl(): FormControl {
    return this.calculadoraForm.get('actividadFisica') as FormControl;
  }



  ocultarResultado() {
    this.resultado = null;
  }

  calcularCalorias() {
    const formValues = this.calculadoraForm.value;
    this.datosCalculadora = {
      sexo: formValues.sexo,
      edad: formValues.edad,
      peso: formValues.peso,
      altura: formValues.altura,
      actividad_fisica: formValues.actividadFisica,
    };

    let caloriasRecomendadas = 0;

    if (this.datosCalculadora.sexo === 'hombre') {
      caloriasRecomendadas = 88.362 + (13.397 * this.datosCalculadora.peso) + (4.799 * this.datosCalculadora.altura) - (5.677 * this.datosCalculadora.edad);
    } else if (this.datosCalculadora.sexo === 'mujer') {
      caloriasRecomendadas = 447.593 + (9.247 * this.datosCalculadora.peso) + (3.098 * this.datosCalculadora.altura) - (4.330 * this.datosCalculadora.edad);
    }

    switch (this.datosCalculadora.actividad_fisica) {
      case 'nada':
        caloriasRecomendadas *= 1.2;
        break;
      case 'baja':
        caloriasRecomendadas *= 1.375;
        break;
      case 'media':
        caloriasRecomendadas *= 1.55;
        break;
      case 'alta':
        caloriasRecomendadas *= 1.725;
        break;
      case 'muy alta':
        caloriasRecomendadas *= 1.9;
        break;
      default:
        break;
    }

    this.resultado = parseFloat(caloriasRecomendadas.toFixed(2));
    
    // Object.keys(this.calculadoraForm.controls).forEach(key => {
    //   const control = this.calculadoraForm.get(key);
    //   if (control) {
    //     control.markAsPristine();
    //     control.markAsUntouched();
    //   }
    // });
    // this.formDirective.resetForm();
    console.log('Calorías recomendadas:', caloriasRecomendadas);



    // this.calculadoraService.calcularCalorias(this.datosCalculadora).subscribe(
    //   (response) => {
    //     this.caloriasRecomendadas = response.caloriasRecomendadas;
    //     this.mensajeGuardadoExitoso = undefined; // Reinicia el mensaje de éxito al calcular calorías
    //   },
    //   (error) => {
    //     console.error('Error al calcular calorías:', error);
    //   }
    // );
  }

  // calcularCaloriasUsuarioRegistrado() {
    
  //   if (this.authService.getUserIdIfAuthenticated()) {
  //     this.calculadoraService
  //       .calcularCaloriasUsuarioRegistrado(this.datosCalculadora)
  //       .subscribe(
  //         (response) => {
  //           this.caloriasRecomendadas = response.caloriasRecomendadas;
  //           this.mensajeGuardadoExitoso = '¡Calorías guardadas con éxito!';
  //         },
  //         (error) => {
  //           console.error('Error al calcular calorías para usuario registrado:', error);
  //         }
  //       );
  //   } else {
  //     console.log('El usuario no está registrado. No se guardarán las calorías.');
  //   }
  // }
}

