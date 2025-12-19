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
exports.PaymentSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const payment_schedules_service_1 = require("./payment-schedules.service");
let PaymentSchedulesController = class PaymentSchedulesController {
    schedulesService;
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
    }
    findByContract(contractId) {
        return this.schedulesService.findByContract(contractId);
    }
    getOverdue(contractId) {
        return this.schedulesService.getOverdueByContract(contractId);
    }
    getNextPending(contractId) {
        return this.schedulesService.getNextPending(contractId);
    }
    updateOverdueStatus() {
        return this.schedulesService.updateOverdueStatus();
    }
};
exports.PaymentSchedulesController = PaymentSchedulesController;
__decorate([
    (0, common_1.Get)('contract/:contractId'),
    __param(0, (0, common_1.Param)('contractId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaymentSchedulesController.prototype, "findByContract", null);
__decorate([
    (0, common_1.Get)('contract/:contractId/overdue'),
    __param(0, (0, common_1.Param)('contractId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaymentSchedulesController.prototype, "getOverdue", null);
__decorate([
    (0, common_1.Get)('contract/:contractId/next'),
    __param(0, (0, common_1.Param)('contractId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaymentSchedulesController.prototype, "getNextPending", null);
__decorate([
    (0, common_1.Post)('update-overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentSchedulesController.prototype, "updateOverdueStatus", null);
exports.PaymentSchedulesController = PaymentSchedulesController = __decorate([
    (0, common_1.Controller)('payment-schedules'),
    __metadata("design:paramtypes", [payment_schedules_service_1.PaymentSchedulesService])
], PaymentSchedulesController);
//# sourceMappingURL=payment-schedules.controller.js.map