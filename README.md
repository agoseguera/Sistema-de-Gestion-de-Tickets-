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

- Node.js
- MySQL
- npm

### Clonar el repositorio
git clone [URL_DEL_REPOSITORIO](https://github.com/agoseguera/Sistema-de-Gestion-de-Tickets-.git)
cd Sistema-de-Gestion-de-Tickets

### Instalar dependencias:
   `npm install`
   
## Variables de entorno
Crear un archivo .env:

DATABASE_URL="mysql://usuario:contraseña@localhost:3306/helpdesk"

### Configurar la base de datos

Ejecutar las migraciones de Prisma:

npx prisma migrate dev

Cargar los datos de prueba:

npx prisma db seed
## Ejecutar el proyecto
npm run dev

La aplicación estará disponible en:

http://localhost:3000

## Arquitectura

El proyecto utiliza una arquitectura basada en Next.js, separando la interfaz
de usuario, las rutas de la API y la capa de acceso a datos.

Frontend - API REST - Prisma ORM - MySQL

### Principales módulos
Autenticación
Usuarios
Tickets
Categorías
Comentarios
Gestión de roles
Búsqueda y filtros

## Decisiones técnicas
Se utilizó Next.js para integrar frontend y backend en un mismo proyecto.
Prisma se utilizó como ORM para facilitar la interacción con MySQL.
Las contraseñas se almacenan utilizando hash con bcrypt.
Los tickets se relacionan con usuarios mediante userId, evitando depender de nombres o correos escritos manualmente.
Los tickets nuevos se crean inicialmente con estado Abierto.
Se implementaron validaciones para evitar estados inválidos.
La eliminación de tickets está restringida según el rol del usuario.
Se utilizaron respuestas HTTP apropiadas para manejar errores y operaciones exitosas.

## Funcionalidades
Inicio de sesión
Gestión de usuarios
Gestión de tickets
Creación de tickets
Edición de tickets
Eliminación de tickets
Búsqueda de tickets
Filtrado por estado
Filtrado por prioridad
Ordenamiento por fecha
Categorías
Comentarios
Control de acceso por roles

## Capturas de pantalla
Se encuentran en la Carpeta capturas

## Pendientes
 Docker
 Autenticacion JWT
 Implementar exportación de tickets a CSV.
 Agregar pruebas unitarias.
 Implementar documentación Swagger.
 Configurar CI/CD.

## Script SQL

El script de creación de la base de datos se encuentra en:

database/helpdesk.sql

## Uso de Inteligencia Artificial

La documentación sobre el uso de herramientas de inteligencia artificial
durante el desarrollo se encuentra en:

AI_USAGE.md

## Video de Demostracion

https://drive.google.com/drive/folders/1t5YbQu-ivkEoqe-j2P4_PNCAZPUjB4ET?usp=sharing 
