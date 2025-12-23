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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const payment_dto_1 = require("./dto/payment.dto");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const user_entity_1 = require("../users/user.entity");
const receipts_service_1 = require("../receipts/receipts.service");
const contracts_service_1 = require("../contracts/contracts.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    receiptsService;
    contractsService;
    constructor(paymentsService, receiptsService, contractsService) {
        this.paymentsService = paymentsService;
        this.receiptsService = receiptsService;
        this.contractsService = contractsService;
    }
    create(dto, user) {
        return this.paymentsService.create(dto, user);
    }
    findAll(dto) {
        return this.paymentsService.findAll(dto);
    }
    findByContract(contractId) {
        return this.paymentsService.findByContract(contractId);
    }
    getTotalByContract(contractId) {
        return this.paymentsService.getTotalByContract(contractId);
    }
    getLastPayment(contractId) {
        return this.paymentsService.getLastPayment(contractId);
    }
    async getReceipt(id, res) {
        const payment = await this.paymentsService.findById(id);
        if (!payment) {
            throw new common_1.NotFoundException('Pago no encontrado');
        }
        const contract = await this.contractsService.findById(payment.contractId);
        const pdfBuffer = await this.receiptsService.generateReceipt(payment, contract);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=recibo-${payment.id}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.CreatePaymentDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.SearchPaymentsDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('contract/:contractId'),
    __param(0, (0, common_1.Param)('contractId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findByContract", null);
__decorate([
    (0, common_1.Get)('contract/:contractId/total'),
    __param(0, (0, common_1.Param)('contractId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getTotalByContract", null);
__decorate([
    (0, common_1.Get)('contract/:contractId/last'),
    __param(0, (0, common_1.Param)('contractId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getLastPayment", null);
__decorate([
    (0, common_1.Get)(':id/receipt'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getReceipt", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        receipts_service_1.ReceiptsService,
        contracts_service_1.ContractsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map