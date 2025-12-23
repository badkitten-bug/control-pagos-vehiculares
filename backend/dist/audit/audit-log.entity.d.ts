export declare enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export declare class AuditLog {
    id: number;
    entidad: string;
    entidadId: number;
    accion: AuditAction;
    usuarioId: number;
    usuarioNombre: string;
    datosAnteriores: string;
    datosNuevos: string;
    descripcion: string;
    createdAt: Date;
}
