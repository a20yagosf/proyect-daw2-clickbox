-- Le indicamos al script que vamos a usar la bd del proyecto
USE proyecto_modular;

-- Como voy a realizar varias operaciones comienzo una transaccion
START TRANSACTION;
-- Insertamos  todos los productos y asignamos géneros a los productos
-- A continuación añadir los productos en su respectivo campo JUEGOS o ACCESORIOS
-- NOTA: En un futuro se debe añadir descripciones a cada juego.
-- (NOMBRE, NUM_JUG, PRECIO, STOCK, DESCRIPCION, TEMATICA) 
-- NOTA: CAMBIAR EL FILTRO DE NUM JUGADORES EN LA TIENDA HASTA 2 JUGADORES - HASTA 4 JUGADORES - HASTA MÁS DE 4
INSERT INTO PRODUCTOS
	(NOMBRE, NUM_JUG, PRECIO, STOCK) 
		VALUES 
	("Catán", "3-4","40","50"),
	("Bienvenido a la mazmorra", "2-4","15","25"),
    ("Código Secreto", "2-8","19","100"),
    ("Timeline", "2-8","12","80"),
    ("Patchwork", "2","18","20"),
    ("Mondrian", "2-4","25","50"),
    ("Osopark", "2-4","27","50"),
    ("Kitchen rush", "1-4","46","50"),
    ("Torre de gatos", "2-4","18","50"),
    ("Demon Worker", "3-4","28","50"),
    ("Vampiro: La Mascarada 5ª edición", "2-8","40","50"),
    ("Maho Shojo", "3-6","30","50"),
    ("Luna Capital", "1-4","35","50"),
    ("Plata", "2-6","10","50"),
    ("Lapsus", "2-8","14","50"),
    ("The Game", "1-5","14","50"),
    ("Not Alone", "2-7","18","50"),
    ("Space Opera", "2-4","26","50"),
    ("4 Seasons", "2","14","50"),
    ("Sword Art Online: Sword of fellows", "1-4","27","50"),
    ("Axio", "2-4","30","50"),
    ("Trapwords", "4-8","10","50"),
    ("One key", "2-6","22","50"),
    ("On the origin of species", "2-4","18","50"),
    ("Wingspan", "1-5","27","50"),
    ("The Magnificient", "1-4","50","50"),
    ("Cat Café", "2-4","15","50"),
    ("Kitchen rush", "1-4","46","50"),
    -- accesorios
    ("Dado de 20 caras","NO","1","200"),
    ("Fundas de cartas","NO","5","200")

	


COMMIT;