
export interface Calculadora {
    sexo: string;
    edad: number;
    peso: number;
    altura: number;
    actividad_fisica: string;
}

export interface CaloriasResponse {
    caloriasRecomendadas: number;
    message?: string;
    error?: string;
}