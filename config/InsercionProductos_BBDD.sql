-- Le indicamos al script que vamos a usar la bd del proyecto
USE proyecto_modular;

-- Como voy a realizar varias operaciones comienzo una transaccion
START TRANSACTION;
-- Insertamos primero todos los productos

-- Para a continuación añadirlos en su respectivo campo JUEGOS o ACCESORIOS
-- También tendremos que unir los productos con su género en productos_generos

-- NOTA: En un futuro se debe añadir descripciones a cada juego.
-- (NOMBRE, NUM_JUG, PRECIO, STOCK, DESCRIPCION, TEMATICA) 

-- NOTA: CAMBIAR EL FILTRO DE NUM JUGADORES EN LA TIENDA HASTA 2 JUGADORES - HASTA 4 JUGADORES - HASTA MÁS DE 4
INSERT INTO PRODUCTOS
	(NOMBRE, NUM_JUG, PRECIO, STOCK, TEMATICA) 
		VALUES 
	("CATÁN", "3-4","40","50","CIVILIZACION"),
	("BIENVENIDO A LA MAZMORRA", "2-4","15","25","FANTASIA"),
    ("CÓDIGO SECRETO", "2-8","19","100","ESPIAS"),
    ("TIMELINE", "2-8","12","80","HISTORIA"),
    ("PATCHWORK", "2","18","20","ARTISTICO"),
    ("MONDRIAN", "2-4","25","50","ARTISTICO"),
    ("OSOPARK", "2-4","27","50","ANIMALES"),
    ("KITCHEN RUSH", "1-4","46","50","COCINA"),
    ("TORRE DE GATOS", "2-4","18","50","ANIMALES"),
    ("DEMON WORKER", "3-4","28","50","MONSTRUOS"),
    ("VAMPIRO: LA MASCARADA 5ª EDICIÓN", "2-8","40","50","MONSTRUOS"),
    ("MAHO SHOJO", "3-6","30","50","ANIME"),
    ("LUNA CAPITAL", "1-4","35","50","CIFI"),
    ("PLATA", "2-6","10","50","VIEJO OESTE"),
    ("LAPSUS", "2-8","14","50","ABSTRACTO"),
    ("THE GAME", "1-5","14","50","ABSTRACTO"),
    ("NOT ALONE", "2-7","18","50","CIFI"),
    ("SPACE OPERA", "2-4","26","50","CIFI"),
    ("4 SEASONS", "2","14","50","ARTISTICO"),
    ("SWORD ART ONLINE: SWORD OF FELLOWS", "1-4","27","50","ANIME"),
    ("AXIO", "2-4","30","50","ABSTRACTO"),
    ("TRAPWORDS", "4-8","10","50","FANTASIA"),
    ("ONE KEY", "2-6","22","50","ARTISTICO"),
    ("ON THE ORIGIN OF SPECIES", "2-4","18","50","HISTORIA"),
    ("WINGSPAN", "1-5","27","50","ANIMALES"),
    ("THE MAGNIFICIENT", "1-4","50","50","ARTISTICO"),
    ("CAT CAFÉ", "2-4","15","50","ANIMALES");

	


COMMIT;