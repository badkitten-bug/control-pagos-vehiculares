"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcontractsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const subcontract_entity_1 = require("./subcontract.entity");
const subcontracts_service_1 = require("./subcontracts.service");
const subcontracts_controller_1 = require("./subcontracts.controller");
const contracts_module_1 = require("../contracts/contracts.module");
const payment_schedules_module_1 = require("../payment-schedules/payment-schedules.module");
let SubcontractsModule = class SubcontractsModule {
};
exports.SubcontractsModule = SubcontractsModule;
exports.SubcontractsModule = SubcontractsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([subcontract_entity_1.Subcontract, subcontract_entity_1.SubcontractSchedule]),
            (0, common_1.forwardRef)(() => contracts_module_1.ContractsModule),
            (0, common_1.forwardRef)(() => payment_schedules_module_1.PaymentSchedulesModule),
        ],
        controllers: [subcontracts_controller_1.SubcontractsController],
        providers: [subcontracts_service_1.SubcontractsService],
        exports: [subcontracts_service_1.SubcontractsService],
    })
], SubcontractsModule);
//# sourceMappingURL=subcontracts.module.js.map