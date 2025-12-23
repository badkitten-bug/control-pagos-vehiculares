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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const setting_entity_1 = require("./setting.entity");
const DEFAULT_SETTINGS = [
    { clave: 'empresa_nombre', valor: 'Mi Empresa', tipo: 'string', descripcion: 'Nombre de la empresa' },
    { clave: 'empresa_ruc', valor: '', tipo: 'string', descripcion: 'RUC de la empresa' },
    { clave: 'empresa_direccion', valor: '', tipo: 'string', descripcion: 'Dirección de la empresa' },
    { clave: 'empresa_telefono', valor: '', tipo: 'string', descripcion: 'Teléfono de la empresa' },
    { clave: 'empresa_email', valor: '', tipo: 'string', descripcion: 'Email de la empresa' },
    { clave: 'empresa_logo', valor: '', tipo: 'string', descripcion: 'Ruta del logo de la empresa' },
    { clave: 'recibo_mensaje', valor: 'Gracias por su pago', tipo: 'string', descripcion: 'Mensaje en el recibo' },
];
let SettingsService = class SettingsService {
    settingRepository;
    constructor(settingRepository) {
        this.settingRepository = settingRepository;
    }
    async onModuleInit() {
        for (const setting of DEFAULT_SETTINGS) {
            const exists = await this.settingRepository.findOne({ where: { clave: setting.clave } });
            if (!exists) {
                await this.settingRepository.save(setting);
            }
        }
    }
    async get(clave) {
        const setting = await this.settingRepository.findOne({ where: { clave } });
        return setting?.valor || null;
    }
    async set(clave, valor) {
        let setting = await this.settingRepository.findOne({ where: { clave } });
        if (setting) {
            setting.valor = valor;
        }
        else {
            setting = this.settingRepository.create({ clave, valor });
        }
        return this.settingRepository.save(setting);
    }
    async getAll() {
        const settings = await this.settingRepository.find();
        const result = {};
        for (const setting of settings) {
            result[setting.clave] = setting.valor || '';
        }
        return result;
    }
    async setMultiple(data) {
        for (const [clave, valor] of Object.entries(data)) {
            await this.set(clave, valor);
        }
    }
    async getCompanyInfo() {
        const settings = await this.getAll();
        return {
            nombre: settings['empresa_nombre'] || '',
            ruc: settings['empresa_ruc'] || '',
            direccion: settings['empresa_direccion'] || '',
            telefono: settings['empresa_telefono'] || '',
            email: settings['empresa_email'] || '',
            logo: settings['empresa_logo'] || '',
            reciboMensaje: settings['recibo_mensaje'] || '',
        };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map