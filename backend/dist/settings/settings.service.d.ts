import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
export declare class SettingsService implements OnModuleInit {
    private settingRepository;
    constructor(settingRepository: Repository<Setting>);
    onModuleInit(): Promise<void>;
    get(clave: string): Promise<string | null>;
    set(clave: string, valor: string): Promise<Setting>;
    getAll(): Promise<Record<string, string>>;
    setMultiple(data: Record<string, string>): Promise<void>;
    getCompanyInfo(): Promise<{
        nombre: string;
        ruc: string;
        direccion: string;
        telefono: string;
        email: string;
        logo: string;
        reciboMensaje: string;
    }>;
}
