<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Help Desk - Sistema de Gestión de Tickets

## 1. Descripción

Aplicación web para la gestión de tickets de soporte técnico. Permite registrar,
consultar, actualizar y eliminar tickets, así como realizar búsquedas, filtros
y ordenamiento.

La aplicación cuenta con autenticación de usuarios y control de acceso según
roles.

## 2. Tecnologías utilizadas

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Prisma ORM
- MySQL
- bcrypt

### Herramientas

- Git
- GitHub
- Postman

## 3. Instalación

### Requisitos

- Node.js 20.9 o superior (requerido por Next.js 16)
- MySQL
- npm

### Clonar el repositorio

```bash
git clone https://github.com/agoseguera/Sistema-de-Gestion-de-Tickets-.git
cd Sistema-de-Gestion-de-Tickets-
```

### Instalar dependencias

```bash
npm install
```

### Variables de entorno

Crear un archivo `.env`:

```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/helpdesk"
```

### Configurar la base de datos

Generar el cliente de Prisma:

```bash
npx prisma generate
```

Ejecutar las migraciones de Prisma:

```bash
npx prisma migrate dev
```

Importar la base de datos con datos de prueba:

```bash
mysql -u root -p helpdesk < database/helpdesk.sql
```

### Ejecutar el proyecto

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:3000
```

### Comandos adicionales

```bash
npm run lint   # Verificación de tipos con TypeScript
npm run build  # Build de producción
```

## 4. Usuarios de prueba

La base de datos de prueba (`database/helpdesk.sql`) incluye los siguientes
usuarios, todos con la contraseña `HelpDesk2026!`:

| Rol           | Email                          |
| ------------- | ------------------------------ |
| Administrador | carolina.ruiz@admin.com        |
| Soporte       | carlos.mendoza@soporte.com     |
| Solicitante   | maria.rodriguez@empresa.com    |

## 5. Roles

El sistema cuenta con tres roles de acceso:

- **Solicitante**: crea y consulta sus propios tickets.
- **Soporte**: gestiona tickets, asigna responsables y responde comentarios.
- **Administrador**: acceso total, incluye gestión de usuarios y eliminación
  de tickets.

## 6. Arquitectura

El proyecto utiliza una arquitectura basada en Next.js, separando la interfaz
de usuario, las rutas de la API y la capa de acceso a datos.

```
Frontend  →  API REST  →  Prisma ORM  →  MySQL
```

### Principales módulos

- Autenticación
- Usuarios
- Tickets
- Categorías
- Comentarios
- Gestión de roles
- Búsqueda y filtros

## 7. Decisiones técnicas

- Se utilizó Next.js para integrar frontend y backend en un mismo proyecto.
- Prisma se utilizó como ORM para facilitar la interacción con MySQL.
- Las contraseñas se almacenan utilizando hash con bcrypt.
- Los tickets se relacionan con usuarios mediante `userId`, evitando depender
  de nombres o correos escritos manualmente.
- Los tickets nuevos se crean inicialmente con estado `Abierto`.
- Se implementaron validaciones para evitar estados inválidos.
- La eliminación de tickets está restringida según el rol del usuario.
- Se utilizaron respuestas HTTP apropiadas para manejar errores y operaciones
  exitosas.

## 8. Funcionalidades

- Inicio de sesión
- Gestión de usuarios
- Gestión de tickets
- Creación de tickets
- Edición de tickets
- Eliminación de tickets
- Búsqueda de tickets
- Filtrado por estado
- Filtrado por prioridad
- Ordenamiento por fecha
- Categorías
- Comentarios
- Control de acceso por roles

## 9. Capturas de pantalla

- Inicio de sesión
- Dashboard
- Gestión de tickets
- Crear ticket
- Gestión de usuarios

## 10. Pendientes

- Implementar paginación.
- Implementar exportación de tickets a CSV.
- Agregar pruebas unitarias.
- Implementar documentación Swagger.
- Configurar CI/CD.

## 11. Uso de Inteligencia Artificial

La documentación sobre el uso de herramientas de inteligencia artificial
durante el desarrollo se encuentra en:

```
AI_USAGE.md
```

