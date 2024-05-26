import { Producto } from "../producto/producto.categoria.interface";

export interface CarritoItem {
    producto: Producto;
    cantidad: number;
  }