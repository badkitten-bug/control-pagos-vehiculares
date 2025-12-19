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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const contract_entity_1 = require("../contracts/contract.entity");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getArrearsReport(fechaDesde, fechaHasta, frecuencia, estado, placa) {
        return this.reportsService.getArrearsReport({
            fechaDesde,
            fechaHasta,
            frecuencia,
            estado,
            placa,
        });
    }
    async exportArrearsExcel(res, fechaDesde, fechaHasta, frecuencia, estado, placa) {
        const data = await this.reportsService.getArrearsReport({
            fechaDesde,
            fechaHasta,
            frecuencia,
            estado,
            placa,
        });
        const workbook = await this.reportsService.exportArrearsToExcel(data);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-atrasos-${new Date().toISOString().split('T')[0]}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    }
    async exportArrearsPdf(res, fechaDesde, fechaHasta, frecuencia, estado, placa) {
        const data = await this.reportsService.getArrearsReport({
            fechaDesde,
            fechaHasta,
            frecuencia,
            estado,
            placa,
        });
        const pdfBuffer = await this.reportsService.exportArrearsToPdf(data);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-atrasos-${new Date().toISOString().split('T')[0]}.pdf`);
        res.send(pdfBuffer);
    }
    async quickSearch(placa) {
        return this.reportsService.getQuickSearchByPlaca(placa);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('arrears'),
    __param(0, (0, common_1.Query)('fechaDesde')),
    __param(1, (0, common_1.Query)('fechaHasta')),
    __param(2, (0, common_1.Query)('frecuencia')),
    __param(3, (0, common_1.Query)('estado')),
    __param(4, (0, common_1.Query)('placa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getArrearsReport", null);
__decorate([
    (0, common_1.Get)('arrears/export/excel'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __param(3, (0, common_1.Query)('frecuencia')),
    __param(4, (0, common_1.Query)('estado')),
    __param(5, (0, common_1.Query)('placa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportArrearsExcel", null);
__decorate([
    (0, common_1.Get)('arrears/export/pdf'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __param(3, (0, common_1.Query)('frecuencia')),
    __param(4, (0, common_1.Query)('estado')),
    __param(5, (0, common_1.Query)('placa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportArrearsPdf", null);
__decorate([
    (0, common_1.Get)('quick-search/:placa'),
    __param(0, (0, common_1.Param)('placa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "quickSearch", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map