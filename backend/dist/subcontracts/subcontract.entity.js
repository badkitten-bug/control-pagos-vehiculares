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
exports.SubcontractSchedule = exports.Subcontract = exports.SubcontractStatus = exports.SubcontractMode = void 0;
const typeorm_1 = require("typeorm");
const contract_entity_1 = require("../contracts/contract.entity");
var SubcontractMode;
(function (SubcontractMode) {
    SubcontractMode["INDEPENDIENTE"] = "Independiente";
    SubcontractMode["AGREGAR_A_CUOTAS"] = "AgregarACuotas";
})(SubcontractMode || (exports.SubcontractMode = SubcontractMode = {}));
var SubcontractStatus;
(function (SubcontractStatus) {
    SubcontractStatus["VIGENTE"] = "Vigente";
    SubcontractStatus["CANCELADO"] = "Cancelado";
    SubcontractStatus["ANULADO"] = "Anulado";
})(SubcontractStatus || (exports.SubcontractStatus = SubcontractStatus = {}));
let Subcontract = class Subcontract {
    id;
    parentContractId;
    parentContract;
    tipo;
    modalidad;
    monto;
    numeroCuotas;
    frecuencia;
    fechaInicio;
    descripcion;
    estado;
    cronograma;
    createdAt;
    updatedAt;
};
exports.Subcontract = Subcontract;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Subcontract.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Subcontract.prototype, "parentContractId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contract_entity_1.Contract),
    (0, typeorm_1.JoinColumn)({ name: 'parentContractId' }),
    __metadata("design:type", contract_entity_1.Contract)
], Subcontract.prototype, "parentContract", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Subcontract.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Subcontract.prototype, "modalidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Subcontract.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Subcontract.prototype, "numeroCuotas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subcontract.prototype, "frecuencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Subcontract.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Subcontract.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: SubcontractStatus.VIGENTE }),
    __metadata("design:type", String)
], Subcontract.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubcontractSchedule, (schedule) => schedule.subcontract),
    __metadata("design:type", Array)
], Subcontract.prototype, "cronograma", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Subcontract.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Subcontract.prototype, "updatedAt", void 0);
exports.Subcontract = Subcontract = __decorate([
    (0, typeorm_1.Entity)('subcontracts')
], Subcontract);
let SubcontractSchedule = class SubcontractSchedule {
    id;
    subcontractId;
    subcontract;
    numeroCuota;
    fechaVencimiento;
    monto;
    montoPagado;
    saldo;
    estado;
    createdAt;
};
exports.SubcontractSchedule = SubcontractSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SubcontractSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SubcontractSchedule.prototype, "subcontractId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subcontract, (subcontract) => subcontract.cronograma),
    (0, typeorm_1.JoinColumn)({ name: 'subcontractId' }),
    __metadata("design:type", Subcontract)
], SubcontractSchedule.prototype, "subcontract", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], SubcontractSchedule.prototype, "numeroCuota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], SubcontractSchedule.prototype, "fechaVencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubcontractSchedule.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SubcontractSchedule.prototype, "montoPagado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubcontractSchedule.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'Pendiente' }),
    __metadata("design:type", String)
], SubcontractSchedule.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SubcontractSchedule.prototype, "createdAt", void 0);
exports.SubcontractSchedule = SubcontractSchedule = __decorate([
    (0, typeorm_1.Entity)('subcontract_schedules')
], SubcontractSchedule);
//# sourceMappingURL=subcontract.entity.js.map