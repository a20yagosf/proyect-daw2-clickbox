-- Le indicamos al script que vamos a usar la bd del proyecto
USE a2da_clickbox;

-- Como voy a realizar varias operaciones comienzo una transaccion
START TRANSACTION;
-- Insertamos  todos los productos y asignamos géneros a los productos
-- A continuación añadir los productos en su respectivo campo JUEGOS o ACCESORIOS
-- NOTA: En un futuro se debe añadir descripciones a cada juego.
-- (NOMBRE, NUM_JUG, PRECIO, STOCK, DESCRIPCION, TEMATICA) 
-- NOTA: CAMBIAR EL FILTRO DE NUM JUGADORES EN LA TIENDA HASTA 2 JUGADORES - HASTA 4 JUGADORES - HASTA MÁS DE 4
INSERT INTO productos
	(nombre, precio, stock, imagen_producto) 
		VALUES 
	("Catán", 40, 50, "../img/juegos/catan.jpg"),
	("Bienvenido a la mazmorra", 15, 25, "../img/juegos/bienvenidoAlaMazmorra.jpg"),
  ("Código Secreto", 19 , 100, "../img/juegos/codigoSecreto.png"),
  ("Timeline", 12 , 80, "../img/juegos/timeline.jpg"),
  ("Patchwork",  18 , 20, "../img/juegos/patchwork.jpg"),
  ("Mondrian",25,50, "../img/imagenNoDisponible.jpg"),
  ("Osopark", 27 , 50, "../img/juegos/Osopark.jpg"),
  ("Torre de gatos", 18 , 50, "../img/juegos/Torredegatos.jpg"),
  ("Demon Worker",28,50, "../img/juegos/DemonWorker.jpg"),
  ("Vampiro: La Mascarada 5ª edición",40,50, "../img/juegos/Vampiro_LaMascarada.jpg"),
  ("Maho Shojo",30,50, "../img/imagenNoDisponible.jpg"),
  ("Luna Capital",35,50, "../img/imagenNoDisponible.jpg"),
  ("Plata",10,50, "../img/imagenNoDisponible.jpg"),
  ("Lapsus",14,50, "../img/imagenNoDisponible.jpg"),
  ("The Game",14,50, "../img/imagenNoDisponible.jpg"),
  ("Not Alone", 18,50, "../img/imagenNoDisponible.jpg"),
  ("Space Opera",26,50, "../img/imagenNoDisponible.jpg"),
  ("4 Seasons",14,50, "../img/juegos/4Seasons.jpg"),
  ("Sword Art Online: Sword of fellows",27,50, "../img/juegos/SwordArtOnline_Swordoffellows.jpg"),
  ("Axio",30,50,  "../img/juegos/Axio.jpg"),
  ("Trapwords",10,50, "../img/imagenNoDisponible.jpg"),
  ("One key",22,50, "../img/imagenNoDisponible.jpg"),
  ("On the origin of species",18,50, "../img/juegos/Ontheoriginofspecies.jpg"),
  ("Wingspan", 27,50, "../img/juegos/Wingspan.jpg"),
  ("The Magnificient",50,50, "../img/imagenNoDisponible.jpg"),
  ("Cat Café",15,50, "../img/juegos/Catcafe.jpg"),
   ("Kitchen rush",46,50, "../img/juegos/Kitchenrush.jpg"),
    -- accesorios
  ("Dado de 20 caras", 1,200, "../accesorios/Dado20Caras.jpg"),
  ("Fundas de cartas", 5,200, "../accesorios/FundaCartas.jpg");

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

INSERT INTO accesorios
    (accesorio) 
		VALUES
    (28),
    (29);

  INSERT INTO partidas
    (plazas_min, plazas_totales, fecha, hora_inicio, duracion, imagen_partida, director_partida, juego_partida)
    VALUES
    (2, 5, "2022-06-12", TIME("15:30:22"), 30, "../img/juegos/Axio.jpg", "irea.vila.ramilo@gmail.com", 2);
    
COMMIT;

/**
id_partida INT UNSIGNED AUTO_INCREMENT NOT NULL,
   plazas_min TINYINT NOT NULL,
   plazas_totales TINYINT NOT NULL,
   fecha DATE NOT NULL,
   hora_inicio TIME(0) NOT NULL,
   duracion SMALLINT NOT NULL,
   imagen_partida VARCHAR(250) NOT NULL,
   -- RELACIONES 
   director_partida VARCHAR(150) NOT NULL,
   juego_partida INT UNSIGNED NOT NULL,
   -- KEYS Y CONSTRAINS 
   PRIMARY KEY (id_partida),
   FOREIGN KEY (director_partida) REFERENCES usuarios (email)
		ON DELETE RESTRICT
      ON UPDATE CASCADE,
	FOREIGN KEY (juego_partida) REFERENCES juegos (juego)
  **/