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
    ("CÓDIGO SECRETO", "2-8","19","100"),
    ("TIMELINE", "2-8","12","80"),
    ("PATCHWORK", "2","18","20"),
    ("MONDRIAN", "2-4","25","50"),
    ("OSOPARK", "2-4","27","50"),
    ("KITCHEN RUSH", "1-4","46","50"),
    ("TORRE DE GATOS", "2-4","18","50"),
    ("DEMON WORKER", "3-4","28","50"),
    ("VAMPIRO: LA MASCARADA 5ª EDICIÓN", "2-8","40","50"),
    ("MAHO SHOJO", "3-6","30","50"),
    ("LUNA CAPITAL", "1-4","35","50"),
    ("PLATA", "2-6","10","50"),
    ("LAPSUS", "2-8","14","50"),
    ("THE GAME", "1-5","14","50"),
    ("NOT ALONE", "2-7","18","50"),
    ("SPACE OPERA", "2-4","26","50"),
    ("4 SEASONS", "2","14","50"),
    ("SWORD ART ONLINE: SWORD OF FELLOWS", "1-4","27","50"),
    ("AXIO", "2-4","30","50"),
    ("TRAPWORDS", "4-8","10","50"),
    ("ONE KEY", "2-6","22","50"),
    ("ON THE ORIGIN OF SPECIES", "2-4","18","50"),
    ("WINGSPAN", "1-5","27","50"),
    ("THE MAGNIFICIENT", "1-4","50","50"),
    ("CAT CAFÉ", "2-4","15","50"),
    ("KITCHEN RUSH", "1-4","46","50"),
    -- accesorios
    ("DADO DE 20 CARAS","NO","1","200")

	


COMMIT;