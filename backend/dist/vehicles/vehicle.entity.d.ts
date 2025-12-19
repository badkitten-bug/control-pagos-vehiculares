import { VehicleMileage } from './vehicle-mileage.entity';
export declare enum VehicleStatus {
    DISPONIBLE = "Disponible",
    VENDIDO = "Vendido",
    INACTIVO = "Inactivo"
}
export declare class Vehicle {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    kilometraje: number;
    estado: VehicleStatus;
    observaciones: string;
    historialKilometraje: VehicleMileage[];
    createdAt: Date;
    updatedAt: Date;
}
