CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL
);

CREATE TABLE tablero (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cliente_id INT NOT NULL REFERENCES cliente(id) ON DELETE CASCADE
);

CREATE TABLE columna (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    orden INT NOT NULL,
    tablero_id INT NOT NULL REFERENCES tablero(id) ON DELETE CASCADE
);

CREATE TABLE tarea (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(50),
    estado VARCHAR(50), 
    fecha_limite DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    columna_id INT NOT NULL REFERENCES columna(id) ON DELETE CASCADE
);


INSERT INTO cliente (id, nombre, email, contraseña) 
VALUES (1, 'Sujeto Prueba', 'sujeto@prueba.com', '123456');

INSERT INTO tablero (id, nombre, cliente_id) 
VALUES (2, 'Proyecto NestJS', 1);

INSERT INTO columna (id, nombre, orden, tablero_id) VALUES 
(5, 'To Do', 1, 2),
(6, 'In Progress', 2, 2),
(7, 'Done', 3, 2);