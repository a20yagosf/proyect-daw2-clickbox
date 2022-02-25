DROP DATABASE IF EXISTS PROYECTO_MODULAR;
CREATE DATABASE IF NOT EXISTS PROYECTO_MODULAR;
USE PROYECTO_MODULAR;

-- ---------------------------------------------------
--				TABLA TEMATICA
-- ---------------------------------------------------
DROP TABLE IF EXISTS TEMATICAS;
CREATE TABLE IF NOT EXISTS TEMATICAS (
	NOMBRE_TEMATICA VARCHAR(150) NOT NULL,
	-- KEYS Y CONSTRAINS 
	PRIMARY KEY (NOMBRE_TEMATICA)
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA GENERO
-- ---------------------------------------------------
DROP TABLE IF EXISTS GENEROS;
CREATE TABLE IF NOT EXISTS GENEROS (
	NOMBRE_GENERO VARCHAR(150) NOT NULL,
	-- KEY Y CONSTRAINS 
	PRIMARY KEY (NOMBRE_GENERO)
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA PRODUCTOS
-- ---------------------------------------------------
DROP TABLE IF EXISTS PRODUCTOS;
CREATE TABLE IF NOT EXISTS PRODUCTOS (
	ID_PRODUCTO INT UNSIGNED AUTO_INCREMENT NOT NULL,
   NOMBRE VARCHAR(125) NOT NULL,
   STOCK INT UNSIGNED NOT NULL,
   PRECIO FLOAT NOT NULL,
   NUM_JUG VARCHAR(4) NOT NULL,
   DESCRIPCION VARCHAR(255) NULL,
   IMAGEN_PRODUCTO	VARCHAR(255) NOT NULL,
   -- RELACIONES 
   TEMATICA VARCHAR(150) NULL,
   -- KEY Y CONSTRAINS 
   PRIMARY KEY (ID_PRODUCTO),
   UNIQUE INDEX AK_NOMBRE (NOMBRE), -- PODRÍAN EXISTIR DOS JUEGOS CON EL MISMO NOMBRE (???) 
   FOREIGN KEY (TEMATICA) REFERENCES TEMATICAS (NOMBRE_TEMATICA)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA JUEGO
-- ---------------------------------------------------
DROP TABLE IF EXISTS JUEGOS;
CREATE TABLE IF NOT EXISTS JUEGOS (
	JUEGO INT UNSIGNED NOT NULL,
	/** KEY Y CONSTRAINS **/
	PRIMARY KEY (JUEGO),
	FOREIGN KEY (JUEGO) REFERENCES PRODUCTOS (ID_PRODUCTO)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA ACCESORIO
-- ---------------------------------------------------
DROP TABLE IF EXISTS ACCESORIOS;
CREATE TABLE IF NOT EXISTS ACCESORIOS (
	ACCESORIO INT UNSIGNED NOT NULL,
	/** KEY Y CONSTRAINS **/
	PRIMARY KEY (ACCESORIO),
	FOREIGN KEY (ACCESORIO) REFERENCES PRODUCTOS (ID_PRODUCTO)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA PRODUCTO_GENERO
-- ---------------------------------------------------
DROP TABLE IF EXISTS PRODUCTOS_GENEROS;
CREATE TABLE IF NOT EXISTS PRODUCTOS_GENEROS (
	ID_PRODUCTO_GENERO INT UNSIGNED AUTO_INCREMENT NOT NULL,
	PRODUCTO INT UNSIGNED NOT NULL,
	GENERO VARCHAR(150) NOT NULL,
	-- KEYS Y CONSTRAINS 
	PRIMARY KEY (ID_PRODUCTO_GENERO),
	FOREIGN KEY (PRODUCTO) REFERENCES PRODUCTOS (ID_PRODUCTO)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (GENERO) REFERENCES GENEROS (NOMBRE_GENERO)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA SUSCRIPCION
-- ---------------------------------------------------
DROP TABLE IF EXISTS SUSCRIPCIONES;
CREATE TABLE IF NOT EXISTS SUSCRIPCIONES (
	DURACION TINYINT NOT NULL,
	-- KEYS Y CONSTRAINS
	PRIMARY KEY (DURACION)
) ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA ROlES
-- ---------------------------------------------------
DROP TABLE IF EXISTS ROLES;
CREATE TABLE IF NOT EXISTS ROLES (
	ID_ROL INT UNSIGNED NOT NULL AUTO_INCREMENT,
	NOMBRE_ROL VARCHAR(50) NOT NULL,
	DESCRIPCION VARCHAR(150) NULL,
    -- KEYS Y CONSTRAINS 
   PRIMARY KEY (ID_ROL)
)ENGINE = INNODB;
    

-- ---------------------------------------------------
--				TABLA USUARIO
-- ---------------------------------------------------
DROP TABLE IF EXISTS USUARIOS;
CREATE TABLE IF NOT EXISTS USUARIOS (
   EMAIL VARCHAR(150) NOT NULL,
   PWD VARCHAR(255) NOT NULL,
   NOMBRE VARCHAR(25) NOT NULL,
   APELLIDOS VARCHAR(100) NOT NULL,
   TELEFONO CHAR(11) NULL,
   FECHA_REGISTRO DATE NOT NULL,
   DIRECCION VARCHAR(150) NULL,
   FECHA_NAC DATE NOT NULL,
   FECHA_ULT_MODIF DATE NOT NULL,
   FECHA_ULT_ACCESO DATE NOT NULL,
   IMAGEN_PERFIL	VARCHAR(255) NOT NULL,
   -- GENERO_FAVORITO  ENUM("Detectives","Estrategia","Guerra","Miedo","Puzzles","Cooperativos", "Individual","Competitivo") NULL,
   -- RELACIONES 
   ROL INT UNSIGNED NOT NULL DEFAULT 3,
   GENERO_FAVORITO VARCHAR(150) NULL,
   SUSCRIPCION TINYINT NULL,
   RENOVAR BOOLEAN NULL,
   FECHA_INI_SUSCRIPCION DATE NULL,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (EMAIL),
   FOREIGN KEY (ROL) REFERENCES ROLES (ID_ROL)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE,
   FOREIGN KEY (GENERO_FAVORITO) REFERENCES GENEROS (NOMBRE_GENERO)
   	ON DELETE SET NULL
   	ON UPDATE CASCADE,
   FOREIGN KEY (SUSCRIPCION) REFERENCES SUSCRIPCIONES (DURACION)
   	ON DELETE SET NULL
   	ON UPDATE CASCADE
) ENGINE = INNODB;

    
-- ---------------------------------------------------
--				TABLA CARRITOS
-- ---------------------------------------------------
DROP TABLE IF EXISTS CARRITOS;
CREATE TABLE IF NOT EXISTS CARRITOS (
	ID_CARRITO INT UNSIGNED AUTO_INCREMENT NOT NULL,
	USUARIO_CARRITO VARCHAR(150) NOT NULL,
	-- KEYS Y CONSTRAINS 
	PRIMARY KEY (ID_CARRITO),
	FOREIGN KEY (USUARIO_CARRITO) REFERENCES USUARIOS (EMAIL)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA PRODUCTO_CARRITO
-- ---------------------------------------------------
DROP TABLE IF EXISTS PRODUCTOS_CARRITOS;
CREATE TABLE IF NOT EXISTS PRODUCTOS_CARRITOS (
	ID_PRODUCTO_CARRITO INT UNSIGNED AUTO_INCREMENT NOT NULL,
	CARRITO INT UNSIGNED NOT NULL,
	PRODUCTO INT UNSIGNED NOT NULL, 
	UNIDADES SMALLINT UNSIGNED NOT NULL,
	-- KEYS Y CONSTRAINS 
	PRIMARY KEY (ID_PRODUCTO_CARRITO),
	FOREIGN KEY (CARRITO) REFERENCES CARRITOS (ID_CARRITO)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (PRODUCTO) REFERENCES PRODUCTOS (ID_PRODUCTO)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA CAJAS_SORPRESA
-- ---------------------------------------------------
DROP TABLE IF EXISTS CAJAS_SORPRESA;
CREATE TABLE IF NOT EXISTS CAJAS_SORPRESA (
	ID_CAJA INT UNSIGNED AUTO_INCREMENT NOT NULL,
   NUM_JUG VARCHAR(4) NOT NULL,
   FECHA DATE NOT NULL,
   -- RELACIONES
   TEMATICA VARCHAR(150) NULL,
   GENERO VARCHAR(150) NOT NULL,
   -- KEY Y CONSTRAINS 
   PRIMARY KEY (ID_CAJA),
   UNIQUE INDEX AK_FECHA (FECHA), -- PUEDE SER QUE CONSUMA DEMASIADOS RECURSOS AUNQUE AGILICE LA BÚSQUEDA (??) 
   FOREIGN KEY (TEMATICA) REFERENCES TEMATICAS (NOMBRE_TEMATICA)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE,
   FOREIGN KEY (GENERO) REFERENCES GENEROS (NOMBRE_GENERO)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA CAJAS_SORPRESA_PRODUCTO
-- ---------------------------------------------------
DROP TABLE IF EXISTS CAJAS_SORPRESA_PRODUCTOS;
CREATE TABLE IF NOT EXISTS CAJAS_SORPRESA_PRODUCTOS (
	ID_CAJA_SORPRESA_PRODUCTO INT UNSIGNED AUTO_INCREMENT NOT NULL,
	CAJA_SORPRESA INT UNSIGNED NOT NULL,
   PRODUCTO INT UNSIGNED NOT NULL,
   -- KEY Y CONSTRAINS 
   UNIDADES SMALLINT UNSIGNED NOT NULL,
   PRIMARY KEY (ID_CAJA_SORPRESA_PRODUCTO),
   FOREIGN KEY (CAJA_SORPRESA) REFERENCES CAJAS_SORPRESA (ID_CAJA)
   	ON DELETE CASCADE
   	ON UPDATE CASCADE,
   FOREIGN KEY (PRODUCTO) REFERENCES PRODUCTOS (ID_PRODUCTO)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA CAJAS_SORPRESA_USUARIO
-- ---------------------------------------------------
DROP TABLE IF EXISTS CAJAS_SORPRESA_USUARIOS;
CREATE TABLE IF NOT EXISTS CAJAS_SORPRESA_USUARIOS (
	CAJA_SORPRESA INT UNSIGNED NOT NULL,
	USUARIO VARCHAR(150) NOT NULL,
	-- KEYS Y CONSTRAINS
	PRIMARY KEY (CAJA_SORPRESA, USUARIO),
	FOREIGN KEY (CAJA_SORPRESA) REFERENCES CAJAS_SORPRESA (ID_CAJA)
		ON DELETE RESTRICT
		ON UPDATE CASCADE,
	FOREIGN KEY (USUARIO) REFERENCES USUARIOS (EMAIL)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE INNODB;


-- ---------------------------------------------------
--				TABLA PEDIDO
-- ---------------------------------------------------
DROP TABLE IF EXISTS PEDIDOS;
CREATE TABLE IF NOT EXISTS PEDIDOS(
	ID_PEDIDO INT UNSIGNED AUTO_INCREMENT NOT NULL,
   PRECIO FLOAT NOT NULL,
   DIRECCION VARCHAR(150) NOT NULL,
   -- RELACIONES 
   USUARIO_PEDIDO VARCHAR(150) NOT NULL,
   FECHA_PEDIDO DATE NOT NULL,
   FECHA_ENTREGA DATE NOT NULL,
   ENTREGADO BOOLEAN NULL,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (ID_PEDIDO),
   FOREIGN KEY (USUARIO_PEDIDO) REFERENCES USUARIOS (EMAIL)
		ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA PEDIDO_PRODUCTO
-- ---------------------------------------------------
DROP TABLE IF EXISTS PEDIDOS_PRODUCTOS;
CREATE TABLE IF NOT EXISTS PEDIDOS_PRODUCTOS (
	ID_PEDIDO_PRODUCTO INT UNSIGNED AUTO_INCREMENT NOT NULL,
	PEDIDO INT UNSIGNED NOT NULL,
   PRODUCTO INT UNSIGNED NOT NULL,
   UNIDADES TINYINT UNSIGNED NOT NULL,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (ID_PEDIDO_PRODUCTO),
   FOREIGN KEY (PEDIDO) REFERENCES PEDIDOS (ID_PEDIDO)
		ON DELETE CASCADE
      ON UPDATE CASCADE,
	FOREIGN KEY (PRODUCTO) REFERENCES PRODUCTOS (ID_PRODUCTO)
		ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA PARTIDAS
-- ---------------------------------------------------
DROP TABLE IF EXISTS PARTIDAS;
CREATE TABLE IF NOT EXISTS PARTIDAS (
	ID_PARTIDA INT UNSIGNED AUTO_INCREMENT NOT NULL,
   PLAZAS_MIN TINYINT NOT NULL,
   PLAZAS_TOTALES TINYINT NOT NULL,
   FECHA DATE NOT NULL,
   HORA_INICIO TIME(0) NOT NULL,
   DURACION SMALLINT NOT NULL,
   -- RELACIONES 
   DIRECTOR_PARTIDA VARCHAR(150) NOT NULL,
   JUEGO_PARTIDA INT UNSIGNED NOT NULL,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (ID_PARTIDA),
   FOREIGN KEY (DIRECTOR_PARTIDA) REFERENCES USUARIOS (EMAIL)
		ON DELETE RESTRICT
      ON UPDATE CASCADE,
	FOREIGN KEY (JUEGO_PARTIDA) REFERENCES JUEGOS (JUEGO)
		ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA USUARIO_PARTIDA
-- ---------------------------------------------------
DROP TABLE IF EXISTS USUARIOS_PARTIDAS;
CREATE TABLE IF NOT EXISTS USUARIOS_PARTIDAS (
	ID_PARTIDA_RESERVADA INT UNSIGNED AUTO_INCREMENT NOT NULL,
	USUARIO VARCHAR(150) NOT NULL,
   PARTIDA INT UNSIGNED NOT NULL,
   MOMENTO_RESERVA DATETIME NOT NULL,
   RESERVADA BOOLEAN NOT NULL,

   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (ID_PARTIDA_RESERVADA),
   FOREIGN KEY FK_USUARIO_RESERVO (USUARIO) REFERENCES USUARIOS (EMAIL)
		ON DELETE RESTRICT -- SI UN USUARIO QUIERE BORRAR SU CUENTA CON UNA PARTIDA RESERVADA, NO LE DEJARÁ HASTA QUE CANCELE LA RESERVA 
      ON UPDATE CASCADE,
	FOREIGN KEY FK_PARTIDA_RESERVADA (PARTIDA) REFERENCES PARTIDAS (ID_PARTIDA)
		ON DELETE RESTRICT -- MIENTRAS HAYA PARTIDAS RESERVADAS NO SE PODRÁ BORRAR LA PARTIDA 
      ON UPDATE CASCADE
) ENGINE = INNODB;

-- ---------------------------------------------------
--				TABLA PARTIDA_GENEROS
-- ---------------------------------------------------
DROP TABLE IF EXISTS PARTIDAS_GENEROS;
CREATE TABLE IF NOT EXISTS PARTIDAS_GENEROS(
	ID_GENERO_PARTIDA INT UNSIGNED AUTO_INCREMENT NOT NULL,
	PARTIDA INT UNSIGNED NOT NULL,
	GENERO VARCHAR(150) NOT NULL,
	-- KEYS Y CONSTRAINS
	PRIMARY KEY (ID_GENERO_PARTIDA),
	FOREIGN KEY (PARTIDA) REFERENCES PARTIDAS (ID_PARTIDA)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (GENERO) REFERENCES GENEROS (NOMBRE_GENERO)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA HISTORICO_USUARIOS
-- ---------------------------------------------------
DROP TABLE IF EXISTS HISTORICO_USUARIOS;
CREATE TABLE IF NOT EXISTS HISTORICO_USUARIOS (
	EMAIL VARCHAR(150) NOT NULL,
	-- LA CONSTRASEÑA COMO TAL NO LA GUARDAMOS PORQUE ESTÁ CIFRADA Y NO APORTA NADA LAS CONTRASEÑAS ANTIGUAS
	-- PWD VARCHAR(255) NOT NULL,
   NOMBRE VARCHAR(25) NOT NULL,
   APELLIDOS VARCHAR(100) NOT NULL,
	TELEFONO CHAR(11) NULL,
	DIRECCION VARCHAR(150) NULL,
	GENERO_FAVORITO VARCHAR(150) NULL,
	FECHA_ULT_MODIF DATE NOT NULL,
	-- ÚLTIMO ACCESO NO SE GUARDA PORQUE SINO TENDRÍAMOS MUCHISIMAS ENTRADAS
	SUSCRIPCION TINYINT NULL,
	RENOVAR BOOLEAN NULL
)ENGINE MYISAM;

-- CREACIÓN DE LOS USUARIOS DE LA BD
-- USUARIO PARA LA CONEXIÓN Y REGISTRO DE USUARIOS
GRANT SELECT, INSERT ON PROYECTO_MODULAR.USUARIOS TO 'conexion'@'localhost' IDENTIFIED BY '1234';
GRANT SELECT ON PROYECTO_MODULAR.GENEROS TO 'conexion'@'localhost';
GRANT SELECT ON PROYECTO_MODULAR.ROLES TO 'conexion'@'localhost';
-- USUARIO ESTÁNDAR PARA LOS USUARIOS REGISTRADOS
GRANT SELECT, UPDATE ON PROYECTO_MODULAR.USUARIOS TO 'estandar'@'localhost' IDENTIFIED BY 'renaido';
GRANT SELECT, INSERT ON PROYECTO_MODULAR.PEDIDOS TO 'estandar'@'localhost';
GRANT SELECT, INSERT ON PROYECTO_MODULAR.PEDIDOS_PRODUCTOS TO 'estandar'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON PROYECTO_MODULAR.CARRITOS TO 'estandar'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON PROYECTO_MODULAR.PRODUCTOS_CARRITOS TO 'estandar'@'localhost';
-- USUARIO ADMINISTRADOR
GRANT SELECT, UPDATE ON PROYECTO_MODULAR.USUARIOS TO 'admin'@'localhost' IDENTIFIED BY 'abc123.';
GRANT SELECT, INSERT ON PROYECTO_MODULAR.PEDIDOS TO 'admin'@'localhost';
GRANT SELECT, INSERT ON PROYECTO_MODULAR.PEDIDOS_PRODUCTOS TO 'admin'@'localhost';
GRANT SELECT, INSERT ON PROYECTO_MODULAR.CAJAS_SORPRESA TO 'admin'@'localhost';
GRANT SELECT, INSERT ON PROYECTO_MODULAR.CAJAS_SORPRESA_PRODUCTOS TO 'admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON PROYECTO_MODULAR.CARRITOS TO 'admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON PROYECTO_MODULAR.PRODUCTOS_CARRITOS TO 'admin'@'localhost';
GRANT SELECT, INSERT, UPDATE ON PROYECTO_MODULAR.USUARIOS_PARTIDAS TO 'admin'@'localhost';
GRANT SELECT, INSERT, UPDATE ON PROYECTO_MODULAR.PRODUCTOS TO 'admin'@'localhost';
GRANT SELECT, INSERT, UPDATE ON PROYECTO_MODULAR.PARTIDAS TO 'admin'@'localhost';
GRANT SELECT, INSERT ON PROYECTO_MODULAR.TEMATICAS TO 'admin'@'localhost';
GRANT SELECT, INSERT ON PROYECTO_MODULAR.GENEROS TO 'admin'@'localhost';

-- DISPARADORES
DELIMITER $$
-- DISPARADOR QUE COMPRUEBA QUE EL USUARIO ESTÁ SUSCRITO ANTES DE INTRODUCIRLO EN CAJAS_SORPRESA_USUARIOS Y QUE SU SUSCRIPCIÓN SIGUE SIENDO VÁLIDA
DROP TRIGGER IF EXISTS COMPROBAR_SUSCRIPCION$$
CREATE TRIGGER COMPROBAR_SUSCRIPCION BEFORE INSERT ON CAJAS_SORPRESA_USUARIOS
	FOR EACH ROW
		BEGIN
			-- VARIABLE DONDE GUARDAREMOS EL RESULTADO DEL SELECT
			DECLARE FECHA_VALIDEZ_SUSCRIPCION DATE;
			-- CONSIGO LA FECHA DEL USUARIO ACTUAL Y SI ESTÁ SUSCRITO
			SELECT
				-- LE SUMO LA SUSCRIPCIÓN YA QUE LA FOREIGN KEY CORRESPONDE CON LA CANTIDAD DE MESES
				DATE_ADD(FECHA_INI_SUSCRIPCION, INTERVAL SUSCRIPCION MONTH) INTO FECHA_VALIDEZ_SUSCRIPCION
				FROM USUARIOS
					WHERE ID_USUARIO = NEW.USUARIO
								AND
							SUSCRIPCION IS NOT NULL;
			-- COMPRUEBO QUE LA FECHA_SUSCRIPCIÓN NO SEA NULA Y QUE SEA MÁS GRANDE QUE LA FECHA ACTUAL (AÚN LE QUEDA TIEMPO DE SUSCRIPCIÓN)
			IF FECHA_VALIDEZ_SUSCRIPCION IS NULL OR FECHA_VALIDEZ_SUSCRIPCION < NOW()
			-- SALE DEL TRIGGER Y DEVUELVE EL MENSAJE DE ERROR
		   THEN SIGNAL SQLSTATE '45010' SET MESSAGE_TEXT='NO SE PERMITE LA OPERACIÓN YA QUE EL USUARIO NO ESTÁ SUSCRITO A NINGUNA CAJA';
			END IF;	
			-- SI NO SALIÓ ANTES ES QUE ES VÁLIDA LA OPERACIÓN
		END$$
		
-- DISPARADOR QUE AÑADE UNA FILA AL HISTORICO CON LOS DATOS ANTIGUOS
DROP TRIGGER IF EXISTS HISTORICO_USUARIOS$$
CREATE TRIGGER IF NOT EXISTS HISTORICO_USUARIOS BEFORE UPDATE ON USUARIOS
FOR EACH ROW
	BEGIN
		-- COMPROBAMOS QUE EL CAMBIO HECHO NO SEA ACTUALIZAR LA ULTIMA CONEXION, COMO SE HARÁ NADA MÁS INICIAR SESIÓN EL USUARIO NO PUDE CAMBIAR NADA MAS
		IF OLD.FECHA_ULT_ACCESO = NEW.FECHA_ULT_ACCESO
			-- SI LA MODIFICACIÓN FUE DE OTRO ELEMENTO ENTONCES ANTES DE QUE ACTUALICE VOLCAMOS LOS DATOS EN LA TABLA DEL HISTORICO DE USUARIO
			THEN  INSERT INTO HISTORICO_USUARIOS
						(EMAIL, NOMBRE, APELLIDOS, TELEFONO, DIRECCION, GENERO_FAVORITO, FECHA_ULT_MODIF, SUSCRIPCION, RENOVAR)
						VALUES
						(OLD.EMAIL, OLD.NOMBRE, OLD.APELLIDOS, OLD.TELEFONO, OLD.DIRECCION, OLD.GENERO_FAVORITO, OLD.FECHA_ULT_MODIF, OLD.SUSCRIPCION, OLD.RENOVAR);
		END IF;
	END$$
	
-- PROCEDIMIENTOS
-- PROCEDIMIENTO QUE ACTUALIZA LAS SUSCRIPCIONES PARA PONERLAS A NULL O ACTUALIZARLE EL TIEMPO
DROP PROCEDURE IF EXISTS ACTUALIZAR_SUSCRIPCIONES$$
CREATE PROCEDURE IF NOT EXISTS ACTUALIZAR_SUSCRIPCIONES ()
BEGIN
		-- DECLARAMOS EL MANEJADOR DE ERRORES PARA QUE HAGA ROLLBACK Y MUESTRE EL ERROR POR PANTALLA
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
			BEGIN
				-- SE DESHACEN LAS OPERACIONES REALIZADAS
	         ROLLBACK; 
	         SELECT 'NO SE PUDO ACTUALIZAR LAS SUSCRIPCIONES EL DÍA: ' + NOW();
       	END;
		-- EMPIEZO UNA TRANSACCION YA QUE HARÉ 2 OPERACION
		START TRANSACTION;
			-- ACTUALIZAMOS TODOS LOS USUARIOS QUE QUIEREN RENOVAR Y SE LES ACABÓ LA SUSCRIPCIÓN CON LA NUEVA FECHA
			UPDATE USUARIOS
				-- LE SUMO LA SUSCRIPCIÓN YA QUE SERÁ EL TIEMPO QUE RENUEVA
				SET FECHA_INI_SUSCRIPCION = DATE_ADD(FECHA_INI_SUSCRIPCION, INTERVAL SUSCRIPCION MONTH)
				WHERE FECHA_INI_SUSCRIPCION < NOW()
							AND
						RENOVAR != 0;
			
			-- ACTUALIZO TODOS LOS USUARIOS QUE NO QUIEREN RENOVAR A NULL
			UPDATE USUARIOS
				SET SUSCRIPCION = NULL, FECHA_INI_SUSCRIPCION = NULL, RENOVAR = NULL
				WHERE FECHA_INI_SUSCRIPCION < NOW()
							AND
						RENOVAR = 0;
		COMMIT;
END$$

-- PROCEDIMEINTO QUE AÑADE TODOS LOS USUARIOS QUE ESTEAN SUSCRITO A LA TABLA CON LA CAJA MÁS RECIENTE (GENTE QUE RECIBIRÁ LA CAJA)
DROP PROCEDURE IF EXISTS ADD_USUARIOS_CAJA_SORPRESA$$
CREATE PROCEDURE IF NOT EXISTS ADD_USUARIOS_CAJA_SORPRESA (IN ULTIMA_CAJA_SORPRESA INT UNSIGNED)
BEGIN		
	-- INSERTO TODOS LOS USUARIOS PARA ESA CAJA
	INSERT INTO CAJAS_SORPRESA_USUARIOS
		(CAJA_SORPRESA, USUARIO)
		SELECT
			ULTIMA_CAJA_SORPRESA,
			ID_USUARIO
			FROM USUARIOS
			WHERE SUSCRIPCION IS NOT NULL
						AND
					DATE_ADD(FECHA_INI_SUSCRIPCION, INTERVAL SUSCRIPCION MONTH) > NOW();
END$$

-- PROCEDIMIENTO QUE VUELCA LA INFORMACIÓN EN HISTORICO_USUARIO Y DESPUES HACE LOS CAMPOS NECESARIOS
DROP PROCEDURE IF EXISTS UPDATE_USUARIO$$
CREATE PROCEDURE IF NOT EXISTS UPDATE_USUARIO ()
		
-- EVENTOS
-- EVENTO QUE CADA DÍA ACTUALIZA LAS SUSCRIPCIONES SI YA SE PASARON DE FECHA (SI TIENE RENOVAR LE AÑADE EL TIEMPO Y SI NÓ LE BORRA LA SUSCRIPCIÓN)
DROP EVENT IF EXISTS ACTUALIZAR_SUSCRIPCIONES$$
CREATE EVENT IF NOT EXISTS ACTUALIZAR_SUSCRIPCIONES
	-- LE DECIMOS QUE HAGA EL EVENTO CADA DÍA A LAS 4 DE LA MAÑANA
	ON SCHEDULE EVERY 1 DAY
	STARTS (TIMESTAMP(NOW()) + INTERVAL 1 DAY + INTERVAL 4 HOUR)
	DO 
		-- LLAMAMOS AL PROCEDIMIENTO PARA ACTUALIZAR LAS SUSCRIPCIONES, LO HACEMOS DE ESTA FORMA YA QUE ES ALGO RUTINARIO, ASÍ SE EJECUTA MÁS RÁPIDO Y ADEMÁS ES UNA TRANSACCIÓN
		CALL ACTUALIZAR_SUSCRIPCIONES()$$
	
-- Activamos el evento	
SET GLOBAL event_scheduler=ON$$