DROP DATABASE IF EXISTS a2da_clickbox;
CREATE DATABASE IF NOT EXISTS a2da_clickbox;
USE a2da_clickbox;

-- ---------------------------------------------------
--				TABLA TEMATICA
-- ---------------------------------------------------
DROP TABLE IF EXISTS tematicas;
CREATE TABLE IF NOT EXISTS tematicas (
	nombre_tematica VARCHAR(150) NOT NULL,
	-- KEYS Y CONSTRAINS 
	PRIMARY KEY (nombre_tematica)
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA GENERO
-- ---------------------------------------------------
DROP TABLE IF EXISTS generos;
CREATE TABLE IF NOT EXISTS generos (
	nombre_genero VARCHAR(150) NOT NULL,
	-- KEY Y CONSTRAINS 
	PRIMARY KEY (nombre_genero)
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA PRODUCTOS
-- ---------------------------------------------------
DROP TABLE IF EXISTS productos;
CREATE TABLE IF NOT EXISTS productos (
	id_producto INT UNSIGNED AUTO_INCREMENT NOT NULL,
   nombre VARCHAR(125) NOT NULL,
   stock INT UNSIGNED NOT NULL,
   precio DECIMAL(6,2) NOT NULL,
   imagen_producto	VARCHAR(255) NOT NULL,
   tipo_producto ENUM('juego','accesorio') null,
   -- RELACIONES 
   tematica VARCHAR(150) NULL,
   -- KEY Y CONSTRAINS 
   PRIMARY KEY (id_producto),
   UNIQUE INDEX AK_NOMBRE (nombre), -- PODRÍAN EXISTIR DOS JUEGOS CON EL MISMO NOMBRE (???) 
   FOREIGN KEY (tematica) REFERENCES tematicas (nombre_tematica)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE,
	INDEX buscar_tipo_producto (tipo_producto)
) ENGINE = INNODB, AUTO_INCREMENT = 1, character set UTF8mb4 collate utf8mb4_bin; -- Se pone auto_increment para que empiece a 1 en vez de a 60

-- ---------------------------------------------------
--				TABLA JUEGO
-- ---------------------------------------------------
DROP TABLE IF EXISTS juegos;
CREATE TABLE IF NOT EXISTS juegos (
	juego INT UNSIGNED NOT NULL,
	num_jug VARCHAR(4) NOT NULL,
    descripcion text NULL,
	genero VARCHAR(150) NOT NULL,
	/** KEY Y CONSTRAINS **/
	PRIMARY KEY (juego),
	FOREIGN KEY (juego) REFERENCES productos (id_producto)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (genero) REFERENCES generos (nombre_genero)
		ON DELETE RESTRICT
		ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA SUSCRIPCION
-- ---------------------------------------------------
DROP TABLE IF EXISTS suscripciones;
CREATE TABLE IF NOT EXISTS suscripciones (
	duracion TINYINT NOT NULL,
	precio FLOAT NOT NULL,
	
	-- KEYS Y CONSTRAINS
	PRIMARY KEY (duracion)
) ENGINE INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA ROlES
-- ---------------------------------------------------
DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (
	id_rol INT UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre_rol VARCHAR(50) NOT NULL,
	descripcion VARCHAR(150) NULL,
    -- KEYS Y CONSTRAINS 
   PRIMARY KEY (id_rol)
)ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;
    

-- ---------------------------------------------------
--				TABLA USUARIO
-- ---------------------------------------------------
DROP TABLE IF EXISTS usuarios;
CREATE TABLE IF NOT EXISTS usuarios (
   email VARCHAR(150) NOT NULL,
   pwd VARCHAR(255) NOT NULL,
   nombre VARCHAR(25) NOT NULL,
   apellidos VARCHAR(100) NOT NULL,
   telefono CHAR(11) NULL,
   fecha_registro DATE NOT NULL,
   direccion VARCHAR(150) NULL,
   fecha_nac DATE NOT NULL,
   fecha_ult_modif DATETIME NOT NULL,
   fecha_ult_acceso DATETIME NOT NULL,
   imagen_perfil VARCHAR(255) NOT NULL,
   -- GENERO_FAVORITO  ENUM("Detectives","Estrategia","Guerra","Miedo","Puzzles","Cooperativos", "Individual","Competitivo") NULL,
   -- RELACIONES 
   rol INT UNSIGNED NOT NULL DEFAULT 2,
   genero_favorito VARCHAR(150) NULL,
   suscripcion TINYINT NULL,
   renovar BOOLEAN NULL,
   fecha_ini_suscripcion DATE NULL,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (email),
   FOREIGN KEY (rol) REFERENCES roles (id_rol)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE,
   FOREIGN KEY (genero_favorito) REFERENCES generos (nombre_genero)
   	ON DELETE SET NULL
   	ON UPDATE CASCADE,
   FOREIGN KEY (suscripcion) REFERENCES suscripciones (duracion)
   	ON DELETE SET NULL
   	ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

    
-- ---------------------------------------------------
--				TABLA CARRITOS
-- ---------------------------------------------------
DROP TABLE IF EXISTS carritos;
CREATE TABLE IF NOT EXISTS carritos (
	id_carrito INT UNSIGNED AUTO_INCREMENT NOT NULL,
	usuario_carrito VARCHAR(150) NOT NULL,
	-- KEYS Y CONSTRAINS 
	PRIMARY KEY (id_carrito),
	FOREIGN KEY (usuario_carrito) REFERENCES usuarios (email)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA PRODUCTO_CARRITO
-- ---------------------------------------------------
DROP TABLE IF EXISTS productos_carritos;
CREATE TABLE IF NOT EXISTS productos_carritos (
	id_producto_carrito INT UNSIGNED AUTO_INCREMENT NOT NULL,
	carrito INT UNSIGNED NOT NULL,
	producto INT UNSIGNED NOT NULL, 
	unidades SMALLINT UNSIGNED NOT NULL,
	-- KEYS Y CONSTRAINS 
	PRIMARY KEY (id_producto_carrito),
	FOREIGN KEY (carrito) REFERENCES carritos (id_carrito)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (producto) REFERENCES productos (id_producto)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA CAJAS_SORPRESA
-- ---------------------------------------------------
DROP TABLE IF EXISTS cajas_sorpresa;
CREATE TABLE IF NOT EXISTS cajas_sorpresa (
	id_caja INT UNSIGNED AUTO_INCREMENT NOT NULL,
   fecha DATE NOT NULL,
   img_caja VARCHAR(255) NULL,
   unidades SMALLINT UNSIGNED NOT NULL,
   -- RELACIONES
   tematica VARCHAR(150) NULL,
   -- KEY Y CONSTRAINS 
   PRIMARY KEY (id_caja),
   UNIQUE INDEX AK_FECHA (fecha), -- PUEDE SER QUE CONSUMA DEMASIADOS RECURSOS AUNQUE AGILICE LA BÚSQUEDA (??) 
   FOREIGN KEY (tematica) REFERENCES tematicas (nombre_tematica)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA CAJAS_SORPRESA_PRODUCTO
-- ---------------------------------------------------
DROP TABLE IF EXISTS cajas_sorpresa_producto;
CREATE TABLE IF NOT EXISTS cajas_sorpresa_producto (
	id_caja_sorpresa_producto INT UNSIGNED AUTO_INCREMENT NOT NULL,
	caja_sorpresa INT UNSIGNED NOT NULL,
   producto INT UNSIGNED NOT NULL,
   -- KEY Y CONSTRAINS 
   PRIMARY KEY (id_caja_sorpresa_producto),
   FOREIGN KEY (caja_sorpresa) REFERENCES cajas_sorpresa (id_caja)
   	ON DELETE CASCADE
   	ON UPDATE CASCADE,
   FOREIGN KEY (producto) REFERENCES productos (id_producto)
   	ON DELETE RESTRICT
   	ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA CAJAS_SORPRESA_USUARIO
-- ---------------------------------------------------
DROP TABLE IF EXISTS cajas_sorpresa_usuarios;
CREATE TABLE IF NOT EXISTS cajas_sorpresa_usuarios (
	caja_sorpresa INT UNSIGNED NOT NULL,
	usuario VARCHAR(150) NOT NULL,
	-- KEYS Y CONSTRAINS
	PRIMARY KEY (caja_sorpresa, usuario),
	FOREIGN KEY (caja_sorpresa) REFERENCES cajas_sorpresa (id_caja)
		ON DELETE RESTRICT
		ON UPDATE CASCADE,
	FOREIGN KEY (usuario) REFERENCES usuarios (email)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE INNODB, character set UTF8mb4 collate utf8mb4_bin;


-- ---------------------------------------------------
--				TABLA PEDIDO
-- ---------------------------------------------------
DROP TABLE IF EXISTS pedidos;
CREATE TABLE IF NOT EXISTS pedidos(
	id_pedido INT UNSIGNED AUTO_INCREMENT NOT NULL,
   precio FLOAT NOT NULL,
   direccion VARCHAR(150) NOT NULL,
   -- RELACIONES 
   usuario_pedido VARCHAR(150) NOT NULL,
   fecha_pedido DATE NOT NULL,
   fecha_emtrega DATE NOT NULL,
   entregado BOOLEAN NULL default 0,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (id_pedido),
   FOREIGN KEY (usuario_pedido) REFERENCES usuarios (email)
		ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA PEDIDO_PRODUCTO
-- ---------------------------------------------------
DROP TABLE IF EXISTS pedidos_productos;
CREATE TABLE IF NOT EXISTS pedidos_productos (
	id_pedido_producto INT UNSIGNED AUTO_INCREMENT NOT NULL,
	pedido INT UNSIGNED NOT NULL,
   producto INT UNSIGNED NOT NULL,
   unidades TINYINT UNSIGNED NOT NULL,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (id_pedido_producto),
   FOREIGN KEY (pedido) REFERENCES pedidos (id_pedido)
		ON DELETE CASCADE
      ON UPDATE CASCADE,
	FOREIGN KEY (producto) REFERENCES productos (id_producto)
		ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA PARTIDAS
-- ---------------------------------------------------
DROP TABLE IF EXISTS partidas;
CREATE TABLE IF NOT EXISTS partidas (
	id_partida INT UNSIGNED AUTO_INCREMENT NOT NULL,
   plazas_min TINYINT NOT NULL,
   plazas_totales TINYINT NOT NULL,
   fecha DATE NOT NULL,
   hora_inicio TIME(0) NOT NULL,
   duracion SMALLINT NOT NULL,
   -- RELACIONES 
   director_partida VARCHAR(150) NOT NULL,
   juego_partida INT UNSIGNED NOT NULL,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (id_partida),
   FOREIGN KEY (director_partida) REFERENCES usuarios (email)
		ON DELETE RESTRICT
      ON UPDATE CASCADE,
	FOREIGN KEY (juego_partida) REFERENCES juegos (juego)
		ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA partidas_imagenes
-- ---------------------------------------------------
DROP TABLE IF EXISTS partidas_imagenes;
CREATE TABLE IF NOT EXISTS	partidas_imagenes (
	id_imagen_partida INT UNSIGNED AUTO_INCREMENT NOT NULL,
	partida INT UNSIGNED NOT NULL,
	imagen VARCHAR(255) NOT NULL,
	-- KEYS Y CONSTRAINS 
	PRIMARY KEY (id_imagen_partida),
	FOREIGN KEY (partida) REFERENCES partidas (id_partida)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA USUARIO_PARTIDA
-- ---------------------------------------------------
DROP TABLE IF EXISTS usuarios_partidas;
CREATE TABLE IF NOT EXISTS usuarios_partidas (
	usuario VARCHAR(150) NOT NULL,
   partida INT UNSIGNED NOT NULL,
   momento_reserva DATETIME NOT NULL,
   reservada BOOLEAN NOT NULL,

   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (usuario, partida),
   FOREIGN KEY FK_USUARIO_RESERVO (usuario) REFERENCES usuarios (email)
		ON DELETE RESTRICT -- SI UN USUARIO QUIERE BORRAR SU CUENTA CON UNA PARTIDA RESERVADA, NO LE DEJARÁ HASTA QUE CANCELE LA RESERVA 
      ON UPDATE CASCADE,
	FOREIGN KEY FK_PARTIDA_RESERVADA (partida) REFERENCES partidas (id_partida)
		ON DELETE RESTRICT -- MIENTRAS HAYA PARTIDAS RESERVADAS NO SE PODRÁ BORRAR LA PARTIDA 
      ON UPDATE CASCADE
) ENGINE = INNODB, character set UTF8mb4 collate utf8mb4_bin;

-- ---------------------------------------------------
--				TABLA HISTORICO_USUARIOS
-- ---------------------------------------------------
DROP TABLE IF EXISTS historico_usuarios;
CREATE TABLE IF NOT EXISTS historico_usuarios (
	id int unsigned auto_increment  not null,
	email VARCHAR(150) NOT NULL,
	rol INT UNSIGNED NOT NULL,
	-- LA CONSTRASEÑA COMO TAL NO LA GUARDAMOS PORQUE ESTÁ CIFRADA Y NO APORTA NADA LAS CONTRASEÑAS ANTIGUAS
	-- PWD VARCHAR(255) NOT NULL,
    nombre VARCHAR(25) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
	telefono CHAR(11) NULL,
	direccion VARCHAR(150) NULL,
	genero_favorito VARCHAR(150) NULL,
	fecha_ult_modif DATE NOT NULL,
	-- ÚLTIMO ACCESO NO SE GUARDA PORQUE SINO TENDRÍAMOS MUCHISIMAS ENTRADAS
	suscripcion TINYINT NULL,
	renovar BOOLEAN NULL,
	-- Clave y restricciones
	primary key (id)
)ENGINE MYISAM, character set UTF8mb4 collate utf8mb4_bin;

-- CREACIÓN DE LOS USUARIOS DE LA BD
-- USUARIO PARA LA CONEXIÓN Y REGISTRO DE USUARIOS
/*GRANT SELECT, INSERT ON a2da_clickbox.usuarios TO 'a2da_conexion'@'localhost' IDENTIFIED BY '123456';
GRANT SELECT ON a2da_clickbox.generos TO 'a2da_conexion'@'localhost';
GRANT SELECT ON a2da_clickbox.roles TO 'a2da_conexion'@'localhost';
GRANT SELECT ON a2da_clickbox.suscripciones TO 'a2da_conexion'@'localhost';
GRANT SELECT ON a2da_clickbox.cajas_sorpresa TO 'a2da_conexion'@'localhost';
GRANT SELECT ON a2da_clickbox.cajas_sorpresa_producto TO 'a2da_conexion'@'localhost';
GRANT SELECT ON a2da_clickbox.productos TO 'a2da_conexion'@'localhost';
GRANT SELECT ON a2da_clickbox.tematicas TO 'a2da_conexion'@'localhost';
GRANT SELECT ON a2da_clickbox.juegos TO 'a2da_conexion'@'localhost';
-- USUARIO ESTÁNDAR PARA LOS USUARIOS REGISTRADOS
GRANT SELECT, UPDATE ON a2da_clickbox.usuarios TO 'a2da_estandar'@'localhost' IDENTIFIED BY 'renaido';
GRANT SELECT, INSERT ON a2da_clickbox.pedidos TO 'a2da_estandar'@'localhost';
GRANT SELECT, INSERT ON a2da_clickbox.pedidos_productos TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.partidas TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.generos TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.productos TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.juegos TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.accesorios TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.roles TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.suscripciones TO 'a2da_estandar'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON a2da_clickbox.carritos TO 'a2da_estandar'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON a2da_clickbox.productos_carritos TO 'a2da_estandar'@'localhost';
GRANT SELECT, INSERT, DELETE ON a2da_clickbox.usuarios_partidas TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.partidas_imagenes TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.historico_usuarios TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.cajas_sorpresa TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.cajas_sorpresa_producto TO 'a2da_estandar'@'localhost';
GRANT ALL ON a2da_clickbox.carritos TO 'a2da_estandar'@'localhost';
GRANT ALL ON a2da_clickbox.productos_carritos TO 'a2da_estandar'@'localhost';
GRANT EXECUTE ON PROCEDURE a2da_clickbox.cargar_carrito TO 'a2da_estandar'@'localhost';
GRANT SELECT ON a2da_clickbox.tematicas TO 'a2da_estandar'@'localhost';
-- USUARIO ADMINISTRADOR
GRANT SELECT, UPDATE ON a2da_clickbox.usuarios TO 'a2da_admin'@'localhost' IDENTIFIED BY 'abc123.';
GRANT SELECT, INSERT ON a2da_clickbox.pedidos TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT ON a2da_clickbox.pedidos_productos TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT ON a2da_clickbox.cajas_sorpresa TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT ON a2da_clickbox.cajas_sorpresa_producto TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON a2da_clickbox.carritos TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON a2da_clickbox.productos_carritos TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE ON a2da_clickbox.usuarios_partidas TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE ON a2da_clickbox.productos TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON a2da_clickbox.partidas TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON a2da_clickbox.usuarios_partidas TO 'a2da_admin'@'localhost';
GRANT SELECT ON a2da_clickbox.juegos TO 'a2da_admin'@'localhost';
GRANT SELECT ON a2da_clickbox.tematicas TO 'a2da_admin'@'localhost';
GRANT SELECT ON a2da_clickbox.roles TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT ON a2da_clickbox.tematicas TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT ON a2da_clickbox.generos TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT ON a2da_clickbox.partidas_imagenes TO 'a2da_admin'@'localhost';
GRANT SELECT ON a2da_clickbox.historico_usuarios TO 'a2da_admin'@'localhost';
GRANT ALL ON a2da_clickbox.carritos TO 'a2da_admin'@'localhost';
GRANT ALL ON a2da_clickbox.productos_carritos TO 'a2da_admin'@'localhost';
GRANT EXECUTE ON PROCEDURE a2da_clickbox.cargar_carrito TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON a2da_clickbox.productos TO 'a2da_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON a2da_clickbox.juegos TO 'a2da_admin'@'localhost';*/

-- DISPARADORES
DELIMITER $$
-- DISPARADOR QUE COMPRUEBA QUE EL USUARIO ESTÁ SUSCRITO ANTES DE INTRODUCIRLO EN CAJAS_SORPRESA_USUARIOS Y QUE SU SUSCRIPCIÓN SIGUE SIENDO VÁLIDA
DROP TRIGGER IF EXISTS comprobar_suscripcion$$
CREATE TRIGGER comprobar_suscripcion BEFORE INSERT ON cajas_sorpresa_usuarios
	FOR EACH ROW
		BEGIN
			-- VARIABLE DONDE GUARDAREMOS EL RESULTADO DEL SELECT
			DECLARE fecha_validez_suscripcion DATE;
			-- CONSIGO LA FECHA DEL USUARIO ACTUAL Y SI ESTÁ SUSCRITO
			SELECT
				-- LE SUMO LA SUSCRIPCIÓN YA QUE LA FOREIGN KEY CORRESPONDE CON LA CANTIDAD DE MESES
				DATE_ADD(fecha_ini_suscripcion, INTERVAL suscripcion MONTH) INTO fecha_validez_suscripcion
				FROM usuarios
					WHERE id_usuario = new.usuario
								AND
							suscripcion IS NOT NULL;
			-- COMPRUEBO QUE LA FECHA_SUSCRIPCIÓN NO SEA NULA Y QUE SEA MÁS GRANDE QUE LA FECHA ACTUAL (AÚN LE QUEDA TIEMPO DE SUSCRIPCIÓN)
			IF fecha_validez_suscripcion IS NULL OR fecha_validez_suscripcion < NOW()
			-- SALE DEL TRIGGER Y DEVUELVE EL MENSAJE DE ERROR
		   THEN SIGNAL SQLSTATE '45010' SET MESSAGE_TEXT='NO SE PERMITE LA OPERACIÓN YA QUE EL USUARIO NO ESTÁ SUSCRITO A NINGUNA CAJA';
			END IF;	
			-- SI NO SALIÓ ANTES ES QUE ES VÁLIDA LA OPERACIÓN
		END$$
		
-- DISPARADOR QUE AÑADE UNA FILA AL HISTORICO CON LOS DATOS ANTIGUOS
DROP TRIGGER IF EXISTS historico_usuarios$$
CREATE TRIGGER IF NOT EXISTS historico_usuarios BEFORE UPDATE ON usuarios
FOR EACH ROW
	BEGIN
		-- COMPROBAMOS QUE EL CAMBIO HECHO NO SEA ACTUALIZAR LA ULTIMA CONEXION, COMO SE HARÁ NADA MÁS INICIAR SESIÓN EL USUARIO NO PUDE CAMBIAR NADA MAS
		IF OLD.fecha_ult_acceso = NEW.fecha_ult_acceso
			-- SI LA MODIFICACIÓN FUE DE OTRO ELEMENTO ENTONCES ANTES DE QUE ACTUALICE VOLCAMOS LOS DATOS EN LA TABLA DEL HISTORICO DE USUARIO
			THEN  INSERT INTO historico_usuarios
						(email, rol, nombre, apellidos, telefono, direccion, genero_favorito, fecha_ult_modif, suscripcion, renovar)
						VALUES
						(new.email, new.rol, new.nombre, new.apellidos, new.telefono, new.direccion, new.genero_favorito, new.fecha_ult_modif, new.suscripcion, new.renovar);
		END IF;
	END$$
	
-- PROCEDIMIENTOS
-- PROCEDIMIENTO QUE ACTUALIZA LAS SUSCRIPCIONES PARA PONERLAS A NULL O ACTUALIZARLE EL TIEMPO
DROP PROCEDURE IF EXISTS actualizar_suscripciones$$
CREATE PROCEDURE IF NOT EXISTS actualizar_suscripciones ()
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
			UPDATE usuarios
				-- LE SUMO LA SUSCRIPCIÓN YA QUE SERÁ EL TIEMPO QUE RENUEVA
				SET fecha_ini_suscripcion = DATE_ADD(fecha_ini_suscripcion, INTERVAL SUSCRIPCION MONTH)
				WHERE fecha_ini_suscripcion < NOW()
							AND
						renovar != 0;
			
			-- ACTUALIZO TODOS LOS USUARIOS QUE NO QUIEREN RENOVAR A NULL
			UPDATE usuarios
				SET suscripciones = NULL, fecha_ini_suscripcion = NULL, renovar = NULL
				WHERE fecha_ini_suscripcion < NOW()
							AND
						renovar = 0;
		COMMIT;
END$$

-- PROCEDIMEINTO QUE AÑADE TODOS LOS USUARIOS QUE ESTEAN SUSCRITO A LA TABLA CON LA CAJA MÁS RECIENTE (GENTE QUE RECIBIRÁ LA CAJA)
DROP PROCEDURE IF EXISTS add_usuarios_caja_sorpresa$$
CREATE PROCEDURE IF NOT EXISTS add_usuarios_caja_sorpresa (IN ultima_caja_sorpresa INT UNSIGNED)
BEGIN		
	-- INSERTO TODOS LOS USUARIOS PARA ESA CAJA
	INSERT INTO cajas_sorpresa_usuarios
		(caja_sorpresa, usuario)
		SELECT
			ultima_caja_sorpresa,
			id_usuario
			FROM usuarios
			WHERE suscripcion IS NOT NULL
						AND
					DATE_ADD(fecha_ini_suscripcion, INTERVAL suscripcion MONTH) > NOW();
END$$

-- PROCEDIMIENTO QUE Muestra el carrito con todos los productos de un usuario
DROP PROCEDURE IF EXISTS cargar_carrito$$
CREATE PROCEDURE IF NOT EXISTS cargar_carrito (IN usuario VARCHAR(150), IN pagina int, IN limite int)
BEGIN
		SELECT  C.id_carrito,
				P.nombre,
				P.id_producto,
                P.imagen_producto,
			    PC.unidades,
			    P.precio
			FROM carritos AS C INNER JOIN productos_carritos AS PC ON C.usuario_carrito = usuario AND C.id_carrito = PC.carrito
				INNER JOIN productos AS P ON PC.producto = P.id_producto
			LIMIT pagina, limite;
END$$
		
-- EVENTOS
-- EVENTO QUE CADA DÍA ACTUALIZA LAS SUSCRIPCIONES SI YA SE PASARON DE FECHA (SI TIENE RENOVAR LE AÑADE EL TIEMPO Y SI NÓ LE BORRA LA SUSCRIPCIÓN)
DROP EVENT IF EXISTS actualizar_suscripciones$$
CREATE EVENT IF NOT EXISTS actualizar_suscripciones
	-- LE DECIMOS QUE HAGA EL EVENTO CADA DÍA A LAS 4 DE LA MAÑANA
	ON SCHEDULE EVERY 1 DAY
	STARTS (TIMESTAMP(NOW()) + INTERVAL 1 DAY + INTERVAL 4 HOUR)
	DO 
		-- LLAMAMOS AL PROCEDIMIENTO PARA ACTUALIZAR LAS SUSCRIPCIONES, LO HACEMOS DE ESTA FORMA YA QUE ES ALGO RUTINARIO, ASÍ SE EJECUTA MÁS RÁPIDO Y ADEMÁS ES UNA TRANSACCIÓN
		CALL actualizar_suscripciones()$$
	
-- Activamos el evento	
-- SET GLOBAL event_scheduler=ON$$
DELIMITER ;
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

INSERT INTO productos
	(nombre, precio, stock, imagen_producto, tipo_producto) 
		VALUES 
	("Catán", 40, 50, "../img/juegos/catan.jpg", "juego"),
	("Bienvenido a la mazmorra", 15, 25, "../img/juegos/bienvenidoAlaMazmorra.jpg", "juego"),
	("Código Secreto", 19 , 100, "../img/juegos/codigoSecreto.png", "juego"),
	("Timeline", 12 , 80, "../img/juegos/timeline.jpg", "juego"),
	("Patchwork",  18 , 20, "../img/juegos/patchwork.jpg", "juego"),
	("Mondrian",25,50, "../img/imagenNoDisponible.jpg", "juego"),
	("Osopark", 27 , 50, "../img/juegos/Osopark.jpg", "juego"),
	("Torre de gatos", 18 , 50, "../img/juegos/Torredegatos.jpg", "juego"),
	("Demon Worker",28,50, "../img/juegos/DemonWorker.jpg", "juego"),
	("Vampiro: La Mascarada 5ª edición",40,50, "../img/juegos/Vampiro_LaMascarada.jpg", "juego"),
	("Maho Shojo",30,50, "../img/imagenNoDisponible.jpg", "juego"),
	("Luna Capital",35,50, "../img/imagenNoDisponible.jpg", "juego"),
	("Plata",10,50, "../img/imagenNoDisponible.jpg", "juego"),
	("Lapsus",14,50, "../img/imagenNoDisponible.jpg", "juego"),
	("The Game",14,50, "../img/imagenNoDisponible.jpg", "juego"),
	("Not Alone", 18,50, "../img/imagenNoDisponible.jpg", "juego"),
	("Space Opera",26,50, "../img/imagenNoDisponible.jpg", "juego"),
	("4 Seasons",14,50, "../img/juegos/4Seasons.jpg", "juego"),
	("Sword Art Online: Sword of fellows",27,50, "../img/juegos/SwordArtOnline_Swordoffellows.jpg", "juego"),
	("Axio",30,50,  "../img/juegos/Axio.jpg", "juego"),
	("Trapwords",10,50, "../img/imagenNoDisponible.jpg", "juego"),
	("One key",22,50, "../img/imagenNoDisponible.jpg", "juego"),
	("On the origin of species",18,50, "../img/juegos/Ontheoriginofspecies.jpg", "juego"),
	("Wingspan", 27,50, "../img/juegos/Wingspan.jpg", "juego"),
	("The Magnificient",50,50, "../img/imagenNoDisponible.jpg", "juego"),
	("Cat Café",15,50, "../img/juegos/Catcafe.jpg", "juego"),
	("Kitchen rush",46,50, "../img/juegos/Kitchenrush.jpg", "juego"),
		-- accesorios
	("Dado de 20 caras", 1,200, "../img/accesorios/Dado20Caras.jpg", 'accesorio'),
	("Fundas de cartas", 5,200, "../img/accesorios/FundaCartas.jpg", 'accesorio'),
	("Set oceano de dados", 50,70, "../img/accesorios/dadosSetAzul.jpg", 'accesorio'),
	("Bolsa Wingspan", 20,30, "../img/accesorios/BolsaWingspan.jpg", 'accesorio'),
	("Bolsa dragon", 9,60, "../img/accesorios/bolsaDragon.jpg", 'accesorio'),
	("Libreta Demon Workers", 15,75, "../img/accesorios/LibretaDomWorkers.jpg", 'accesorio'),
	("Taza 4 Seasons", 25,45, "../img/accesorios/Taza4Seasons.jpg", 'accesorio');

INSERT INTO juegos
    (juego, num_jug, genero) 
		VALUES
    (1, "3-4", "Estrategia"),
    (2,  "2-4", "Competitivo"),
    (3,  "2-8", "Competitivo"),
    (4, "2-8", "Cartas"),
    (5, "2", "Estrategia"),
    (6,  "2-4", "Abstracto"),
    (7, "2-4", "Gestión"),
    (8, "2-4", "Competitivo"),
    (9, "3-4", "Competitivo"),
    (10,  "2-8","Terror"),
    (11, "3-6", "Anime"),
    (12, "1-4", "Estrategia"),
    (13, "2-6", "Competitivo"),
    (14, "2-8", "Abstracto"),
    (15, "1-5", "Abstracto"),
    (16, "2-7", "Terror"),
    (17, "2-4", "Estrategia"),
    (18,"1-4", "Cartas"),
    (19,"2","Anime"),
    (20,"2-4", "Losetas"),
    (21, "4-8", "Dungeon Crawler"),
    (22,"2-6", "Cartas"),
    (23, "2-4", "Estrategia"),
    (24, "1-5", "Deck Building"),
    (25,  "1-4", "Competitivo"),
    (26,"2-4", "Competitivo"),
    (27, "1-4", "Familiar");

	INSERT INTO cajas_sorpresa
	(fecha, img_caja, unidades)
	VALUES
	("2021-12-23", "../img/cajasSorpresa/20211223.jpg", 30),
	("2022-01-12", "../img/cajasSorpresa/20220112.jpg", 45),
	("2022-02-01", "../img/cajasSorpresa/20220201.jpg", 60);

	INSERT INTO cajas_sorpresa_producto
	(caja_sorpresa, producto)
	VALUES
	(1, 9),
	(1, 29),
	(1, 33),
	(2, 24),
	(2, 32),
	(2, 30),
	(2, 31),
	(3, 18),
	(3, 34);

	INSERT INTO `tematicas` 
	() VALUES 
	('San valentín'), 
	('Verano'),
	('Navidad'),
	('Halloween');