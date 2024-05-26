export interface ApiProduct {
    title: string;
    imageUrl: string;
    nutritionalInfo: any;
    ecoScore: string;
    nutriScore: string;
    novaGroup: string;
    ingredientes: string;
    numIngredientes: number,
    alergenos: string
}

export interface ApiResponse {
    products: any[];
    count: number;
    page: string;
    page_count: number;
    page_size: number;
    skip: number;
}

// export interface Nutricionalnfo {
//     energy-kj_100g: string
// }