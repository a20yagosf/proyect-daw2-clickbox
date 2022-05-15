<?php
use \Usuarios\Administrador as admin;
use \Usuarios\Usuario as user;
require_once "autocarga.php";
session_start(); // iniciamos sesión
try {
    // Cogemos los datos que enviamos por el POST, como vienen  en formato JSON lo cogemos con la funcion file_get_contents
    $datosUsuario = json_decode(file_get_contents("php://input"), true);
    //Comprobamos que tenga iniciada sesión
    if($_SESSION["usuario"] == null){
        $devolver = ["noUser" => "No es un usuairo"];
    }
    else if(isset($datosUsuario["usuario"])){
        $user = new user($_SESSION["usuario"]["email"]);
        $devolver = $user->cargarHistorial($datosUsuario["usuario"]);
    }
    else if(isset($datosUsuario["historial"])){
        $user = new user($_SESSION["usuario"]["email"]);
        $devolver = $user->masDetallesHistorial($datosUsuario["historial"]);
    }
    else if(isset($datosUsuario["admin"])) {
        //Comprobamos que sea administrador
        if($_SESSION["usuario"]["rol"] != 1){
            $devolver = ["noAdmin" => "No es un admin"];
        }
        else {
            //Instanciamos el administrador
            $admin = new admin($_SESSION["usuario"]["email"], $_SESSION["usuario"]["rol"]);
            //Cargamos el historial
            $devolver = $admin->cargarHistorial($datosUsuario["admin"], false);
        }
    }
}
catch (\PDOException $pdoError) {
    $devolver = ["error" => "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage()];
} catch (\Exception $error) {
    $devolver = ["error" => "Error " . $error->getCode() . ": " . $error->getMessage()];
}
echo json_encode($devolver);