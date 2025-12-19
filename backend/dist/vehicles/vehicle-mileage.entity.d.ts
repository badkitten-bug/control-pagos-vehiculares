import { Vehicle } from './vehicle.entity';
export declare class VehicleMileage {
    id: number;
    vehicleId: number;
    vehicle: Vehicle;
    kilometrajeAnterior: number;
    kilometrajeNuevo: number;
    usuarioId: number;
    usuarioNombre: string;
    observacion: string;
    fechaRegistro: Date;
}
