export declare class CreateClientDto {
    dni: string;
    nombres: string;
    apellidos: string;
    telefono?: string;
    telefonoSecundario?: string;
    email?: string;
    direccion?: string;
    fechaNacimiento?: string;
    ocupacion?: string;
    observaciones?: string;
}
export declare class UpdateClientDto {
    nombres?: string;
    apellidos?: string;
    telefono?: string;
    telefonoSecundario?: string;
    email?: string;
    direccion?: string;
    fechaNacimiento?: string;
    ocupacion?: string;
    observaciones?: string;
    activo?: boolean;
}
export declare class SearchClientDto {
    search?: string;
    activo?: boolean;
}
