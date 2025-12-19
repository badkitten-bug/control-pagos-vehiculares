import { Contract } from '../contracts/contract.entity';
import { PaymentSchedule } from '../payment-schedules/payment-schedule.entity';
export declare enum PaymentType {
    PAGO_INICIAL = "Pago Inicial",
    CUOTA = "Cuota",
    ABONO = "Abono"
}
export declare enum PaymentMethod {
    EFECTIVO = "Efectivo",
    TRANSFERENCIA = "Transferencia",
    YAPE = "Yape",
    PLIN = "Plin",
    TARJETA = "Tarjeta",
    OTRO = "Otro"
}
export declare class Payment {
    id: number;
    contractId: number;
    contract: Contract;
    scheduleId: number;
    schedule: PaymentSchedule;
    tipo: PaymentType;
    importe: number;
    fechaPago: Date;
    medioPago: PaymentMethod;
    numeroOperacion: string;
    voucher: string;
    notas: string;
    usuarioId: number;
    usuarioNombre: string;
    createdAt: Date;
}
