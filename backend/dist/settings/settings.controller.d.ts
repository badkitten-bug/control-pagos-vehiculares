import type { Response } from 'express';
import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getAll(): Promise<Record<string, string>>;
    getCompanyInfo(): Promise<{
        nombre: string;
        ruc: string;
        direccion: string;
        telefono: string;
        email: string;
        logo: string;
        reciboMensaje: string;
    }>;
    setMultiple(data: Record<string, string>): Promise<{
        message: string;
    }>;
    uploadLogo(file: any): Promise<{
        error: string;
        message?: undefined;
        path?: undefined;
    } | {
        message: string;
        path: string;
        error?: undefined;
    }>;
    getUploadedFile(filename: string, res: Response): void | Response<any, Record<string, any>>;
}
