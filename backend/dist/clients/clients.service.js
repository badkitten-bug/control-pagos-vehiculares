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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_entity_1 = require("./client.entity");
let ClientsService = class ClientsService {
    clientRepository;
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async create(dto) {
        const existing = await this.clientRepository.findOne({ where: { dni: dto.dni } });
        if (existing) {
            throw new common_1.BadRequestException('Ya existe un cliente con este DNI');
        }
        const client = this.clientRepository.create(dto);
        return this.clientRepository.save(client);
    }
    async findAll(dto) {
        const queryBuilder = this.clientRepository.createQueryBuilder('client');
        if (dto?.search) {
            queryBuilder.where('(client.dni LIKE :search OR client.nombres LIKE :search OR client.apellidos LIKE :search OR client.telefono LIKE :search)', { search: `%${dto.search}%` });
        }
        if (dto?.activo !== undefined) {
            queryBuilder.andWhere('client.activo = :activo', { activo: dto.activo });
        }
        return queryBuilder.orderBy('client.apellidos', 'ASC').getMany();
    }
    async findById(id) {
        const client = await this.clientRepository.findOne({ where: { id } });
        if (!client) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        return client;
    }
    async findByDni(dni) {
        return this.clientRepository.findOne({ where: { dni } });
    }
    async update(id, dto) {
        const client = await this.findById(id);
        Object.assign(client, dto);
        return this.clientRepository.save(client);
    }
    async delete(id) {
        const client = await this.findById(id);
        client.activo = false;
        await this.clientRepository.save(client);
    }
    async getActiveClients() {
        return this.clientRepository.find({
            where: { activo: true },
            order: { apellidos: 'ASC' },
        });
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientsService);
//# sourceMappingURL=clients.service.js.map