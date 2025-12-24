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
exports.PaySubcontractScheduleDto = exports.SearchSubcontractsDto = exports.CreateSubcontractDto = void 0;
const class_validator_1 = require("class-validator");
const subcontract_entity_1 = require("../subcontract.entity");
class CreateSubcontractDto {
    parentContractId;
    tipo;
    modalidad;
    monto;
    numeroCuotas;
    frecuencia;
    fechaInicio;
    descripcion;
}
exports.CreateSubcontractDto = CreateSubcontractDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID del contrato padre es requerido' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSubcontractDto.prototype, "parentContractId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de subcontrato es requerido' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubcontractDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La modalidad es requerida' }),
    (0, class_validator_1.IsEnum)(subcontract_entity_1.SubcontractMode, { message: 'Modalidad inválida' }),
    __metadata("design:type", String)
], CreateSubcontractDto.prototype, "modalidad", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El monto es requerido' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'El monto debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateSubcontractDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'El número de cuotas debe ser al menos 1' }),
    __metadata("design:type", Number)
], CreateSubcontractDto.prototype, "numeroCuotas", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubcontractDto.prototype, "frecuencia", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de inicio es requerida' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSubcontractDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubcontractDto.prototype, "descripcion", void 0);
class SearchSubcontractsDto {
    parentContractId;
    page;
    limit;
}
exports.SearchSubcontractsDto = SearchSubcontractsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchSubcontractsDto.prototype, "parentContractId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchSubcontractsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchSubcontractsDto.prototype, "limit", void 0);
class PaySubcontractScheduleDto {
    monto;
    fechaPago;
    medioPago;
    numeroOperacion;
    notas;
}
exports.PaySubcontractScheduleDto = PaySubcontractScheduleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El monto es requerido' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'El monto debe ser mayor a 0' }),
    __metadata("design:type", Number)
], PaySubcontractScheduleDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de pago es requerida' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PaySubcontractScheduleDto.prototype, "fechaPago", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El medio de pago es requerido' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaySubcontractScheduleDto.prototype, "medioPago", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaySubcontractScheduleDto.prototype, "numeroOperacion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaySubcontractScheduleDto.prototype, "notas", void 0);
//# sourceMappingURL=subcontract.dto.js.map