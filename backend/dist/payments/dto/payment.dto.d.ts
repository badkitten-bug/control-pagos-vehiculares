import { PaymentType, PaymentMethod } from '../payment.entity';
export declare class CreatePaymentDto {
    contractId: number;
    scheduleId?: number;
    tipo: PaymentType;
    importe: number;
    fechaPago: string;
    medioPago: PaymentMethod;
    numeroOperacion?: string;
    notas?: string;
}
export declare class SearchPaymentsDto {
    contractId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    page?: number;
    limit?: number;
}
