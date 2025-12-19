export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    rol: UserRole;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
