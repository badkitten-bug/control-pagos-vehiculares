import { Vehicle } from '../vehicles/vehicle.entity';
import { PaymentSchedule } from '../payment-schedules/payment-schedule.entity';
import { Payment } from '../payments/payment.entity';
export declare enum ContractStatus {
    BORRADOR = "Borrador",
    VIGENTE = "Vigente",
    CANCELADO = "Cancelado",
    ANULADO = "Anulado"
}
export declare enum PaymentFrequency {
    DIARIO = "Diario",
    SEMANAL = "Semanal",
    QUINCENAL = "Quincenal",
    MENSUAL = "Mensual"
}
export declare class Contract {
    id: number;
    vehicleId: number;
    vehicle: Vehicle;
    fechaInicio: Date;
    precio: number;
    pagoInicial: number;
    numeroCuotas: number;
    frecuencia: PaymentFrequency;
    estado: ContractStatus;
    clienteNombre: string;
    clienteDni: string;
    clienteTelefono: string;
    clienteDireccion: string;
    observaciones: string;
    pagoInicialRegistrado: boolean;
    cronograma: PaymentSchedule[];
    pagos: Payment[];
    createdAt: Date;
    updatedAt: Date;
}
