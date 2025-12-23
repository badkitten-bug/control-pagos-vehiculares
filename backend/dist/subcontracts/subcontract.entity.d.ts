import { Contract } from '../contracts/contract.entity';
export declare enum SubcontractMode {
    INDEPENDIENTE = "Independiente",
    AGREGAR_A_CUOTAS = "AgregarACuotas"
}
export declare enum SubcontractStatus {
    VIGENTE = "Vigente",
    CANCELADO = "Cancelado",
    ANULADO = "Anulado"
}
export declare class Subcontract {
    id: number;
    parentContractId: number;
    parentContract: Contract;
    tipo: string;
    modalidad: SubcontractMode;
    monto: number;
    numeroCuotas: number;
    frecuencia: string;
    fechaInicio: Date;
    descripcion: string;
    estado: SubcontractStatus;
    cronograma: SubcontractSchedule[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class SubcontractSchedule {
    id: number;
    subcontractId: number;
    subcontract: Subcontract;
    numeroCuota: number;
    fechaVencimiento: Date;
    monto: number;
    montoPagado: number;
    saldo: number;
    estado: string;
    createdAt: Date;
}
