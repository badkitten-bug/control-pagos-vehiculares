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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchContractsDto = exports.ChangeContractStatusDto = exports.UpdateContractDto = exports.CreateContractDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contract_entity_1 = require("../contract.entity");
class CreateContractDto {
    vehicleId;
    fechaInicio;
    precio;
    pagoInicial;
    numeroCuotas;
    frecuencia;
    clienteNombre;
    clienteDni;
    clienteTelefono;
    clienteDireccion;
    observaciones;
    comisionPorcentaje;
    moraPorcentaje;
}
exports.CreateContractDto = CreateContractDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "vehicleId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "precio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "pagoInicial", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "numeroCuotas", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(contract_entity_1.PaymentFrequency, { message: 'Frecuencia inválida' }),
    __metadata("design:type", String)
], CreateContractDto.prototype, "frecuencia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "clienteNombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "clienteDni", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "clienteTelefono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "clienteDireccion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "observaciones", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "comisionPorcentaje", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "moraPorcentaje", void 0);
class UpdateContractDto {
    clienteNombre;
    clienteDni;
    clienteTelefono;
    clienteDireccion;
    observaciones;
}
exports.UpdateContractDto = UpdateContractDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "clienteNombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "clienteDni", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "clienteTelefono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "clienteDireccion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateContractDto.prototype, "observaciones", void 0);
class ChangeContractStatusDto {
    estado;
}
exports.ChangeContractStatusDto = ChangeContractStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(contract_entity_1.ContractStatus, { message: 'Estado inválido' }),
    __metadata("design:type", String)
], ChangeContractStatusDto.prototype, "estado", void 0);
class SearchContractsDto {
    placa;
    estado;
    clienteNombre;
    page = 1;
    limit = 10;
}
exports.SearchContractsDto = SearchContractsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchContractsDto.prototype, "placa", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contract_entity_1.ContractStatus),
    __metadata("design:type", String)
], SearchContractsDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchContractsDto.prototype, "clienteNombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value, 10) : 1),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchContractsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value, 10) : 10),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchContractsDto.prototype, "limit", void 0);
//# sourceMappingURL=contract.dto.js.map