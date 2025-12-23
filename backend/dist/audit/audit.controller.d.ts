import { AuditService } from './audit.service';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
    getRecent(limit?: number): Promise<import("./audit-log.entity").AuditLog[]>;
    getByEntity(entidad: string, id: number): Promise<import("./audit-log.entity").AuditLog[]>;
    getByUser(userId: number, limit?: number): Promise<import("./audit-log.entity").AuditLog[]>;
}
