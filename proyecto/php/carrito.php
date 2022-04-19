<?php
require "autocarga.php";
session_start();

use \Usuarios\Usuario as user;

try {
    //Comprobamos que sea un usuario registrado
    if(!isset($_SESSION["usuario"])){
        throw new \Exception("Debe iniciar sesión para acceder al carrito");
    }

    //Cogemos los datos que vienen del post como un array asociativo
    $peticion = json_decode(file_get_contents("php://input"), true);

    //Instanciamos al usuario
    $usuario = new user($_SESSION["usuario"]["email"]);

    //Comprobamos cual es la petición
    if(isset($peticion["numArticulos"])) {
        $devolver = $usuario->getNumArticulos();
    }
    //Cargar carrito
    else if(isset($peticion["cargarCarrito"])) {
        $devolver = ["carrito" => $usuario->getCarrito($peticion["cargarCarrito"])];
    }
    //GuardarProducto
    else if(isset($peticion["guardarProducto"])) {
        $devolver = ["carrito" => $usuario->actualizarCarrito($peticion["guardarProducto"])];
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