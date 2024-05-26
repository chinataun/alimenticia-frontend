import { Component } from '@angular/core';
import { Calculadora } from 'src/app/dietetica/calculadora/calculadora.interface';
import { AuthService } from 'src/app/service/authService.service';
import { CalculadoraCaloriasService } from 'src/app/service/calculadoraCaloriasService.service';

@Component({
  selector: 'app-calorias',
  templateUrl: './calorias.component.html',
  styleUrls: ['./calorias.component.scss']
})
export class CaloriasComponent {
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

  constructor(private calculadoraService: CalculadoraCaloriasService, private authService: AuthService) {
    // Asumiendo que getUserIdIfAuthenticated puede devolver number | undefined
const userId = this.authService.getUserIdIfAuthenticated();
this.usuarioRegistrado = userId !== undefined && userId !== null;

  }

  calcularCalorias() {
    this.calculadoraService.calcularCalorias(this.datosCalculadora).subscribe(
      (response) => {
        this.caloriasRecomendadas = response.caloriasRecomendadas;
        this.mensajeGuardadoExitoso = undefined; // Reinicia el mensaje de éxito al calcular calorías
      },
      (error) => {
        console.error('Error al calcular calorías:', error);
      }
    );
  }

  calcularCaloriasUsuarioRegistrado() {
    
    if (this.authService.getUserIdIfAuthenticated()) {
      this.calculadoraService
        .calcularCaloriasUsuarioRegistrado(this.datosCalculadora)
        .subscribe(
          (response) => {
            this.caloriasRecomendadas = response.caloriasRecomendadas;
            this.mensajeGuardadoExitoso = '¡Calorías guardadas con éxito!';
          },
          (error) => {
            console.error('Error al calcular calorías para usuario registrado:', error);
          }
        );
    } else {
      console.log('El usuario no está registrado. No se guardarán las calorías.');
    }
  }
}
