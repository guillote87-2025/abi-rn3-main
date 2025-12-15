CREATE DATABASE futbolreact;
USE futbolreact;

-- Tabla de usuarios (maneja autenticación)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    isGoogleUser BOOLEAN DEFAULT FALSE,
    tipo TINYINT DEFAULT 0 COMMENT '0=espectador, 1=jugador, 2=director, 3=admin',
    id_tabla INT COMMENT 'ID en la tabla jugadores o directores según tipo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de directores técnicos
CREATE TABLE directores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    victorias INT DEFAULT 0,
    imagen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    director INT,
    escudo VARCHAR(255),
    goles INT DEFAULT 0,
    victorias INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (director) REFERENCES directores(id) ON DELETE SET NULL
);

-- Tabla de jugadores
CREATE TABLE jugadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    posicion VARCHAR(50) NOT NULL,
    equipo INT,
    imagen VARCHAR(255),
    goles INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo) REFERENCES equipos(id) ON DELETE SET NULL
);

-- Tabla de partidos
CREATE TABLE partidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipo1 INT NOT NULL,
    equipo2 INT NOT NULL,
    goles1 INT DEFAULT 0,
    goles2 INT DEFAULT 0,
    terminado BOOLEAN DEFAULT FALSE,
    fecha DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo1) REFERENCES equipos(id) ON DELETE CASCADE,
    FOREIGN KEY (equipo2) REFERENCES equipos(id) ON DELETE CASCADE
);

-- Índices para mejorar performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_jugadores_equipo ON jugadores(equipo);
CREATE INDEX idx_equipos_director ON equipos(director);
CREATE INDEX idx_partidos_fecha ON partidos(fecha);

-- DATOS FALSOS

-- Limpiar tablas existentes
DELETE FROM partidos;
DELETE FROM jugadores;
DELETE FROM equipos;
DELETE FROM directores;
DELETE FROM usuarios;

-- Resetear auto_increment
ALTER TABLE partidos AUTO_INCREMENT = 1;
ALTER TABLE jugadores AUTO_INCREMENT = 1;
ALTER TABLE equipos AUTO_INCREMENT = 1;
ALTER TABLE directores AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;

-- Insertar Directores Técnicos
INSERT INTO directores (nombre, apellido, victorias, imagen) VALUES
('Pep', 'Guardiola', 45, '/uploads/director1.jpg'),
('Carlo', 'Ancelotti', 38, '/uploads/director2.jpg'),
('Jurgen', 'Klopp', 32, '/uploads/director3.jpg'),
('Diego', 'Simeone', 28, '/uploads/director4.jpg'),
('Zinedine', 'Zidane', 25, '/uploads/director5.jpg');

-- Insertar Equipos
INSERT INTO equipos (nombre, director, escudo, goles, victorias) VALUES
('Barcelona FC', 1, '/uploads/escudo1.jpg', 85, 22),
('Real Madrid', 2, '/uploads/escudo2.jpg', 92, 24),
('Liverpool FC', 3, '/uploads/escudo3.jpg', 78, 20),
('Atlético Madrid', 4, '/uploads/escudo4.jpg', 65, 18),
('Manchester City', 5, '/uploads/escudo5.jpg', 98, 26);

-- Insertar Jugadores
INSERT INTO jugadores (nombre, apellido, posicion, imagen, goles, equipo) VALUES
-- Barcelona
('Lionel', 'Messi', 'Delantero', '/uploads/jugador1.jpg', 42, 1),
('Andrés', 'Iniesta', 'Mediocampista', '/uploads/jugador2.jpg', 8, 1),
('Gerard', 'Piqué', 'Defensor', '/uploads/jugador3.jpg', 5, 1),
('Sergio', 'Busquets', 'Mediocampista', '/uploads/jugador4.jpg', 3, 1),
('Marc-André', 'ter Stegen', 'Portero', '/uploads/jugador5.jpg', 0, 1),

-- Real Madrid
('Cristiano', 'Ronaldo', 'Delantero', '/uploads/jugador6.jpg', 48, 2),
('Luka', 'Modrić', 'Mediocampista', '/uploads/jugador7.jpg', 6, 2),
('Sergio', 'Ramos', 'Defensor', '/uploads/jugador8.jpg', 11, 2),
('Toni', 'Kroos', 'Mediocampista', '/uploads/jugador9.jpg', 4, 2),
('Thibaut', 'Courtois', 'Portero', '/uploads/jugador10.jpg', 0, 2),

-- Liverpool
('Mohamed', 'Salah', 'Delantero', '/uploads/jugador11.jpg', 35, 3),
('Sadio', 'Mané', 'Delantero', '/uploads/jugador12.jpg', 28, 3),
('Virgil', 'van Dijk', 'Defensor', '/uploads/jugador13.jpg', 7, 3),
('Jordan', 'Henderson', 'Mediocampista', '/uploads/jugador14.jpg', 5, 3),
('Alisson', 'Becker', 'Portero', '/uploads/jugador15.jpg', 0, 3),

-- Atlético Madrid
('Luis', 'Suárez', 'Delantero', '/uploads/jugador16.jpg', 30, 4),
('João', 'Félix', 'Delantero', '/uploads/jugador17.jpg', 18, 4),
('Koke', 'Resurrección', 'Mediocampista', '/uploads/jugador18.jpg', 6, 4),
('Stefan', 'Savić', 'Defensor', '/uploads/jugador19.jpg', 4, 4),
('Jan', 'Oblak', 'Portero', '/uploads/jugador20.jpg', 0, 4),

-- Manchester City
('Erling', 'Haaland', 'Delantero', '/uploads/jugador21.jpg', 52, 5),
('Kevin', 'De Bruyne', 'Mediocampista', '/uploads/jugador22.jpg', 15, 5),
('Phil', 'Foden', 'Mediocampista', '/uploads/jugador23.jpg', 12, 5),
('Rúben', 'Dias', 'Defensor', '/uploads/jugador24.jpg', 3, 5),
('Ederson', 'Moraes', 'Portero', '/uploads/jugador25.jpg', 0, 5);

-- Insertar Usuarios (contraseña: 123456 para todos)
-- Hash bcrypt de '123456': $2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO

INSERT INTO usuarios (email, password, isGoogleUser, tipo, id_tabla) VALUES
-- Directores
('guardiola@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 2, 1),
('ancelotti@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 2, 2),
('klopp@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 2, 3),
('simeone@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 2, 4),
('zidane@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 2, 5),

-- Jugadores
('messi@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 1, 1),
('ronaldo@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 1, 6),
('salah@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 1, 11),
('suarez@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 1, 16),
('haaland@mail.com', '$2b$10$rZ5qH8p3mKqYv7yH8p3mKOxQZ5qH8p3mKqYv7yH8p3mKO', 0, 1, 21);

-- Insertar Partidos
INSERT INTO partidos (equipo1, equipo2, goles1, goles2, terminado, fecha) VALUES
(1, 2, 2, 3, 1, '2024-01-15'),
(3, 4, 1, 1, 1, '2024-01-20'),
(5, 1, 4, 2, 1, '2024-01-25'),
(2, 3, 2, 0, 1, '2024-02-01'),
(4, 5, 1, 3, 1, '2024-02-05'),
(1, 3, 3, 3, 1, '2024-02-10'),
(2, 4, 2, 1, 0, '2024-12-15'),
(5, 3, 0, 0, 0, '2024-12-20');

-- Mensaje de confirmación
SELECT 'Base de datos llenada exitosamente!' AS mensaje;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_directores FROM directores;
SELECT COUNT(*) AS total_equipos FROM equipos;
SELECT COUNT(*) AS total_jugadores FROM jugadores;
SELECT COUNT(*) AS total_partidos FROM partidos;