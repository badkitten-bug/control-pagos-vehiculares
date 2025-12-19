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
exports.Contract = exports.PaymentFrequency = exports.ContractStatus = void 0;
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = require("../vehicles/vehicle.entity");
const payment_schedule_entity_1 = require("../payment-schedules/payment-schedule.entity");
const payment_entity_1 = require("../payments/payment.entity");
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["BORRADOR"] = "Borrador";
    ContractStatus["VIGENTE"] = "Vigente";
    ContractStatus["CANCELADO"] = "Cancelado";
    ContractStatus["ANULADO"] = "Anulado";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
var PaymentFrequency;
(function (PaymentFrequency) {
    PaymentFrequency["DIARIO"] = "Diario";
    PaymentFrequency["SEMANAL"] = "Semanal";
    PaymentFrequency["QUINCENAL"] = "Quincenal";
    PaymentFrequency["MENSUAL"] = "Mensual";
})(PaymentFrequency || (exports.PaymentFrequency = PaymentFrequency = {}));
let Contract = class Contract {
    id;
    vehicleId;
    vehicle;
    fechaInicio;
    precio;
    pagoInicial;
    numeroCuotas;
    frecuencia;
    estado;
    clienteNombre;
    clienteDni;
    clienteTelefono;
    clienteDireccion;
    observaciones;
    pagoInicialRegistrado;
    cronograma;
    pagos;
    createdAt;
    updatedAt;
};
exports.Contract = Contract;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Contract.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Contract.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle),
    (0, typeorm_1.JoinColumn)({ name: 'vehicleId' }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], Contract.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Contract.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Contract.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Contract.prototype, "pagoInicial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Contract.prototype, "numeroCuotas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Contract.prototype, "frecuencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: ContractStatus.BORRADOR }),
    __metadata("design:type", String)
], Contract.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "clienteNombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "clienteDni", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "clienteTelefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "clienteDireccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Contract.prototype, "pagoInicialRegistrado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_schedule_entity_1.PaymentSchedule, (schedule) => schedule.contract),
    __metadata("design:type", Array)
], Contract.prototype, "cronograma", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.contract),
    __metadata("design:type", Array)
], Contract.prototype, "pagos", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Contract.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Contract.prototype, "updatedAt", void 0);
exports.Contract = Contract = __decorate([
    (0, typeorm_1.Entity)('contracts')
], Contract);
//# sourceMappingURL=contract.entity.js.map