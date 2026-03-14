CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL
);

CREATE TABLE tablero (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cliente_id INT NOT NULL,
    FOREIGN KEY (cliente_id) 
        REFERENCES cliente(id)
        ON DELETE CASCADE
);

CREATE TABLE columna (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    orden INT NOT NULL,
    tablero_id INT NOT NULL,
    FOREIGN KEY (tablero_id)
        REFERENCES tablero(id)
        ON DELETE CASCADE
);

CREATE TABLE tarea (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(50),
    fecha_limite DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    columna_id INT NOT NULL,
    FOREIGN KEY (columna_id)
        REFERENCES columna(id)
        ON DELETE CASCADE
);


--1. Crear el Cliente (Dueño de todo)
INSERT INTO "cliente" (id, nombre, email, contraseña) 
VALUES (1, 'Sujeto Prueba', 'sujeto@rueba.com', '123456');

-- 2. Crear el Tablero asociado al cliente 1
INSERT INTO "tablero" (id, nombre, cliente_id) 
VALUES (2, 'Proyecto Analisis de Sistemas', 1);

-- 3. Crear las Columnas asociadas al tablero 2
INSERT INTO "columna" (id, nombre, orden, tablero_id) VALUES 
(5, 'To Do', 1, 2),
(6, 'In Progress', 2, 2),
(7, 'Done', 3, 2);