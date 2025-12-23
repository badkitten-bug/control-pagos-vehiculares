export declare class Client {
    id: number;
    dni: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    telefonoSecundario: string;
    email: string;
    direccion: string;
    fechaNacimiento: Date;
    ocupacion: string;
    observaciones: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    get nombreCompleto(): string;
}
