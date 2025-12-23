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
exports.PaymentSchedule = exports.ScheduleStatus = void 0;
const typeorm_1 = require("typeorm");
const contract_entity_1 = require("../contracts/contract.entity");
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["PENDIENTE"] = "Pendiente";
    ScheduleStatus["PAGADA"] = "Pagada";
    ScheduleStatus["VENCIDA"] = "Vencida";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
let PaymentSchedule = class PaymentSchedule {
    id;
    contractId;
    contract;
    numeroCuota;
    fechaVencimiento;
    capital;
    comision;
    total;
    montoPagado;
    saldo;
    estado;
    montoSubcontrato;
    subcontractIds;
    createdAt;
};
exports.PaymentSchedule = PaymentSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "contractId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contract_entity_1.Contract, (contract) => contract.cronograma),
    (0, typeorm_1.JoinColumn)({ name: 'contractId' }),
    __metadata("design:type", contract_entity_1.Contract)
], PaymentSchedule.prototype, "contract", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "numeroCuota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], PaymentSchedule.prototype, "fechaVencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "capital", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "comision", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "montoPagado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: ScheduleStatus.PENDIENTE }),
    __metadata("design:type", String)
], PaymentSchedule.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PaymentSchedule.prototype, "montoSubcontrato", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentSchedule.prototype, "subcontractIds", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PaymentSchedule.prototype, "createdAt", void 0);
exports.PaymentSchedule = PaymentSchedule = __decorate([
    (0, typeorm_1.Entity)('payment_schedules')
], PaymentSchedule);
//# sourceMappingURL=payment-schedule.entity.js.map