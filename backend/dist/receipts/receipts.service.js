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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("../settings/settings.service");
const pdfkit_1 = __importDefault(require("pdfkit"));
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
let ReceiptsService = class ReceiptsService {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async generateReceipt(payment, contract) {
        const company = await this.settingsService.getCompanyInfo();
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: 'A5', margin: 40 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(16).font('Helvetica-Bold')
                .text(company.nombre || 'Control de Pagos', { align: 'center' });
            if (company.ruc) {
                doc.fontSize(10).font('Helvetica')
                    .text(`RUC: ${company.ruc}`, { align: 'center' });
            }
            if (company.direccion) {
                doc.text(company.direccion, { align: 'center' });
            }
            if (company.telefono) {
                doc.text(`Tel: ${company.telefono}`, { align: 'center' });
            }
            doc.moveDown(2);
            doc.fontSize(14).font('Helvetica-Bold')
                .text('RECIBO DE PAGO', { align: 'center' });
            doc.fontSize(10).font('Helvetica')
                .text(`N° ${String(payment.id).padStart(6, '0')}`, { align: 'center' });
            doc.moveDown(2);
            doc.moveTo(40, doc.y).lineTo(360, doc.y).stroke();
            doc.moveDown();
            const leftCol = 40;
            const rightCol = 200;
            let y = doc.y;
            doc.font('Helvetica-Bold').text('Fecha:', leftCol, y);
            doc.font('Helvetica').text((0, date_fns_1.format)(new Date(payment.fechaPago), "dd 'de' MMMM 'de' yyyy", { locale: locale_1.es }), rightCol, y);
            y += 20;
            doc.font('Helvetica-Bold').text('Cliente:', leftCol, y);
            doc.font('Helvetica').text(contract.clienteNombre || '-', rightCol, y);
            y += 20;
            doc.font('Helvetica-Bold').text('DNI:', leftCol, y);
            doc.font('Helvetica').text(contract.clienteDni || '-', rightCol, y);
            y += 20;
            doc.font('Helvetica-Bold').text('Vehículo:', leftCol, y);
            doc.font('Helvetica').text(contract.vehicle
                ? `${contract.vehicle.placa} - ${contract.vehicle.marca} ${contract.vehicle.modelo}`
                : '-', rightCol, y);
            y += 20;
            doc.font('Helvetica-Bold').text('Contrato:', leftCol, y);
            doc.font('Helvetica').text(`#${contract.id}`, rightCol, y);
            y += 20;
            doc.font('Helvetica-Bold').text('Tipo de Pago:', leftCol, y);
            doc.font('Helvetica').text(payment.tipo, rightCol, y);
            y += 20;
            doc.font('Helvetica-Bold').text('Medio de Pago:', leftCol, y);
            doc.font('Helvetica').text(payment.medioPago, rightCol, y);
            if (payment.numeroOperacion) {
                y += 20;
                doc.font('Helvetica-Bold').text('N° Operación:', leftCol, y);
                doc.font('Helvetica').text(payment.numeroOperacion, rightCol, y);
            }
            doc.moveDown(2);
            doc.moveTo(40, doc.y).lineTo(360, doc.y).stroke();
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold')
                .text('IMPORTE: S/ ' + parseFloat(payment.importe.toString()).toFixed(2), { align: 'center' });
            doc.moveDown(2);
            if (company.reciboMensaje) {
                doc.fontSize(10).font('Helvetica')
                    .text(company.reciboMensaje, { align: 'center' });
            }
            doc.moveDown();
            doc.fontSize(8).text(`Generado el ${(0, date_fns_1.format)(new Date(), "dd/MM/yyyy 'a las' HH:mm")}`, { align: 'center' });
            doc.end();
        });
    }
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map