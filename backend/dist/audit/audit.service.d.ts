import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from './audit-log.entity';
export declare class AuditService {
    private auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    log(entidad: string, entidadId: number, accion: AuditAction, usuarioId: number, usuarioNombre: string, datosAnteriores?: any, datosNuevos?: any, descripcion?: string): Promise<AuditLog>;
    getByEntity(entidad: string, entidadId: number): Promise<AuditLog[]>;
    getRecent(limit?: number): Promise<AuditLog[]>;
    getByUser(usuarioId: number, limit?: number): Promise<AuditLog[]>;
}
