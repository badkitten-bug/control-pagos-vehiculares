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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const settings_service_1 = require("./settings.service");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getAll() {
        return this.settingsService.getAll();
    }
    getCompanyInfo() {
        return this.settingsService.getCompanyInfo();
    }
    async setMultiple(data) {
        await this.settingsService.setMultiple(data);
        return { message: 'Configuración guardada' };
    }
    async uploadLogo(file) {
        if (!file) {
            return { error: 'No se recibió archivo' };
        }
        const logoPath = `/uploads/${file.filename}`;
        await this.settingsService.set('empresa_logo', logoPath);
        return {
            message: 'Logo subido correctamente',
            path: logoPath,
        };
    }
    getUploadedFile(filename, res) {
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', filename);
        if ((0, fs_1.existsSync)(filePath)) {
            return res.sendFile(filePath);
        }
        return res.status(404).json({ error: 'Archivo no encontrado' });
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('company'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getCompanyInfo", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "setMultiple", null);
__decorate([
    (0, common_1.Post)('logo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now();
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `logo-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                callback(new Error('Solo se permiten imágenes'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.Get)('uploads/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getUploadedFile", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map