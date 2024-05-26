export interface Categoria {
    categoria: string;
    subcategorias: string[];
    expanded?: boolean;
  }

  export interface Producto {
    id: string;
    idProducto: string;
    imagen: string;
    nombre: string;
    precioNormal: string;
    supermercado: string;
    precioOferta: string;
    categoriaSuper1: string;
    categoriaSuper2: string;
    categoriaSuper3: string;
  }

  export interface ProductoItem {
    productoMarcaSimilar: Producto;
    productoSimilar: Producto;
  }