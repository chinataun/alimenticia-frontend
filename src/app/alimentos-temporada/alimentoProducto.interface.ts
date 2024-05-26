import { Producto } from "../producto/producto.categoria.interface";

export interface Productos {
    [supermercado: string]: Producto[];
  }