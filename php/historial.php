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
    if(isset($datosUsuario["usuario"])){
        $user = new user($_SESSION["usuario"]["email"]);
        $devolver = $user->cargarHistorial($datosUsuario["usuario"]);
    }
}
catch (\PDOException $pdoError) {
    $devolver = ["error" => "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage()];
} catch (\Exception $error) {
    $devolver = ["error" => "Error " . $error->getCode() . ": " . $error->getMessage()];
}
echo json_encode($devolver);