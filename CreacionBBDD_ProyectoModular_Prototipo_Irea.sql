DROP DATABASE IF EXISTS PROYECTO_MODULAR;
CREATE DATABASE IF NOT EXISTS PROYECTO_MODULAR;
USE PROYECTO_MODULAR;

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
    TIPO_PRODUCTO ENUM("Juego de mesa", "Accesorio") NOT NULL,
    DESCRIPCION VARCHAR(255) NULL,
    GENERO SET("Detectives","Estrategia","Guerra","Miedo","Puzzles","Cooperativos", "Individual","Competitivo") NOT NULL,
    TEMATICA ENUM("San Valentín", "Carnaval", "Verano", "Halloween", "Navidad", "Día de los inocentes") NULL,
    /** KEY Y CONSTRAINS **/
    PRIMARY KEY (ID_PRODUCTO),
    UNIQUE INDEX AK_NOMBRE (NOMBRE) /** PODRÍAN EXISTIR DOS JUEGOS CON EL MISMO NOMBRE (???) **/
) ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA CAJAS_SORPRESA
-- ---------------------------------------------------
DROP TABLE IF EXISTS CAJAS_SORPRESA;
CREATE TABLE IF NOT EXISTS CAJAS_SORPRESA (
	ID_CAJA INT UNSIGNED AUTO_INCREMENT NOT NULL,
    TEMATICA ENUM("San Valentín", "Carnaval", "Verano", "Halloween", "Navidad", "Día de los inocentes") NULL,
    NUM_JUG VARCHAR(4) NOT NULL,
    FECHA DATE NOT NULL,
    /** KEY Y CONSTRAINS **/
    PRIMARY KEY (ID_CAJA),
    UNIQUE INDEX AK_FECHA (FECHA) /** PUEDE SER QUE CONSUMA DEMASIADOS RECURSOS AUNQUE AGILICE LA BÚSQUEDA (??) **/
) ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA CAJAS_SORPRESA_PRODUCTO
-- ---------------------------------------------------
DROP TABLE IF EXISTS CAJAS_SORPRESA_PRODUCTO;
CREATE TABLE IF NOT EXISTS CAJAS_SORPRESA_PRODUCTO (
	CAJA_SORPRESA INT UNSIGNED AUTO_INCREMENT NOT NULL,
    PRODUCTO INT UNSIGNED AUTO_INCREMENT NOT NULL,
    /** KEY Y CONSTRAINS **/
    UNIDADES TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (CAJA_SORPRESA,PRODUCTO)
) ENGINE INNDOB;

-- ---------------------------------------------------
--				TABLA SUSCRIPCIONES
-- ---------------------------------------------------
DROP TABLE IF EXISTS SUSCRIPCIONES;
CREATE TABLE IF NOT EXISTS SUSCRIPCIONES (
	DURACION INT UNSIGNED NOT NULL,
    PRECIO FLOAT NOT NULL,
    /** KEYS Y CONSTRAINS **/
    PRIMARY KEY (DURACION)
)ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA USUARIO
-- ---------------------------------------------------
DROP TABLE IF EXISTS USUARIOS;
CREATE TABLE IF NOT EXISTS USUARIOS (
	ID_USUARIO INT UNSIGNED NOT NULL,
    EMAIL VARCHAR(150) NOT NULL,
    PWD VARCHAR(255) NOT NULL,
    TELEFONO CHAR(11) NULL,
    FECHA_REGISTRO DATE NOT NULL,
    DIRECCION VARCHAR(150) NULL,
    GENERO_FAVORITO  ENUM("Detectives","Estrategia","Guerra","Miedo","Puzzles","Cooperativos", "Individual","Competitivo") NULL,
    /** RELACIONES **/
    SUSCRIPCION INT UNSIGNED NULL,
    FECHA_INICIO_SUSCRIPCION DATE NULL, /** NECESITA UN DISPARADOR QUE COMPRUEBE QUE NO TENGA SUSCRIPCIÓN SIN MARCAR LA FECHA DE INICIO **/
    RENOVAR_SUSCRIPCION BOOLEAN NULL,
    /** KEYS Y CONSTRAINS **/
    PRIMARY KEY (ID_USUARIO),
    UNIQUE INDEX AK_EMAIL (EMAIL),
    FOREIGN KEY FK_SUSCRIPCION (SUSCRIPCION) REFERENCES SUSCRIPCIONES (DURACION)
		ON DELETE RESTRICT /** SI UN USUARIO TIENE UNA SUSCRIPCIÓN, ESA SUSCRIPCIÓN NO SE DEBE BORRAR **/
        ON UPDATE CASCADE
) ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA USUARIO_REGISTRADO
-- ---------------------------------------------------
DROP TABLE IF EXISTS USUARIO_REGISTRADO;
CREATE TABLE IF NOT EXISTS USUARIO_REGISTRADO (
	ID_USUARIO_REGISTRADO INT UNSIGNED NOT NULL,
    /** KEYS Y CONSTRAINS **/
    PRIMARY KEY (ID_USUARIO_REGISTRADO),
    FOREIGN KEY FK_USUARIO_REGISTRADO (ID_USUARIO_REGISTRADO) REFERENCES USUARIOS (ID_USUARIO)
		ON DELETE CASCADE	
        ON UPDATE CASCADE
)ENGINE INNODB;
    
-- ---------------------------------------------------
--				TABLA ADMINISTRADORES
-- ---------------------------------------------------
DROP TABLE IF EXISTS ADMINISTRADORES;
CREATE TABLE IF NOT EXISTS ADMINISTRADORES (
	ID_ADMINISTRADOR INT UNSIGNED NOT NULL,
    /** KEYS Y CONSTRAINS **/
    PRIMARY KEY (ID_ADMINISTRADOR),
    FOREIGN KEY FK_ADMINISTRADOR (ID_ADMINISTRADOR) REFERENCES USUARIOS (ID_USUARIO)
		ON DELETE CASCADE	
        ON UPDATE CASCADE
)ENGINE INNODB;
    

-- ---------------------------------------------------
--				TABLA PEDIDO
-- ---------------------------------------------------
DROP TABLE IF EXISTS PEDIDO;
CREATE TABLE IF NOT EXISTS PEDIDO(
	ID_PEDIDO INT UNSIGNED NOT NULL,
    PRECIO FLOAT NOT NULL,
    DIRECCION VARCHAR(150) NOT NULL,
    /** RELACIONES **/
    USUARIO_PEDIDO INT UNSIGNED NOT NULL,
    FECHA_PEDIDO DATE NOT NULL,
    FECHA_ENTREGA DATE NOT NULL,
    ENTREGADO BOOLEAN NULL,
    /** KEYS Y CONSTRAINS **/
    PRIMARY KEY (ID_PEDIDO),
    FOREIGN KEY FK_USUARIO_PEDIDO (USUARIO_PEDIDO) REFERENCES USUARIOS (ID_USUARIO)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA PEDIDO_PRODUCTO
-- ---------------------------------------------------
DROP TABLE IF EXISTS PEDIDO_PRODUCTO;
CREATE TABLE IF NOT EXISTS PEDIDO_PRODUCTO (
	PEDIDO INT UNSIGNED NOT NULL,
    PRODUCTO INT UNSIGNED AUTO_INCREMENT NOT NULL,
    UNIDADES TINYINT UNSIGNED NOT NULL,
    /** KEYS Y CONSTRAINS **/
    PRIMARY KEY (PEDIDO, PRODUCTO),
    FOREIGN KEY FK_PEDIDO (PEDIDO) REFERENCES PEDIDOS (ID_PEDIDO)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY FK_PRODUCTO (PRODUCTO) REFERENCES PRODUCTOS (ID_PRODUCTO)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA PARTIDAS
-- ---------------------------------------------------
DROP TABLE IF EXISTS PARTIDAS;
CREATE TABLE IF NOT EXISTS PARTIDAS (
	ID_PARTIDA INT UNSIGNED NOT NULL,
    PLAZAS_MIN TINYINT NOT NULL,
    PLAZAS_TOTALES TINYINT NOT NULL,
    FECHA DATE NOT NULL,
    HORA_INICIO TIME(0) NOT NULL,
    DURACION SMALLINT NOT NULL,
    GENERO_PARTIDA ENUM("Detectives","Estrategia","Guerra","Miedo","Puzzles","Cooperativos", "Individual","Competitivo") NULL,
    /** RELACIONES **/
    DIRECTOR_PARTIDA INT UNSIGNED NOT NULL,
    JUEGO_PARTIDA INT UNSIGNED AUTO_INCREMENT NOT NULL,
    /** KEYS Y CONSTRAINS **/
    PRIMARY KEY (ID_PARTIDA),
    FOREIGN KEY FK_DIRECTOR_PARTIDA (DIRECTOR_PARTIDA) REFERENCES ADMINISTRADORES (ID_ADMINISTRADOR)
		ON DELETE RESTRICT
        ON UPDATE CASCADE,
	FOREIGN KEY FK_JUEGO_PARTIDA (JUEGO_PARTIDA) REFERENCES PRODUCTOS (ID_PRODUCTO)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE INNODB;

-- ---------------------------------------------------
--				TABLA RESERVAR_PARTIDAS
-- ---------------------------------------------------
DROP TABLE IF EXISTS RESERVAR_PARTIDAS;
CREATE TABLE IF NOT EXISTS RESERVAR_PARTIDAS (
	USUARIO INT UNSIGNED NOT NULL,
    PARTIDA INT UNSIGNED NOT NULL,
    /** KEYS Y CONSTRAINS **/
    PRIMARY KEY (USUARIO,PARTIDA),
    FOREIGN KEY FK_USUARIO_RESERVO (USUARIO) REFERENCES USUARIO_REGISTRADO (ID_USUARIO_REGISTRADO)
		ON DELETE RESTRICT /** SI UN USUARIO QUIERE BORRAR SU CUENTA CON UNA PARTIDA RESERVADA, NO LE DEJARÁ HASTA QUE CANCELE LA RESERVA **/
        ON UPDATE CASCADE,
	FOREIGN KEY FK_PARTIDA_RESERVADA (PARTIDA) REFERENCES PARTIDAS (ID_PARTIDA)
		ON DELETE RESTRICT	/** MIENTRAS HAYA PARTIDAS RESERVADAS NO SE PODRÁ BORRAR LA PARTIDA **/
        ON UPDATE CASCADE
) ENGINE INNODB;
