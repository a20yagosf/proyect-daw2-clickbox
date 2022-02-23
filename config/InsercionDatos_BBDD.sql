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
    ("COMPETITIVO"),
    ("ESTRATEGIA"),
    ("DECK BUILDING"),
    ("DUNGEON CRAWLER"),
    ("COOPERATIVO"),
    ("TABLERO"),
    ("ABSTRACTO"),
    ("DADOS"),
    ("FAMILIAR"), 
    ("FANTASÍA"),
    ("ROL"),
    ("AVENTURA"),
    ("CIFI"),
    ("CARTAS"),
    ("LÓGICA"),
    ("CASUAL"),
    ("TERROR")


-- Creamos tematicas