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