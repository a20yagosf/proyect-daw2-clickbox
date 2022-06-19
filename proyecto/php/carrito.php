<?php
require "autocarga.php";
session_start();

use \Usuarios\Usuario as user;

try {

    //Cogemos los datos que vienen del post como un array asociativo
    $peticion = json_decode(file_get_contents("php://input"), true);
    

    //Comprobamos que sea un usuario registrado
    if(!isset($_SESSION["usuario"])){
        if(isset($peticion["cargarCarritoLocal"])) {
            //Instanciamos al usuario
            $usuario = new user("");
            //Limpiamos por si hay algún valor 0
            $peticion["cargarCarritoLocal"]["productos"] = array_filter($peticion["cargarCarritoLocal"]["productos"], function ($array) { return $array > 0;});
            $devolver = $usuario->getCarritoLocal($peticion["cargarCarritoLocal"]);
            if(count($devolver["productos"]) == 0) $devolver["vacio"] = true;
        }
        else {
            throw new \Exception("Debe iniciar sesión para acceder al carrito");
        }
    }
    else {
        //Instanciamos al usuario
        $usuario = new user($_SESSION["usuario"]["email"]);
    }
    //Comprobamos cual es la petición
    if(isset($peticion["numArticulos"]) && !isset($peticion["cargarCarritoLocal"])) {
        $devolver = $usuario->getNumArticulos();
    }
    //Cargar carrito
    else if(isset($peticion["cargarCarrito"]) && !isset($peticion["cargarCarritoLocal"])) {
        $devolver = $usuario->getCarrito($peticion["cargarCarrito"]);
        if(count($devolver["productos"]) == 0) $devolver["vacio"] = true;
    }
    else if(isset($peticion["guardarCarrito"]) && !isset($peticion["cargarCarritoLocal"])) { //gardarCarrito
        $devolver = $usuario->guardarCarrito($peticion["guardarCarrito"]);
    }
    //GuardarProducto
    else if(isset($peticion["guardarProducto"]) && !isset($peticion["cargarCarritoLocal"])) {
        $devolver = ["carrito" => $usuario->actualizarCarrito($peticion["guardarProducto"])];
    }
    //Vacia el carrito
    else if(isset($peticion["vaciarCarrito"]) && !isset($peticion["cargarCarritoLocal"])) {
        $devolver = $usuario->vaciarCarrito();
    }
    //Genera la factura del carrito
    else if(isset($peticion["direccion"]) && !isset($peticion["cargarCarritoLocal"])) {
        $devolver = $user->crearPedido($peticion["procesarPedido"]);
    }
    if(!isset($devolver)){
        $devolver = ["error" => "No se pudo acceder al método"];
    }
}
catch(\PDOException $pdoError){
    $devolver = ["error" => $pdoError->getMessage()];
}
catch(\RuntimeException $rnError){
    $devolver = ["noSesion" => $rnError->getMessage()];
}
catch(\Exception $error){
    $devolver = ["error" => $error->getMessage()];
}
catch(\Error $err){
    $devolver = ["error" => $err->getMessage()];
}
echo json_encode($devolver);