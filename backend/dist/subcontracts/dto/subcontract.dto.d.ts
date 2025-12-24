import { SubcontractMode } from '../subcontract.entity';
export declare class CreateSubcontractDto {
    parentContractId: number;
    tipo: string;
    modalidad: SubcontractMode;
    monto: number;
    numeroCuotas?: number;
    frecuencia?: string;
    fechaInicio: string;
    descripcion?: string;
}
export declare class SearchSubcontractsDto {
    parentContractId?: number;
    page?: number;
    limit?: number;
}
export declare class PaySubcontractScheduleDto {
    monto: number;
    fechaPago: string;
    medioPago: string;
    numeroOperacion?: string;
    notas?: string;
}
