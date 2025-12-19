"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_entity_1 = require("../contracts/contract.entity");
const payment_schedule_entity_1 = require("../payment-schedules/payment-schedule.entity");
const payment_entity_1 = require("../payments/payment.entity");
const vehicle_entity_1 = require("../vehicles/vehicle.entity");
const date_fns_1 = require("date-fns");
const ExcelJS = __importStar(require("exceljs"));
const PDFDocument = __importStar(require("pdfkit"));
let ReportsService = class ReportsService {
    contractRepository;
    scheduleRepository;
    paymentRepository;
    vehicleRepository;
    constructor(contractRepository, scheduleRepository, paymentRepository, vehicleRepository) {
        this.contractRepository = contractRepository;
        this.scheduleRepository = scheduleRepository;
        this.paymentRepository = paymentRepository;
        this.vehicleRepository = vehicleRepository;
    }
    async getArrearsReport(filters) {
        const today = (0, date_fns_1.startOfDay)(new Date());
        const queryBuilder = this.contractRepository
            .createQueryBuilder('contract')
            .leftJoinAndSelect('contract.vehicle', 'vehicle')
            .leftJoinAndSelect('contract.cronograma', 'schedule')
            .where('contract.estado IN (:...estados)', {
            estados: [contract_entity_1.ContractStatus.VIGENTE, contract_entity_1.ContractStatus.BORRADOR],
        });
        if (filters.placa) {
            queryBuilder.andWhere('vehicle.placa LIKE :placa', {
                placa: `%${filters.placa.toUpperCase()}%`,
            });
        }
        if (filters.frecuencia) {
            queryBuilder.andWhere('contract.frecuencia = :frecuencia', {
                frecuencia: filters.frecuencia,
            });
        }
        if (filters.estado) {
            queryBuilder.andWhere('contract.estado = :estado', {
                estado: filters.estado,
            });
        }
        const contracts = await queryBuilder.getMany();
        const reportItems = [];
        for (const contract of contracts) {
            const overdueSchedules = contract.cronograma.filter((s) => s.estado !== payment_schedule_entity_1.ScheduleStatus.PAGADA &&
                new Date(s.fechaVencimiento) < today);
            if (overdueSchedules.length === 0)
                continue;
            const montoVencido = overdueSchedules.reduce((sum, s) => sum + parseFloat(s.saldo.toString()), 0);
            const oldestOverdue = overdueSchedules.reduce((oldest, s) => new Date(s.fechaVencimiento) < new Date(oldest.fechaVencimiento)
                ? s
                : oldest);
            const maxDiasAtraso = (0, date_fns_1.differenceInDays)(today, new Date(oldestOverdue.fechaVencimiento));
            const lastPayment = await this.paymentRepository.findOne({
                where: { contractId: contract.id },
                order: { fechaPago: 'DESC' },
            });
            reportItems.push({
                placa: contract.vehicle.placa,
                contractId: contract.id,
                fechaContrato: contract.fechaInicio,
                cuotasVencidas: overdueSchedules.length,
                montoVencido,
                maxDiasAtraso,
                ultimoPago: {
                    fecha: lastPayment?.fechaPago || null,
                    importe: lastPayment ? parseFloat(lastPayment.importe.toString()) : null,
                },
                frecuencia: contract.frecuencia,
                estado: contract.estado,
            });
        }
        reportItems.sort((a, b) => {
            if (b.maxDiasAtraso !== a.maxDiasAtraso) {
                return b.maxDiasAtraso - a.maxDiasAtraso;
            }
            return b.montoVencido - a.montoVencido;
        });
        return reportItems;
    }
    async getQuickSearchByPlaca(placa) {
        const vehicle = await this.vehicleRepository.findOne({
            where: { placa: placa.toUpperCase() },
        });
        if (!vehicle)
            return null;
        const activeContract = await this.contractRepository.findOne({
            where: {
                vehicleId: vehicle.id,
                estado: contract_entity_1.ContractStatus.VIGENTE,
            },
            relations: ['cronograma'],
        });
        let proximaCuota = null;
        let deudaVencida = 0;
        let totalPagado = 0;
        if (activeContract) {
            const nextSchedule = activeContract.cronograma
                .filter((s) => s.estado === payment_schedule_entity_1.ScheduleStatus.PENDIENTE)
                .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime())[0];
            if (nextSchedule) {
                proximaCuota = {
                    numero: nextSchedule.numeroCuota,
                    fechaVencimiento: nextSchedule.fechaVencimiento,
                    importe: parseFloat(nextSchedule.saldo.toString()),
                };
            }
            const today = (0, date_fns_1.startOfDay)(new Date());
            deudaVencida = activeContract.cronograma
                .filter((s) => s.estado !== payment_schedule_entity_1.ScheduleStatus.PAGADA &&
                new Date(s.fechaVencimiento) < today)
                .reduce((sum, s) => sum + parseFloat(s.saldo.toString()), 0);
            const payments = await this.paymentRepository.find({
                where: { contractId: activeContract.id },
            });
            totalPagado = payments.reduce((sum, p) => sum + parseFloat(p.importe.toString()), 0);
        }
        return {
            placa: vehicle.placa,
            estado: vehicle.estado,
            vehicleStatus: vehicle.estado,
            contratoActivo: activeContract
                ? {
                    id: activeContract.id,
                    estado: activeContract.estado,
                    fechaInicio: activeContract.fechaInicio,
                    precio: parseFloat(activeContract.precio.toString()),
                    pagoInicial: parseFloat(activeContract.pagoInicial.toString()),
                }
                : null,
            proximaCuota,
            deudaVencida,
            totalPagado,
        };
    }
    async exportArrearsToExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Atrasos');
        worksheet.columns = [
            { header: 'Placa', key: 'placa', width: 12 },
            { header: 'ID Contrato', key: 'contractId', width: 12 },
            { header: 'Fecha Contrato', key: 'fechaContrato', width: 15 },
            { header: 'Cuotas Vencidas', key: 'cuotasVencidas', width: 15 },
            { header: 'Monto Vencido', key: 'montoVencido', width: 15 },
            { header: 'Días de Atraso', key: 'maxDiasAtraso', width: 15 },
            { header: 'Último Pago (Fecha)', key: 'ultimoPagoFecha', width: 18 },
            { header: 'Último Pago (Monto)', key: 'ultimoPagoMonto', width: 18 },
            { header: 'Frecuencia', key: 'frecuencia', width: 12 },
            { header: 'Estado', key: 'estado', width: 12 },
        ];
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3B82F6' },
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        data.forEach((item) => {
            worksheet.addRow({
                placa: item.placa,
                contractId: item.contractId,
                fechaContrato: item.fechaContrato,
                cuotasVencidas: item.cuotasVencidas,
                montoVencido: item.montoVencido,
                maxDiasAtraso: item.maxDiasAtraso,
                ultimoPagoFecha: item.ultimoPago.fecha || 'N/A',
                ultimoPagoMonto: item.ultimoPago.importe || 0,
                frecuencia: item.frecuencia,
                estado: item.estado,
            });
        });
        return workbook;
    }
    async exportArrearsToPdf(data) {
        return new Promise((resolve) => {
            const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.fontSize(18).text('Reporte de Atrasos', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Generado: ${new Date().toLocaleDateString('es-PE')}`);
            doc.moveDown();
            const headers = [
                'Placa',
                'Contrato',
                'Cuotas Venc.',
                'Monto Venc.',
                'Días Atraso',
                'Últ. Pago',
            ];
            let y = doc.y;
            const startX = 30;
            const colWidths = [70, 70, 80, 90, 80, 100];
            doc.fillColor('#3B82F6').rect(startX, y, 750, 20).fill();
            doc.fillColor('#FFFFFF');
            let x = startX;
            headers.forEach((header, i) => {
                doc.text(header, x + 5, y + 5, { width: colWidths[i] });
                x += colWidths[i];
            });
            y += 25;
            doc.fillColor('#000000');
            data.slice(0, 25).forEach((item) => {
                x = startX;
                const row = [
                    item.placa,
                    `#${item.contractId}`,
                    item.cuotasVencidas.toString(),
                    `S/ ${item.montoVencido.toFixed(2)}`,
                    item.maxDiasAtraso.toString(),
                    item.ultimoPago.fecha
                        ? `${new Date(item.ultimoPago.fecha).toLocaleDateString('es-PE')}`
                        : 'N/A',
                ];
                row.forEach((cell, i) => {
                    doc.text(cell, x + 5, y, { width: colWidths[i] });
                    x += colWidths[i];
                });
                y += 18;
            });
            doc.end();
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_schedule_entity_1.PaymentSchedule)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(3, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map