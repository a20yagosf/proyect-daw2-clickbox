<?php

require_once "autocarga.php";

use \Infraestructuras\Bd as bd;
//Cogemos los datos que vienen por php
try {
    //Instanciamos bd
    $bd = new bd();
    $devolver = $bd->cargarGeneros();
    $devolver = ["exito" => $devolver];
    if(!is_array($devolver)){
        throw new \PDOException($devolver);
    }
}
catch(\PDOException $pdoError) {
    $devolver = ["error" =>  $error->getMessage()];
}
catch(\Exception $error) {
    $devolver = ["error" =>  $error->getMessage()];
}
echo json_encode($devolver);