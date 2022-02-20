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
INSERT INTO generos
	(NOMBRE_GENERO)
		VALUES
	("Estrategia"),
	("Acción"),
	("Rol"),
	("Terror"),
	("Fantasía"),
	("Infantil"),
	("Antigüedad");