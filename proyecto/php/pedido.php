<?php
require "autocarga.php";
session_start();

use \Usuarios\Usuario as user;

try {
    //Comprobamos que sea un usuario registrado
    if(!isset($_SESSION["usuario"])){
        throw new \Exception("Debe iniciar sesión para acceder al carrito");
    }

    //var_dump($_SESSION, 1);

    //Cogemos los datos que vienen del post como un array asociativo
    $peticion = $_POST;

    //Instanciamos al usuario
    $usuario = new user($_SESSION["usuario"]["email"]);

    //Genera la factura del carrito
    if(isset($peticion["direccion"])) {
        $id_pedido = $usuario->crearPedido($peticion["id_carrito"], $peticion["direccion"]);
        $usuario->generarFacturaPedido($id_pedido, $peticion["direccion"]);
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
//echo json_encode($devolver);