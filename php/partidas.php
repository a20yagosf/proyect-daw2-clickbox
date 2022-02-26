<?php

use \Infraestructuras\Bd as bd;
use \Usuarios\Usuario as user;
require_once "autocarga.php";
session_start();
try {
    //Cojo el valor que pasan por POST
    $filtros = (array)json_decode(file_get_contents("php://input"));
    //Cojo el usuario de la variable de sesión
    $usuario = new user($_SESSION["usuario"]["email"]);
    $datosPartidas = $usuario->filtarPartidas($filtros);
    //Compruebo que me devolviera algo
    if(!is_array($datosPartidas)){
        throw new \Exception($datosPartidas);
    }
    else if(count($datosPartidas["tuplas"]) == 0){
        throw new \Exception("No hay ninguna partida");
    }
}
catch(\Exception $error){
    $datosPartidas = ["error" => $error->getMessage()];
}

echo json_encode($datosPartidas);
