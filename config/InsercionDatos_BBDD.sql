-- Ponemos que use esa BD 
USE a2da_clickbox ;

-- Creamos los roles
INSERT INTO roles 
	(nombre_rol, descripcion) 
		VALUES 
	("a2da_admin", "USUARIOS CON PODER PARA AÑADIR Y/O MODIFICAR PRODUCTOS Y SERVICIOS"),
	("a2da_estandar", "USUARIO REGISTRADO"),
	("a2da_conexion", "USUARIO ANÓNIMO");
	
-- Creamos los tipos de géneros
	INSERT INTO generos
    (nombre_genero)
        VALUES
    ("Competitivo"),
    ("Estrategia"),
    ("Deck Building"),
    ("Dungeon Crawler"),
    ("Cooperativo"),
    ("Tablero"),
    ("Abstracto"),
    ("Dados"),
    ("Familiar"), 
    ("Fantasía"),
    ("Rol"),
    ("Aventura"),
    ("CIFI"),
    ("Cartas"),
    ("Lógica"),
    ("Casual"),
    ("Terror"),
	("Gestión"),
	("Educativo"),
	("Artístico"),
	("Contrarreloj"),
	("Sin turnos"),
	("Anime"),
	("Asimétrico"),
	("Losetas");
-- Creamos tematicas

-- Creamos unas suscripciones de base
INSERT INTO suscripciones
	(DURACION, PRECIO)
	VALUES
	(1, 20),
	(3, 17),
	(6, 14);