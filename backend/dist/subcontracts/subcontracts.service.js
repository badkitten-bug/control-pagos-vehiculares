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
exports.SubcontractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subcontract_entity_1 = require("./subcontract.entity");
const contracts_service_1 = require("../contracts/contracts.service");
const payment_schedules_service_1 = require("../payment-schedules/payment-schedules.service");
const contract_entity_1 = require("../contracts/contract.entity");
const payment_schedule_entity_1 = require("../payment-schedules/payment-schedule.entity");
const date_fns_1 = require("date-fns");
let SubcontractsService = class SubcontractsService {
    subcontractRepository;
    scheduleRepository;
    contractsService;
    paymentSchedulesService;
    constructor(subcontractRepository, scheduleRepository, contractsService, paymentSchedulesService) {
        this.subcontractRepository = subcontractRepository;
        this.scheduleRepository = scheduleRepository;
        this.contractsService = contractsService;
        this.paymentSchedulesService = paymentSchedulesService;
    }
    async create(dto) {
        const parentContract = await this.contractsService.findById(dto.parentContractId);
        if (parentContract.estado !== contract_entity_1.ContractStatus.VIGENTE) {
            throw new common_1.BadRequestException('Solo se pueden agregar subcontratos a contratos vigentes');
        }
        if (dto.modalidad === subcontract_entity_1.SubcontractMode.INDEPENDIENTE) {
            if (!dto.numeroCuotas || dto.numeroCuotas <= 0) {
                throw new common_1.BadRequestException('Para subcontratos independientes se requiere el número de cuotas');
            }
            if (!dto.frecuencia) {
                throw new common_1.BadRequestException('Para subcontratos independientes se requiere la frecuencia');
            }
        }
        const subcontract = this.subcontractRepository.create({
            ...dto,
            estado: subcontract_entity_1.SubcontractStatus.VIGENTE,
        });
        const saved = await this.subcontractRepository.save(subcontract);
        if (dto.modalidad === subcontract_entity_1.SubcontractMode.INDEPENDIENTE) {
            await this.generateIndependentSchedule(saved);
        }
        else {
            await this.addToPendingSchedules(saved, parentContract);
        }
        return this.findById(saved.id);
    }
    async generateIndependentSchedule(subcontract) {
        const monto = parseFloat(subcontract.monto.toString());
        const numeroCuotas = subcontract.numeroCuotas;
        const cuotaBase = Math.floor((monto / numeroCuotas) * 100) / 100;
        const ajusteFinal = Math.round((monto - cuotaBase * (numeroCuotas - 1)) * 100) / 100;
        const schedules = [];
        let fechaActual = new Date(subcontract.fechaInicio);
        for (let i = 1; i <= numeroCuotas; i++) {
            const fechaVencimiento = this.calculateNextDate(fechaActual, subcontract.frecuencia, i);
            const montoCuota = i === numeroCuotas ? ajusteFinal : cuotaBase;
            const schedule = this.scheduleRepository.create({
                subcontractId: subcontract.id,
                numeroCuota: i,
                fechaVencimiento,
                monto: montoCuota,
                montoPagado: 0,
                saldo: montoCuota,
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
    async addToPendingSchedules(subcontract, parentContract) {
        const allSchedules = await this.paymentSchedulesService.findByContract(parentContract.id);
        const pendingSchedules = allSchedules.filter((s) => s.estado !== payment_schedule_entity_1.ScheduleStatus.PAGADA);
        if (pendingSchedules.length === 0) {
            throw new common_1.BadRequestException('No hay cuotas pendientes para agregar el monto');
        }
        const montoSubcontrato = parseFloat(subcontract.monto.toString());
        const montoExtraPorCuota = Math.round((montoSubcontrato / pendingSchedules.length) * 100) / 100;
        const totalDistribuido = montoExtraPorCuota * (pendingSchedules.length - 1);
        const montoUltimaCuota = Math.round((montoSubcontrato - totalDistribuido) * 100) / 100;
        for (let i = 0; i < pendingSchedules.length; i++) {
            const schedule = pendingSchedules[i];
            const montoExtra = i === pendingSchedules.length - 1 ? montoUltimaCuota : montoExtraPorCuota;
            const currentTotal = parseFloat(schedule.total.toString());
            const currentSaldo = parseFloat(schedule.saldo.toString());
            const currentMontoSubcontrato = parseFloat((schedule.montoSubcontrato || 0).toString());
            schedule.montoSubcontrato = currentMontoSubcontrato + montoExtra;
            schedule.total = Math.round((currentTotal + montoExtra) * 100) / 100;
            schedule.saldo = Math.round((currentSaldo + montoExtra) * 100) / 100;
            const existingIds = schedule.subcontractIds
                ? JSON.parse(schedule.subcontractIds)
                : [];
            existingIds.push(subcontract.id);
            schedule.subcontractIds = JSON.stringify(existingIds);
        }
        await this.paymentSchedulesService.saveSchedules(pendingSchedules);
    }
    async findById(id) {
        const subcontract = await this.subcontractRepository.findOne({
            where: { id },
            relations: ['parentContract', 'cronograma', 'parentContract.vehicle'],
        });
        if (!subcontract) {
            throw new common_1.NotFoundException('Subcontrato no encontrado');
        }
        return subcontract;
    }
    async findByContract(contractId) {
        return this.subcontractRepository.find({
            where: { parentContractId: contractId },
            relations: ['cronograma'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAll(dto) {
        const { page = 1, limit = 10, parentContractId } = dto;
        const queryBuilder = this.subcontractRepository
            .createQueryBuilder('subcontract')
            .leftJoinAndSelect('subcontract.parentContract', 'contract')
            .leftJoinAndSelect('contract.vehicle', 'vehicle')
            .leftJoinAndSelect('subcontract.cronograma', 'cronograma')
            .orderBy('subcontract.createdAt', 'DESC');
        if (parentContractId) {
            queryBuilder.andWhere('subcontract.parentContractId = :parentContractId', {
                parentContractId,
            });
        }
        const total = await queryBuilder.getCount();
        const items = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async annul(id) {
        const subcontract = await this.findById(id);
        if (subcontract.modalidad === subcontract_entity_1.SubcontractMode.INDEPENDIENTE) {
            const hasPayments = subcontract.cronograma?.some((s) => parseFloat(s.montoPagado?.toString() || '0') > 0);
            if (hasPayments) {
                throw new common_1.BadRequestException('No se puede anular un subcontrato con pagos registrados');
            }
        }
        subcontract.estado = subcontract_entity_1.SubcontractStatus.ANULADO;
        return this.subcontractRepository.save(subcontract);
    }
    async getScheduleById(scheduleId) {
        return this.scheduleRepository.findOne({
            where: { id: scheduleId },
            relations: ['subcontract'],
        });
    }
    async updateSchedulePayment(scheduleId, montoPagado) {
        const schedule = await this.getScheduleById(scheduleId);
        if (!schedule) {
            throw new common_1.NotFoundException('Cuota de subcontrato no encontrada');
        }
        const currentMontoPagado = parseFloat(schedule.montoPagado?.toString() || '0');
        const monto = parseFloat(schedule.monto.toString());
        schedule.montoPagado = currentMontoPagado + montoPagado;
        schedule.saldo = Math.round((monto - schedule.montoPagado) * 100) / 100;
        if (schedule.saldo <= 0) {
            schedule.saldo = 0;
            schedule.estado = payment_schedule_entity_1.ScheduleStatus.PAGADA;
        }
        return this.scheduleRepository.save(schedule);
    }
    async getPendingBalance(subcontractId) {
        const result = await this.scheduleRepository
            .createQueryBuilder('schedule')
            .select('SUM(schedule.saldo)', 'total')
            .where('schedule.subcontractId = :subcontractId', { subcontractId })
            .andWhere('schedule.estado != :paid', { paid: payment_schedule_entity_1.ScheduleStatus.PAGADA })
            .getRawOne();
        return parseFloat(result?.total || 0);
    }
};
exports.SubcontractsService = SubcontractsService;
exports.SubcontractsService = SubcontractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcontract_entity_1.Subcontract)),
    __param(1, (0, typeorm_1.InjectRepository)(subcontract_entity_1.SubcontractSchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        contracts_service_1.ContractsService,
        payment_schedules_service_1.PaymentSchedulesService])
], SubcontractsService);
//# sourceMappingURL=subcontracts.service.js.map