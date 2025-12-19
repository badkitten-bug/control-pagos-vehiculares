import { Contract } from '../contracts/contract.entity';
export declare enum ScheduleStatus {
    PENDIENTE = "Pendiente",
    PAGADA = "Pagada",
    VENCIDA = "Vencida"
}
export declare class PaymentSchedule {
    id: number;
    contractId: number;
    contract: Contract;
    numeroCuota: number;
    fechaVencimiento: Date;
    capital: number;
    total: number;
    montoPagado: number;
    saldo: number;
    estado: ScheduleStatus;
    createdAt: Date;
}
