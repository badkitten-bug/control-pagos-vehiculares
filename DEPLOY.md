# Guía de Despliegue - Control de Pagos Vehiculares

## Información del Servidor

- **Proveedor**: Elastika VPS
- **Acceso**: VNC (noVNC en navegador)
- **Ubicación del proyecto**: `/opt/app`
- **Puerto**: Configurado en docker-compose.yml

---

## Despliegue Rápido

### 1. Conectarse al VPS
Acceder via VNC desde el panel de Elastika

### 2. Navegar al proyecto
```bash
cd /opt/app
```

### 3. Actualizar código y desplegar
```bash
git pull origin main
docker compose down
docker compose up --build -d
```

### 4. Verificar estado
```bash
docker compose ps
```

### 5. Ver logs (opcional)
```bash
# Ver todos los logs
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Solo frontend
docker compose logs -f frontend
```

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `docker compose ps` | Ver estado de contenedores |
| `docker compose logs -f` | Ver logs en tiempo real |
| `docker compose restart backend` | Reiniciar solo backend |
| `docker compose down` | Detener todos los contenedores |
| `docker compose up -d` | Iniciar sin reconstruir |
| `docker compose up --build -d` | Reconstruir e iniciar |

---

## Estructura de Contenedores

- `cpv-backend` - API NestJS (puerto interno 3001)
- `cpv-frontend` - React/Vite (puerto interno 80)
- `cpv-nginx` - Proxy reverso (puerto **8080** externo)

---

## Acceso a la Aplicación

**URL**: `http://TU-IP-VPS:8080`

> **Nota**: Este proyecto usa el puerto 8080 para evitar conflictos con otros proyectos (ej: ASITER usa puerto 80).

---

## Múltiples Proyectos en el VPS

| Proyecto | Ubicación | Puerto |
|----------|-----------|--------|
| ASITER | `/home/asiter` | 80, 3002 |
| Control Pagos Vehiculares | `/opt/control-pagos-vehiculares` | 8080 |

---

## Solución de Problemas

### Error de permisos
```bash
sudo chown -R root:root /opt/app
```

### Limpiar imágenes antiguas
```bash
docker system prune -a
```

### Ver uso de disco
```bash
docker system df
```
