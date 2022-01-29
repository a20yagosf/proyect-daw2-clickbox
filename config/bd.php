<?php

function conectarBD() {
    //Leo la configuración del archivo XML para conseguir la ip, base de datos, usuario y contraseña

}

function leerConfig($ficheroConfig, $ficheroSchema){
    //Creo un documento
    $config = new DOMDocument();
    //Cargo el fichero XML
    $config->load($ficheroConfig);
    //Lo valido con el fichero de schema
    $resultado = $config->schemaValidate($ficheroSchema);
    //Si es falso devuelvo false
    if(!$resultado){
        throw new InvalidArgumentException("Revise el fichero de configuración");
    }
    //Si llega hasta aquí es que la validación tuvo éxito
    //Cargo el fichero xml
    $fichero = simplexml_load_file($ficheroConfig);
    //Cojo cada uno de los datos con xpath
    $ip = $fichero->xpath("//ip");
    $nombreBd = $fichero->xpath("//");
}
?>