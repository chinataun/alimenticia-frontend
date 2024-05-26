
export interface Recetas{
  id:number,
  usuario_id:number,
  titulo:string;
  imagen: string;
  tipo_plato: TipoPlato;
  dificultad: Dificultad;
}

export interface Recetas2023{
  id_receta:number,
  //usuario_id:number,
  titulo:string;
  imagen: string;
  descripcion:string;
  puntuacion: number;
}

export interface LastRecetaIdResponse {
  lastId: number;
}


export enum TipoPlato {
  Primero = '1ºplato',
  Segundo = '2ºplato',
  Postre = 'postre',
 
}


export enum TipoSupermercado {
  Eroski = 'Eroski',
  Ahorramas = 'Ahorramas',
  Dia = 'dia',
 
}




export interface Usuario {
  nombre?: string;
  apodo?: string;
  email?: string;
  contrasena?: string;
  confirmarContrasena?: string;
  imagen?: string;
}

// seasonal-foods.interface.ts

export interface Alimento {
  nombre: string;
  imagen: string;
  // Otros campos relacionados con el alimento
}


export interface Mes {
  id: number;
  nombre_mes: string;
}

export interface Categorias {
  id: number; // Agregado un identificador para las categorías, ajusta según tu estructura
  nombre_categoria: string; // Cambiado de 'categoria' a 'nombre_categoria'
}

export interface ResultadoProducto {
  
  id:number;
  nombre: string;
  precioNormal: string;
  precioOferta: string;
  marca: string;
  imagen: string;
  tieneOferta: boolean;
  detalle: string;
  cantidad: number;
}

export interface Comparacion{
  detalle?: ResultadoProducto; // Aquí está el detalle del producto actual
  detalles?: ResultadoProducto[]; // Aquí estarían los detalles adicionales
}

export interface CalculadoraCalorias {
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



// app/models/alimento.model.ts
export interface InformacionNutricional {
  id: number;
  nombre: string;
  imagen_url: string;
  proteinas: number;
  carbohidratos: number;
  calorias: number;
  grasas: number;
}
// dieta.interface.ts
export interface DietaItem {
  id: number;
  momentoDia: string;
  cantidad: number;
}
export interface Dieta {
  id: number;
  momento_dia: string;
  cantidad: number;
  // Agrega más propiedades según sea necesario
}


export interface ListaCompra {
  id: number;
  usuario_id: number | null;
  producto_id: number;
  cantidad: number;
  fecha_registro: string;
}

export interface RespuestaListaCompra {
  ids: number[];
  message: string;
}


export interface ListaCompra2 {
  usuario_id: number;
  supermercado: string;
  productos: ProductoLista[];
  totalCompra: number;
}

export interface ProductoLista {
  nombre: string;
  cantidad: number;
  precio: number;
}


export interface RespuestaBusquedaRelacionada {
  resultados: ResultadoProductoRelacionado[];
}

export interface ResultadoProductoRelacionado {
  producto: {
    id: number;
    nombre: string;
    precioNormal: string;
    precioOferta: string;
    marca: string;
    imagen: string;
    tieneOferta: boolean;
    detalle: string;
    cantidad: number;
  };

}

export interface RecetaActualizada {
  
  titulo: string;
  descripcion: string;
  supermercado: string;
  comensales:number;
  tiempo:number;
  imagen:string;
  marca: string;
  nombrealimento: string;
  ingredientes: Ingrediente[];
  pasos: Paso[]; 
  categoria:Categoria;
  dificultad:Dificultad;
  id_usuario:number;
  
}
export interface Paso {
  titulo_paso: string;
  descripcion_paso: string;
}
export interface Ingrediente {
  nombre_ingrediente: string;
  cantidad: number;
  unidad: Unidades;
}
// interface.component.ts
export interface Categoria {
  id_categoria: number;
  nombre: string;
}
export interface Dificultad {
  id_dificultad: number;
  nombre: string;
}


export interface Unidades {
  id_unidad: number;
  nombre_unidad: string;
}


// informacion-alimentos-temporada.component.ts

export interface DetallesAlimentosTemporada {
  detalles: {
    nombre: string;
    imagen: string;
    imagen_banner:string;
    descripcion: string;
    calorias: string;
    grasas: string;
    carbohidratos: string;
    proteinas: string;
    metodos_almacenaje: string[];
    duraciones_almacenaje: string[];
    beneficios: string[];
    selecciones: string[];
  };
}

