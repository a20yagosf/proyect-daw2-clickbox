<?php
use \Infraestructuras\Bd as bd;

require_once "autocarga.php";

//Cogemos los datos
$datosTienda = json_decode(file_get_contents("php://input"), true);
//Instanciamos bd
$bd = new bd();
try {
    //Comprobamos si pide el último artículo
    if(isset($datosTienda["ultimoProducto"])){
        //Cargamos las cajas
        $devolver = $bd->ultimoProducto($datosTienda["ultimoProducto"]);
        $devolver = ["productos" => $devolver];
    }
}
catch(\PDOException $pdoError){
    $devolver = ["error" => $pdoError];
}
catch(\Exception $error){
    $devolver = ["error" => $error];
}
//Ponemos la cabecera
header("Content-type: application/json");
$bd->codificarArrayUtf8($devolver);
$mensajeCod =  json_encode($devolver);
echo $mensajeCod;