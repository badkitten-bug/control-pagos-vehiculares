"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const exceljs_1 = __importDefault(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
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
        const vehicles = await this.vehicleRepository
            .createQueryBuilder('vehicle')
            .where('vehicle.placa LIKE :placa', { placa: `%${placa.toUpperCase()}%` })
            .orderBy('vehicle.placa', 'ASC')
            .take(10)
            .getMany();
        if (vehicles.length === 0)
            return [];
        const results = [];
        for (const vehicle of vehicles) {
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
            results.push({
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
            });
        }
        return results;
    }
    async getTrafficLightReport(filters) {
        const today = (0, date_fns_1.startOfDay)(new Date());
        const queryBuilder = this.contractRepository
            .createQueryBuilder('contract')
            .leftJoinAndSelect('contract.vehicle', 'vehicle')
            .leftJoinAndSelect('contract.cronograma', 'schedule')
            .where('contract.estado = :estado', { estado: contract_entity_1.ContractStatus.VIGENTE });
        if (filters?.placa) {
            queryBuilder.andWhere('vehicle.placa LIKE :placa', {
                placa: `%${filters.placa.toUpperCase()}%`,
            });
        }
        if (filters?.frecuencia) {
            queryBuilder.andWhere('contract.frecuencia = :frecuencia', {
                frecuencia: filters.frecuencia,
            });
        }
        const contracts = await queryBuilder.getMany();
        const items = [];
        for (const contract of contracts) {
            const overdueSchedules = contract.cronograma.filter((s) => s.estado !== payment_schedule_entity_1.ScheduleStatus.PAGADA &&
                new Date(s.fechaVencimiento) < today);
            const cuotasVencidas = overdueSchedules.length;
            const montoVencido = overdueSchedules.reduce((sum, s) => sum + parseFloat(s.saldo.toString()), 0);
            let diasAtraso = 0;
            if (overdueSchedules.length > 0) {
                const oldestOverdue = overdueSchedules.reduce((oldest, s) => new Date(s.fechaVencimiento) < new Date(oldest.fechaVencimiento)
                    ? s
                    : oldest);
                diasAtraso = (0, date_fns_1.differenceInDays)(today, new Date(oldestOverdue.fechaVencimiento));
            }
            let semaforo;
            if (contract.frecuencia === contract_entity_1.PaymentFrequency.DIARIO) {
                semaforo = diasAtraso >= 3 ? 'rojo' : diasAtraso >= 1 ? 'ambar' : 'verde';
            }
            else {
                semaforo = cuotasVencidas >= 3 ? 'rojo' : cuotasVencidas >= 1 ? 'ambar' : 'verde';
            }
            if (filters?.semaforo && filters.semaforo !== semaforo) {
                continue;
            }
            const lastPayment = await this.paymentRepository.findOne({
                where: { contractId: contract.id },
                order: { fechaPago: 'DESC' },
            });
            items.push({
                vehicleId: contract.vehicle.id,
                placa: contract.vehicle.placa,
                marca: contract.vehicle.marca,
                modelo: contract.vehicle.modelo,
                contractId: contract.id,
                clienteNombre: contract.clienteNombre || '-',
                clienteTelefono: contract.clienteTelefono || '-',
                frecuencia: contract.frecuencia,
                cuotasVencidas,
                montoVencido,
                diasAtraso,
                semaforo,
                ultimoPago: lastPayment?.fechaPago || null,
            });
        }
        const order = { rojo: 0, ambar: 1, verde: 2 };
        items.sort((a, b) => {
            const orderDiff = order[a.semaforo] - order[b.semaforo];
            if (orderDiff !== 0)
                return orderDiff;
            return b.diasAtraso - a.diasAtraso;
        });
        return items;
    }
    async exportArrearsToExcel(data) {
        const workbook = new exceljs_1.default.Workbook();
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
            const doc = new pdfkit_1.default({ margin: 30, size: 'A4', layout: 'landscape' });
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
    async getDashboardStats() {
        const today = (0, date_fns_1.startOfDay)(new Date());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const totalVehiculos = await this.vehicleRepository.count();
        const vehiculosDisponibles = await this.vehicleRepository.count({
            where: { estado: 'Disponible' },
        });
        const contratosVigentes = await this.contractRepository.count({
            where: { estado: contract_entity_1.ContractStatus.VIGENTE },
        });
        const paymentsThisMonth = await this.paymentRepository
            .createQueryBuilder('payment')
            .where('payment.fechaPago >= :startOfMonth', { startOfMonth })
            .getMany();
        const totalCobradoMes = paymentsThisMonth.reduce((sum, p) => sum + parseFloat(p.importe.toString()), 0);
        const pendingSchedules = await this.scheduleRepository.find({
            where: { estado: payment_schedule_entity_1.ScheduleStatus.PENDIENTE },
        });
        const overdueSchedules = await this.scheduleRepository
            .createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.contract', 'contract')
            .where('schedule.estado != :paid', { paid: payment_schedule_entity_1.ScheduleStatus.PAGADA })
            .andWhere('schedule.fechaVencimiento < :today', { today })
            .getMany();
        const totalPendiente = pendingSchedules.reduce((sum, s) => sum + parseFloat(s.saldo.toString()), 0);
        let totalMoraAcumulada = 0;
        for (const schedule of overdueSchedules) {
            const diasAtraso = (0, date_fns_1.differenceInDays)(today, new Date(schedule.fechaVencimiento));
            const saldo = parseFloat(schedule.saldo.toString());
            const moraPct = parseFloat((schedule.contract?.moraPorcentaje || 0).toString());
            if (moraPct > 0 && diasAtraso > 0) {
                totalMoraAcumulada += (saldo * moraPct / 100) * diasAtraso;
            }
        }
        const trafficLight = await this.getTrafficLightReport();
        const semaforo = {
            verde: trafficLight.filter(t => t.semaforo === 'verde').length,
            ambar: trafficLight.filter(t => t.semaforo === 'ambar').length,
            rojo: trafficLight.filter(t => t.semaforo === 'rojo').length,
        };
        const cobranzasMensuales = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
            const monthName = monthStart.toLocaleString('es-PE', { month: 'short' });
            const payments = await this.paymentRepository
                .createQueryBuilder('payment')
                .where('payment.fechaPago >= :start', { start: monthStart })
                .andWhere('payment.fechaPago <= :end', { end: monthEnd })
                .getMany();
            const cobrado = payments.reduce((sum, p) => sum + parseFloat(p.importe.toString()), 0);
            const schedulesInMonth = await this.scheduleRepository
                .createQueryBuilder('schedule')
                .where('schedule.fechaVencimiento >= :start', { start: monthStart })
                .andWhere('schedule.fechaVencimiento <= :end', { end: monthEnd })
                .getMany();
            const pendiente = schedulesInMonth
                .filter(s => s.estado !== payment_schedule_entity_1.ScheduleStatus.PAGADA)
                .reduce((sum, s) => sum + parseFloat(s.saldo.toString()), 0);
            cobranzasMensuales.push({ mes: monthName, cobrado, pendiente });
        }
        return {
            totalVehiculos,
            vehiculosDisponibles,
            contratosVigentes,
            totalCobradoMes,
            totalPendiente,
            totalMoraAcumulada: Math.round(totalMoraAcumulada * 100) / 100,
            semaforo,
            cobranzasMensuales,
        };
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