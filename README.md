# BACKENDIICOMISION – API E-Commerce

## Descripción

Backend modular para una aplicación e-commerce, construido con Node.js, Express y MongoDB.
Permite gestionar productos, usuarios y órdenes de compra.
Incluye autenticación JWT y manejo de errores.

## Tecnologías utilizadas

• Node.js + Express
• MongoDB + Mongoose
• Passport JWT para autenticación
• dotenv para configuración de entorno
• Middlewares personalizados
• Helpers reutilizables
• Populate, paginación y validaciones blindadas

src/
├── config/ # Configuración de entorno y conexión DB
├── controllers/ # Lógica de manejo de requests
├── helpers/ # Funciones reutilizables
├── middlewares/ # Autenticación, validaciones, errores
├── models/ # Esquemas de MongoDB
├── routes/ # Definición de endpoints
├── utils/ # Utilidades adicionales
app.js # Punto de entrada principal
.env # Variables de entorno
package.json # Dependencias y scripts
README.md # Documentación del proyecto
.gitignore # Archivos y carpetas a ignorar por Git

## Autenticación

-   Estrategia JWT con Passport
-   Middleware authJwt enriquecido con mensajes personalizados
-   Endpoint /api/sessions/current para obtener usuario autenticado

Método

-   POST /api/sessions/login: Iniciar sesión y obtener token JWT
-   POST /api/sessions/register: Registrar nuevo usuario
-   GET /api/sessions/current: Obtener usuario autenticado (requiere token)

## Endpoints principales

En evolucion y trabajo en progreso...

Testeo

-   Postman
