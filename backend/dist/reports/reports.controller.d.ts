import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { ContractStatus, PaymentFrequency } from '../contracts/contract.entity';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getArrearsReport(fechaDesde?: string, fechaHasta?: string, frecuencia?: PaymentFrequency, estado?: ContractStatus, placa?: string): Promise<import("./reports.service").ArrearsReportItem[]>;
    exportArrearsExcel(res: Response, fechaDesde?: string, fechaHasta?: string, frecuencia?: PaymentFrequency, estado?: ContractStatus, placa?: string): Promise<void>;
    exportArrearsPdf(res: Response, fechaDesde?: string, fechaHasta?: string, frecuencia?: PaymentFrequency, estado?: ContractStatus, placa?: string): Promise<void>;
    quickSearch(placa: string): Promise<import("./reports.service").QuickSearchResult | null>;
}
