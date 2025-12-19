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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_schedule_entity_1 = require("./payment-schedule.entity");
const contract_entity_1 = require("../contracts/contract.entity");
const date_fns_1 = require("date-fns");
let PaymentSchedulesService = class PaymentSchedulesService {
    scheduleRepository;
    constructor(scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }
    async generateSchedule(contract) {
        const precio = parseFloat(contract.precio.toString());
        const pagoInicial = parseFloat(contract.pagoInicial.toString());
        const capitalTotal = precio - pagoInicial;
        if (capitalTotal <= 0) {
            throw new common_1.BadRequestException('El pago inicial no puede ser mayor o igual al precio');
        }
        const cuotaBase = Math.floor((capitalTotal / contract.numeroCuotas) * 100) / 100;
        const ajusteFinal = Math.round((capitalTotal - (cuotaBase * (contract.numeroCuotas - 1))) * 100) / 100;
        const schedules = [];
        let fechaActual = new Date(contract.fechaInicio);
        for (let i = 1; i <= contract.numeroCuotas; i++) {
            const fechaVencimiento = this.calculateNextDate(fechaActual, contract.frecuencia, i);
            const capitalCuota = i === contract.numeroCuotas ? ajusteFinal : cuotaBase;
            const schedule = this.scheduleRepository.create({
                contractId: contract.id,
                numeroCuota: i,
                fechaVencimiento,
                capital: capitalCuota,
                total: capitalCuota,
                saldo: capitalCuota,
                estado: payment_schedule_entity_1.ScheduleStatus.PENDIENTE,
            });
            schedules.push(schedule);
            fechaActual = fechaVencimiento;
        }
        return this.scheduleRepository.save(schedules);
    }
    calculateNextDate(baseDate, frequency, cuotaNumber) {
        const startDate = new Date(baseDate);
        switch (frequency) {
            case contract_entity_1.PaymentFrequency.DIARIO:
                return (0, date_fns_1.addDays)(startDate, 1);
            case contract_entity_1.PaymentFrequency.SEMANAL:
                return (0, date_fns_1.addWeeks)(startDate, 1);
            case contract_entity_1.PaymentFrequency.QUINCENAL:
                const currentDay = startDate.getDate();
                if (currentDay < 15) {
                    return (0, date_fns_1.setDate)(startDate, 15);
                }
                else {
                    return (0, date_fns_1.endOfMonth)(startDate);
                }
            case contract_entity_1.PaymentFrequency.MENSUAL:
                const nextMonth = (0, date_fns_1.addMonths)(startDate, 1);
                const targetDay = startDate.getDate();
                const lastDayOfNextMonth = (0, date_fns_1.endOfMonth)(nextMonth).getDate();
                if (targetDay > lastDayOfNextMonth) {
                    return (0, date_fns_1.endOfMonth)(nextMonth);
                }
                return (0, date_fns_1.setDate)(nextMonth, targetDay);
            default:
                return (0, date_fns_1.addMonths)(startDate, 1);
        }
    }
    async findByContract(contractId) {
        return this.scheduleRepository.find({
            where: { contractId },
            order: { numeroCuota: 'ASC' },
        });
    }
    async findById(id) {
        return this.scheduleRepository.findOne({ where: { id } });
    }
    async updateScheduleStatus(id, montoPagado) {
        const schedule = await this.findById(id);
        if (!schedule) {
            throw new common_1.BadRequestException('Cuota no encontrada');
        }
        schedule.montoPagado = (parseFloat(schedule.montoPagado.toString()) || 0) + montoPagado;
        schedule.saldo = parseFloat(schedule.total.toString()) - schedule.montoPagado;
        if (schedule.saldo <= 0) {
            schedule.saldo = 0;
            schedule.estado = payment_schedule_entity_1.ScheduleStatus.PAGADA;
        }
        return this.scheduleRepository.save(schedule);
    }
    async updateOverdueStatus() {
        const today = (0, date_fns_1.startOfDay)(new Date());
        await this.scheduleRepository
            .createQueryBuilder()
            .update(payment_schedule_entity_1.PaymentSchedule)
            .set({ estado: payment_schedule_entity_1.ScheduleStatus.VENCIDA })
            .where('estado = :estado', { estado: payment_schedule_entity_1.ScheduleStatus.PENDIENTE })
            .andWhere('fechaVencimiento < :today', { today })
            .execute();
    }
    async getOverdueByContract(contractId) {
        const today = (0, date_fns_1.startOfDay)(new Date());
        return this.scheduleRepository
            .createQueryBuilder('schedule')
            .where('schedule.contractId = :contractId', { contractId })
            .andWhere('schedule.estado != :paid', { paid: payment_schedule_entity_1.ScheduleStatus.PAGADA })
            .andWhere('schedule.fechaVencimiento < :today', { today })
            .orderBy('schedule.fechaVencimiento', 'ASC')
            .getMany();
    }
    async getNextPending(contractId) {
        return this.scheduleRepository.findOne({
            where: {
                contractId,
                estado: payment_schedule_entity_1.ScheduleStatus.PENDIENTE
            },
            order: { numeroCuota: 'ASC' },
        });
    }
};
exports.PaymentSchedulesService = PaymentSchedulesService;
exports.PaymentSchedulesService = PaymentSchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_schedule_entity_1.PaymentSchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentSchedulesService);
//# sourceMappingURL=payment-schedules.service.js.map