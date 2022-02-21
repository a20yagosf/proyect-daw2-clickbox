<?php
/**
 * Función que carga de manera automática las clases mediante el namespace
 *
 * @param   string  $clase  Clase a cargar
 *
 * @return  mixed          Fichero a cargar o el error de que no existe ese fichero
 */
spl_autoload_register(function ($clase) {
    //Cambiamos la barra del namespace por la barra del directory separatos
    $clase = str_replace("/", DIRECTORY_SEPARATOR, $clase);
    $fichero = __DIR__ . DIRECTORY_SEPARATOR . $clase . ".php";
    //Comprobamos que exista el fichero
    if(is_file($fichero)){
        require_once $fichero;
    }
    else {
        echo "No existe el fichero " . $fichero;
    }
});