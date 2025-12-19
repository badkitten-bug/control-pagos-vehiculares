import { PaymentFrequency, ContractStatus } from '../contract.entity';
export declare class CreateContractDto {
    vehicleId: number;
    fechaInicio: string;
    precio: number;
    pagoInicial: number;
    numeroCuotas: number;
    frecuencia: PaymentFrequency;
    clienteNombre?: string;
    clienteDni?: string;
    clienteTelefono?: string;
    clienteDireccion?: string;
    observaciones?: string;
}
export declare class UpdateContractDto {
    clienteNombre?: string;
    clienteDni?: string;
    clienteTelefono?: string;
    clienteDireccion?: string;
    observaciones?: string;
}
export declare class ChangeContractStatusDto {
    estado: ContractStatus;
}
export declare class SearchContractsDto {
    placa?: string;
    estado?: ContractStatus;
    clienteNombre?: string;
    page?: number;
    limit?: number;
}
