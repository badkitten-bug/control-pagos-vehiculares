import { Repository } from 'typeorm';
import { Contract, ContractStatus, PaymentFrequency } from '../contracts/contract.entity';
import { PaymentSchedule } from '../payment-schedules/payment-schedule.entity';
import { Payment } from '../payments/payment.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import ExcelJS from 'exceljs';
export interface ArrearsReportItem {
    placa: string;
    contractId: number;
    fechaContrato: Date;
    cuotasVencidas: number;
    montoVencido: number;
    maxDiasAtraso: number;
    ultimoPago: {
        fecha: Date | null;
        importe: number | null;
    };
    frecuencia: PaymentFrequency;
    estado: ContractStatus;
}
export interface QuickSearchResult {
    placa: string;
    estado: string;
    vehicleStatus: string;
    contratoActivo: {
        id: number;
        estado: ContractStatus;
        fechaInicio: Date;
        precio: number;
        pagoInicial: number;
    } | null;
    proximaCuota: {
        numero: number;
        fechaVencimiento: Date;
        importe: number;
    } | null;
    deudaVencida: number;
    totalPagado: number;
}
export type SemaforoStatus = 'verde' | 'ambar' | 'rojo';
export interface TrafficLightItem {
    vehicleId: number;
    placa: string;
    marca: string;
    modelo: string;
    contractId: number;
    clienteNombre: string;
    clienteTelefono: string;
    frecuencia: PaymentFrequency;
    cuotasVencidas: number;
    montoVencido: number;
    diasAtraso: number;
    semaforo: SemaforoStatus;
    ultimoPago: Date | null;
}
export interface DashboardStats {
    totalVehiculos: number;
    vehiculosDisponibles: number;
    contratosVigentes: number;
    totalCobradoMes: number;
    totalPendiente: number;
    totalMoraAcumulada: number;
    semaforo: {
        verde: number;
        ambar: number;
        rojo: number;
    };
    cobranzasMensuales: {
        mes: string;
        cobrado: number;
        pendiente: number;
    }[];
}
export declare class ReportsService {
    private contractRepository;
    private scheduleRepository;
    private paymentRepository;
    private vehicleRepository;
    constructor(contractRepository: Repository<Contract>, scheduleRepository: Repository<PaymentSchedule>, paymentRepository: Repository<Payment>, vehicleRepository: Repository<Vehicle>);
    getArrearsReport(filters: {
        fechaDesde?: string;
        fechaHasta?: string;
        frecuencia?: PaymentFrequency;
        estado?: ContractStatus;
        placa?: string;
    }): Promise<ArrearsReportItem[]>;
    getQuickSearchByPlaca(placa: string): Promise<QuickSearchResult[]>;
    getTrafficLightReport(filters?: {
        semaforo?: SemaforoStatus;
        placa?: string;
        frecuencia?: PaymentFrequency;
    }): Promise<TrafficLightItem[]>;
    exportArrearsToExcel(data: ArrearsReportItem[]): Promise<ExcelJS.Workbook>;
    exportArrearsToPdf(data: ArrearsReportItem[]): Promise<Buffer>;
    getDashboardStats(): Promise<DashboardStats>;
}
