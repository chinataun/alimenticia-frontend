import { Producto } from "../producto/producto.categoria.interface";
import { Receta } from "../recetas/receta";

export interface Autor {
    id: number;
    nombre: string;
    email: string;
    imagen: string;
    apodo: string;
    cp: string;
    supermercado: string;
    username: string;
    apellidos: string;
    createdAt: string;
    updatedAt: string;
    creadas: Receta[];
    favoritas?: Receta[];
    password?: string;
}

export interface Carrito {
    id: number;
    carrito: {
        supermercado: string;
        productos: any[];
        total: number;
    }

}
