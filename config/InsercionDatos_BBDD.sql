-- Ponemos que use esa BD 
USE proyecto_modular;

-- Creamos los roles
INSERT INTO roles 
	(NOMBRE_ROL, DESCRIPCION) 
		VALUES 
	("ADMIN", "USUARIOS CON PODER PARA AÑADIR Y/O MODIFICAR PRODUCTOS Y SERVICIOS"),
	("ESTANDAR", "USUARIO REGISTRADO"),
	("CONEXION", "USUARIO ANÓNIMO");
	
-- Creamos los tipos de géneros
	INSERT INTO GENEROS
    (NOMBRE_GENERO)
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
	("Losetas")
-- Creamos tematicas
