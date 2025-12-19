import { VehicleStatus } from '../vehicle.entity';
export declare class CreateVehicleDto {
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    color?: string;
    kilometraje?: number;
    observaciones?: string;
}
export declare class UpdateVehicleDto {
    marca?: string;
    modelo?: string;
    anio?: number;
    color?: string;
    estado?: VehicleStatus;
    observaciones?: string;
}
export declare class UpdateMileageDto {
    kilometraje: number;
    observacion?: string;
}
export declare class SearchVehiclesDto {
    placa?: string;
    marca?: string;
    modelo?: string;
    anio?: number;
    estado?: VehicleStatus;
    page?: number;
    limit?: number;
}
