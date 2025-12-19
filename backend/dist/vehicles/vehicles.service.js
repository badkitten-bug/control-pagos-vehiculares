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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./vehicle.entity");
const vehicle_mileage_entity_1 = require("./vehicle-mileage.entity");
let VehiclesService = class VehiclesService {
    vehicleRepository;
    mileageRepository;
    constructor(vehicleRepository, mileageRepository) {
        this.vehicleRepository = vehicleRepository;
        this.mileageRepository = mileageRepository;
    }
    async create(dto) {
        const existing = await this.vehicleRepository.findOne({
            where: { placa: dto.placa.toUpperCase() },
        });
        if (existing) {
            throw new common_1.ConflictException('Placa ya registrada');
        }
        const vehicle = this.vehicleRepository.create({
            ...dto,
            placa: dto.placa.toUpperCase(),
        });
        return this.vehicleRepository.save(vehicle);
    }
    async findAll(dto) {
        const { page = 1, limit = 10, placa, marca, modelo, anio, estado } = dto;
        const where = {};
        if (placa) {
            where.placa = (0, typeorm_2.Like)(`%${placa.toUpperCase()}%`);
        }
        if (marca) {
            where.marca = (0, typeorm_2.Like)(`%${marca}%`);
        }
        if (modelo) {
            where.modelo = (0, typeorm_2.Like)(`%${modelo}%`);
        }
        if (anio) {
            where.anio = anio;
        }
        if (estado) {
            where.estado = estado;
        }
        const [items, total] = await this.vehicleRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findByPlaca(placa) {
        const vehicle = await this.vehicleRepository.findOne({
            where: { placa: placa.toUpperCase() },
            relations: ['historialKilometraje'],
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehículo no encontrado');
        }
        return vehicle;
    }
    async findById(id) {
        const vehicle = await this.vehicleRepository.findOne({
            where: { id },
            relations: ['historialKilometraje'],
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehículo no encontrado');
        }
        return vehicle;
    }
    async update(id, dto) {
        const vehicle = await this.findById(id);
        Object.assign(vehicle, dto);
        return this.vehicleRepository.save(vehicle);
    }
    async updateMileage(id, dto, user) {
        const vehicle = await this.findById(id);
        if (dto.kilometraje < vehicle.kilometraje) {
            throw new common_1.BadRequestException('El nuevo kilometraje no puede ser menor al actual');
        }
        const mileageRecord = this.mileageRepository.create({
            vehicleId: vehicle.id,
            kilometrajeAnterior: vehicle.kilometraje,
            kilometrajeNuevo: dto.kilometraje,
            usuarioId: user.id,
            usuarioNombre: `${user.nombre} ${user.apellido || ''}`.trim(),
            observacion: dto.observacion,
        });
        await this.mileageRepository.save(mileageRecord);
        vehicle.kilometraje = dto.kilometraje;
        return this.vehicleRepository.save(vehicle);
    }
    async getMileageHistory(id) {
        return this.mileageRepository.find({
            where: { vehicleId: id },
            order: { fechaRegistro: 'DESC' },
        });
    }
    async findAvailable() {
        return this.vehicleRepository.find({
            where: { estado: vehicle_entity_1.VehicleStatus.DISPONIBLE },
            order: { placa: 'ASC' },
        });
    }
    async isAvailable(id) {
        const vehicle = await this.findById(id);
        return vehicle.estado === vehicle_entity_1.VehicleStatus.DISPONIBLE;
    }
    async updateStatus(id, status) {
        const vehicle = await this.findById(id);
        vehicle.estado = status;
        return this.vehicleRepository.save(vehicle);
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_mileage_entity_1.VehicleMileage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map