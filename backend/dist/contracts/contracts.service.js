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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_entity_1 = require("./contract.entity");
const vehicles_service_1 = require("../vehicles/vehicles.service");
const payment_schedules_service_1 = require("../payment-schedules/payment-schedules.service");
const vehicle_entity_1 = require("../vehicles/vehicle.entity");
let ContractsService = class ContractsService {
    contractRepository;
    vehiclesService;
    schedulesService;
    constructor(contractRepository, vehiclesService, schedulesService) {
        this.contractRepository = contractRepository;
        this.vehiclesService = vehiclesService;
        this.schedulesService = schedulesService;
    }
    async create(dto) {
        const vehicle = await this.vehiclesService.findById(dto.vehicleId);
        if (vehicle.estado !== vehicle_entity_1.VehicleStatus.DISPONIBLE) {
            throw new common_1.BadRequestException('Solo se puede crear contrato para vehículos disponibles');
        }
        if (dto.pagoInicial > dto.precio) {
            throw new common_1.BadRequestException('El pago inicial no puede ser mayor al precio');
        }
        if (dto.numeroCuotas <= 0) {
            throw new common_1.BadRequestException('El número de cuotas debe ser mayor a 0');
        }
        const contract = this.contractRepository.create({
            ...dto,
            estado: contract_entity_1.ContractStatus.BORRADOR,
        });
        const savedContract = await this.contractRepository.save(contract);
        await this.schedulesService.generateSchedule(savedContract);
        return this.findById(savedContract.id);
    }
    async findAll(dto) {
        const { page = 1, limit = 10, placa, estado, clienteNombre } = dto;
        const queryBuilder = this.contractRepository
            .createQueryBuilder('contract')
            .leftJoinAndSelect('contract.vehicle', 'vehicle')
            .orderBy('contract.createdAt', 'DESC');
        if (placa) {
            queryBuilder.andWhere('vehicle.placa LIKE :placa', {
                placa: `%${placa.toUpperCase()}%`,
            });
        }
        if (estado) {
            queryBuilder.andWhere('contract.estado = :estado', { estado });
        }
        if (clienteNombre) {
            queryBuilder.andWhere('contract.clienteNombre LIKE :nombre', {
                nombre: `%${clienteNombre}%`,
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
    async findById(id) {
        const contract = await this.contractRepository.findOne({
            where: { id },
            relations: ['vehicle', 'cronograma', 'pagos'],
        });
        if (!contract) {
            throw new common_1.NotFoundException('Contrato no encontrado');
        }
        return contract;
    }
    async findByVehicle(vehicleId) {
        return this.contractRepository.find({
            where: { vehicleId },
            relations: ['vehicle'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, dto) {
        const contract = await this.findById(id);
        if (contract.estado !== contract_entity_1.ContractStatus.BORRADOR) {
            throw new common_1.BadRequestException('Solo se pueden editar contratos en estado Borrador');
        }
        Object.assign(contract, dto);
        return this.contractRepository.save(contract);
    }
    async activate(id) {
        const contract = await this.findById(id);
        if (contract.estado !== contract_entity_1.ContractStatus.BORRADOR) {
            throw new common_1.BadRequestException('Solo se pueden activar contratos en estado Borrador');
        }
        if (!contract.pagoInicialRegistrado && contract.pagoInicial > 0) {
            throw new common_1.BadRequestException('Debe registrar el pago inicial antes de activar el contrato');
        }
        contract.estado = contract_entity_1.ContractStatus.VIGENTE;
        await this.vehiclesService.updateStatus(contract.vehicleId, vehicle_entity_1.VehicleStatus.VENDIDO);
        return this.contractRepository.save(contract);
    }
    async cancel(id) {
        const contract = await this.findById(id);
        if (contract.estado !== contract_entity_1.ContractStatus.VIGENTE) {
            throw new common_1.BadRequestException('Solo se pueden cancelar contratos vigentes');
        }
        contract.estado = contract_entity_1.ContractStatus.CANCELADO;
        return this.contractRepository.save(contract);
    }
    async annul(id) {
        const contract = await this.findById(id);
        contract.estado = contract_entity_1.ContractStatus.ANULADO;
        await this.vehiclesService.updateStatus(contract.vehicleId, vehicle_entity_1.VehicleStatus.DISPONIBLE);
        return this.contractRepository.save(contract);
    }
    async markInitialPaymentRegistered(id) {
        const contract = await this.findById(id);
        contract.pagoInicialRegistrado = true;
        return this.contractRepository.save(contract);
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        vehicles_service_1.VehiclesService,
        payment_schedules_service_1.PaymentSchedulesService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map