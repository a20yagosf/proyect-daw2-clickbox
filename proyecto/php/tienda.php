<?php
use \Infraestructuras\Bd as bd;
use \Usuarios\Usuario as user;

require_once "autocarga.php";

session_start();

//Cogemos los datos
$datosTienda = json_decode(file_get_contents("php://input"), true);
//Instanciamos bd
$bd = new bd();
try {
    //Comprobamos si pide el último artículo
    if(isset($datosTienda["ultimoProducto"])){
        //Cargamos los últimos productos para el alert
        $devolver = $bd->ultimoProducto($datosTienda["ultimoProducto"]);
        //$devolver = ["productos" =>$devolver];
        $devolver = $devolver;
    }
    else if (isset($datosTienda["id_producto"])) {
        if(!isset($_SESSION["usuario"]["email"])) {
            throw new \Exception("El usuario no está registrado");
        }
        $usuario = new user($_SESSION["usuario"]["email"]);
        $devolver = $usuario->comprarArticulo($datosTienda);
        $devolver = ["exito" => true];
    }
    //Devolvemos todos los productos
    else {
        $devolver = $bd->filtrarTienda($datosTienda);
        //Compruebo que me devolviera algo
        if(!is_array($devolver)){
            throw new \Exception($devolver);
        }
    }
}
catch(\PDOException $pdoError){
    $devolver = ["error" => $pdoError];
}
catch(\Exception $error){
    $devolver = ["error" => $error];
}
//Ponemos la cabecera
//header("Content-type: application/json");
$bd->codificarArrayUtf8($devolver);
$mensajeCod =  json_encode($devolver);
echo $mensajeCod;