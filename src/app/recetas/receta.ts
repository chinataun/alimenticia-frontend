import { Autor } from "../user/user.interface";

export interface Receta {
    id: number;
    titulo: string;
    descripcion: string;
    supermercado: string;
    imagen: string;
    comensales: string;
    tiempo: string;
    ingredientes: [
      {
        id: number;
        nombre: string;
        precio: string;
        imagen: string;        
        cantidad: string;
      }
    ];
    pasos: [
      {
        imagen: string;
        paso: string;
      }
    ];
    categoriaId: string;
    categoriaReceta: CategoriaReceta;
    dificultad: string;    
    autor: Autor;
    status: boolean;
    userId: number;
    rating: number;
    precio: number;
    createdAt: string;
    votos: any[];
  }

  export interface CategoriaReceta {
    id: number, 
    nombre: string
  }




  export interface FavoritesCredentials {
    recetaId: number, 
    userId: number
  }

  export interface RecetaCredentials {
    titulo: string;
    descripcion: string;
    supermercado: string;
    comensales: number;
    tiempo: number;
    categoriaId: number;
    dificultad: string;    
  }

  export interface UserRecetaCredentials extends RecetaCredentials {
    userId: number | null;  
  }