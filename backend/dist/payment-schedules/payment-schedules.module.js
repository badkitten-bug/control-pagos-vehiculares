"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payment_schedule_entity_1 = require("./payment-schedule.entity");
const payment_schedules_service_1 = require("./payment-schedules.service");
const payment_schedules_controller_1 = require("./payment-schedules.controller");
let PaymentSchedulesModule = class PaymentSchedulesModule {
};
exports.PaymentSchedulesModule = PaymentSchedulesModule;
exports.PaymentSchedulesModule = PaymentSchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([payment_schedule_entity_1.PaymentSchedule])],
        controllers: [payment_schedules_controller_1.PaymentSchedulesController],
        providers: [payment_schedules_service_1.PaymentSchedulesService],
        exports: [payment_schedules_service_1.PaymentSchedulesService],
    })
], PaymentSchedulesModule);
//# sourceMappingURL=payment-schedules.module.js.map