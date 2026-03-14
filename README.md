# Aplicacion-de-Gestion-de-Tareas-Personales
Software desarrollado con lineamientos SCRUM
# Objetivo del Sistema

Desarrollar un prototipo funcional de una aplicacion web, con gestion de tareas personales aplicado a un marco de trabajo de SCRUM 

# Integrantes y roles

Product Owner. 

* Yeniffer Nayeli Zepeda Ramírez

Scrum Master. 

* Marvin Osvaldo Zepeda Quevedo

Equipo de Desarrollo. 
* José Gerardo González Marroquín 
* Jasmine Ruano Sandoval 
* Zurisdai Alberto Eliasfi Parada Ramirez

# Stack Tecnológico

Frontend 

* React 18 + Vite + TypeScript 

* Manejo de formularios: React Hook Form (o equivalente) 

* Validación: Zod (o equivalente) 

* Estilos: TailwindCSS o Material UI

Backend 

*	NestJS + TypeScript 

*	API: REST 

*	Documentación de API: Swagger (OpenAPI) 

*	Validación de entrada: DTOs + class-validator 

Base de datos 

*	PostgreSQL (relacional) 

*	ORM: Prisma (recomendado) o TypeORM 


# Instrucciones de Ejecución
# --------- Para frontend ejecute desde la raiz en la terminal--------------
* cd frontend

* npm install

* npm run dev

# ---------- para backend ejecute desde la terminal -------------------
* cd backend

* nmp ci

* Set-Content -Path .env -Value 'DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/gestion_tareas_db?schema=public"'

* npx prisma generate

* npx prisma db pull

* npx prisma generate

* npm start:dev

Asegurece de tener instalado PostgreSQL, descarge el script, cree una base de datos llamada Gestion_de_TareaBD y ejecute el script dentro de ella.

