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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const contracts_service_1 = require("../contracts/contracts.service");
const payment_schedules_service_1 = require("../payment-schedules/payment-schedules.service");
let PaymentsService = class PaymentsService {
    paymentRepository;
    contractsService;
    schedulesService;
    constructor(paymentRepository, contractsService, schedulesService) {
        this.paymentRepository = paymentRepository;
        this.contractsService = contractsService;
        this.schedulesService = schedulesService;
    }
    async create(dto, user) {
        const contract = await this.contractsService.findById(dto.contractId);
        const payment = this.paymentRepository.create({
            ...dto,
            usuarioId: user.id,
            usuarioNombre: `${user.nombre} ${user.apellido || ''}`.trim(),
        });
        const savedPayment = await this.paymentRepository.save(payment);
        if (dto.tipo === payment_entity_1.PaymentType.PAGO_INICIAL) {
            await this.contractsService.markInitialPaymentRegistered(dto.contractId);
        }
        if (dto.scheduleId) {
            await this.schedulesService.updateScheduleStatus(dto.scheduleId, dto.importe);
        }
        return savedPayment;
    }
    async findAll(dto) {
        const { page = 1, limit = 10, contractId, fechaDesde, fechaHasta } = dto;
        const queryBuilder = this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.contract', 'contract')
            .leftJoinAndSelect('contract.vehicle', 'vehicle')
            .orderBy('payment.createdAt', 'DESC');
        if (contractId) {
            queryBuilder.andWhere('payment.contractId = :contractId', { contractId });
        }
        if (fechaDesde) {
            queryBuilder.andWhere('payment.fechaPago >= :fechaDesde', { fechaDesde });
        }
        if (fechaHasta) {
            queryBuilder.andWhere('payment.fechaPago <= :fechaHasta', { fechaHasta });
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
    async findByContract(contractId) {
        return this.paymentRepository.find({
            where: { contractId },
            order: { createdAt: 'DESC' },
        });
    }
    async getTotalByContract(contractId) {
        const result = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.importe)', 'total')
            .where('payment.contractId = :contractId', { contractId })
            .getRawOne();
        return parseFloat(result?.total || 0);
    }
    async getLastPayment(contractId) {
        return this.paymentRepository.findOne({
            where: { contractId },
            order: { fechaPago: 'DESC' },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        contracts_service_1.ContractsService,
        payment_schedules_service_1.PaymentSchedulesService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map