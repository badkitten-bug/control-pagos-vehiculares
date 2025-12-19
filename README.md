# Sistema de Control de Pagos Vehiculares

## 📋 ¿Qué Hace el Sistema?

Sistema web para gestionar la venta de vehículos a crédito con control de pagos por cuotas.

---

## 🚗 Módulos Principales

### 1. Gestión de Vehículos
- Registrar vehículos (placa, marca, modelo, año, color, kilometraje)
- Estados: **Disponible**, **Vendido**, **Inactivo**
- Historial de kilometraje

### 2. Contratos de Venta
- Crear contratos con precio, pago inicial y cuotas
- Frecuencias: **Diario**, **Semanal**, **Quincenal**, **Mensual**
- **Comisión %** configurable
- Estados: Borrador → Vigente → Cancelado/Anulado
- Generación automática del cronograma de pagos

### 3. Cronograma de Pagos
- División automática del monto (precio - inicial) entre cuotas
- Aplicación de comisión a cada cuota
- Estados por cuota: Pendiente, Pagada, Vencida

### 4. Registro de Pagos (Caja)
- Tipos: Pago Inicial, Cuota, Abono
- Medios: Efectivo, Transferencia, Yape, Plin, Tarjeta
- Registro de operación y voucher

### 5. Reportes
| Reporte | Descripción |
|---------|-------------|
| **Atrasos** | Contratos con cuotas vencidas, monto y días de atraso |
| **Semáforo** | Estado visual de pagos (🟢🟡🔴) |
| **Búsqueda Rápida** | Consulta por placa con deuda y próxima cuota |

### 6. Autenticación
- Login/Registro de usuarios
- Roles: Admin, Usuario
- JWT para sesión segura

---

## 🏗️ Arquitectura Técnica

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   Base Datos    │
│   React + Vite  │     │   NestJS        │     │   SQLite        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 💡 Mejoras Sugeridas

### Corto Plazo (Fáciles)
- [ ] **Notificaciones WhatsApp** - Recordatorios de cuotas
- [ ] **Exportar semáforo a Excel/PDF**
- [ ] **Historial de precios** por vehículo
- [ ] **Dashboard mejorado** con gráficos de cobranza

### Mediano Plazo
- [ ] **App móvil** para cobradores en campo
- [ ] **Fotos del vehículo** en el registro
- [ ] **Cálculo de mora/intereses** por atraso
- [ ] **Recibos PDF** automáticos al registrar pago
- [ ] **Agenda de cobranza** por día

### Largo Plazo
- [ ] **Multi-usuarios** con permisos granulares
- [ ] **Reportes avanzados** (proyecciones, análisis)
- [ ] **Integración contable**
- [ ] **GPS tracking** de vehículos vendidos

---

## 📁 Estructura de Archivos

```
control-pagos-vehiculares/
├── backend/           # API NestJS
│   └── src/
│       ├── auth/      # Autenticación JWT
│       ├── vehicles/  # CRUD vehículos
│       ├── contracts/ # Contratos
│       ├── payments/  # Registro de pagos
│       └── reports/   # Reportes
└── frontend/          # UI React + Vite
    └── src/
        ├── components/  # UI reutilizable
        ├── pages/       # Vistas principales
        └── services/    # Llamadas API
```

---

## 🚀 Comandos Rápidos

```bash
# Desarrollo
cd backend && npm run start:dev
cd frontend && npm run dev

# Docker (producción)
docker-compose up -d
```
