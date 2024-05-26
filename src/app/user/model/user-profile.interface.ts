export interface UserProfile {
    id: number;
    username: string;
    email: string;
    nombre: string;
    apellidos: string;
    apodo: string;
    imagen: string;
    cp: string;
    supermercado: string;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
    newPasswordRepeat: string;
}