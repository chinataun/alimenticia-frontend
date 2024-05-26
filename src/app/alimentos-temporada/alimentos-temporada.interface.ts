export interface Alimento {
  id: string;
  nombre: string;
  imagen: string;
  imagen_banner: string;
  descripcion: string;
  calorias: string;
  grasas: string;
  carbohidratos: string;
  proteinas: string;
  categoria: Categoria;
  temporada: Temporada;
  beneficio: Beneficio[];
  almacenaje: Almacenaje[];
  seleccion: Seleccion[];
}

export interface Temporada {
  temporada: string;
  entrando: string;
  alimentoId: string;
}

export interface Categoria {
  nombre: string;
}

export interface Beneficio {
  beneficio: string;
}

export interface Almacenaje {
  metodo: string;
  duracion: string;
}
export interface Seleccion {
  seleccion: string;
}

export interface AlimentoConEstado extends Alimento {
  esPrimeroEnEstado?: boolean;
}