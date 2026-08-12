# Uso de Inteligencia Artificial

## 1. Herramientas utilizadas

Durante el desarrollo del proyecto se utilizaron dos herramientas de
inteligencia artificial como apoyo:

- **Google AI Studio** (`https://aistudio.google.com`): para el diseño
  inicial de la aplicación.
- **ChatGPT**: como apoyo durante el desarrollo del proyecto.

## 2. Diseño inicial con AI Studio

La versión inicial de la aplicación fue generada en Google AI Studio,
la cual incluía:

- Interfaz de usuario con dashboard, sidebar, header y vistas de tickets.
- Modales para la creación, edición y detalle de tickets.
- Datos de prueba (mock) para visualizar el flujo de la aplicación.
- Definición de tipos y estructura de tickets.
- Gestión de estado en memoria (sin backend).

A partir de esa base se continuó con el desarrollo del proyecto.

## 3. Uso de ChatGPT durante el desarrollo

La inteligencia artificial se utilizó como apoyo para:

- Resolver dudas sobre Next.js, React y TypeScript.
- Consultar sobre Prisma y la integración con MySQL.
- Analizar la estructura de las API REST.
- Revisar validaciones y manejo de errores.
- Consultar sobre autenticación, roles y permisos.
- Obtener sugerencias para mejorar la experiencia de usuario.
- Revisar y mejorar mensajes de commits.
- Apoyar la elaboración de documentación.

La IA se utilizó como herramienta de apoyo y las soluciones fueron
revisadas y adaptadas al proyecto.

## 4. Desarrollo posterior al diseño inicial

Sobre la base generada en AI Studio se implementó el proyecto completo:

- Configuración de Prisma y esquema de base de datos MySQL.
- Implementación de las API REST de tickets y usuarios (listar, consultar por ID, crear, actualizar y eliminar).
- Reemplazo de los datos mock por integración real con la base de datos y limpieza de código no utilizado.
- Gestión de usuarios con vistas y modales.
- Hash de contraseñas con bcrypt.
- Login y autenticación de usuarios.
- Control de acceso por roles (Administrador, Soporte y Solicitante).
- Validaciones de creación y actualización de tickets.
- Restricción de eliminación de tickets según el rol del usuario.
- Elaboración de la documentación del proyecto.

## 5. Respuestas descartadas

Se descartaron respuestas o sugerencias cuando:

- No se ajustaban a los requisitos de la prueba.
- Agregaban complejidad innecesaria.
- Proponían una estructura diferente a la utilizada en el proyecto.
- No eran compatibles con las tecnologías o arquitectura seleccionadas.

## 6. Código modificado manualmente

El código generado o sugerido por la IA fue revisado y adaptado manualmente antes de incorporarlo al proyecto.

Entre las modificaciones realizadas se encuentran:

- Adaptación de endpoints a la estructura del proyecto.
- Ajuste de modelos y relaciones de Prisma.
- Implementación de validaciones específicas.
- Manejo de roles y permisos.
- Integración con las vistas existentes.
- Ajustes de estilos y componentes de la interfaz.
- Corrección de errores encontrados durante las pruebas.
