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
    //Reservar partida
    if(isset($filtros["partidaReservar"])){
        $usuario->reservarPartida($filtros["partidaReservar"], $usuario->getEmail());
        $datosPartidas = ["exito" => "reservado con éxito"];
    }
    else if(isset($filtros["masInfoPartida"])) {
        //Cargamos los datos de las partidas
        $datos = $usuario->masInfoPartida($filtros["masInfoPartida"]);
        $datosPartidas = $datos;
    }
    //Filtrar las partidas
    else {
        $datosPartidas = $usuario->filtarPartidas($filtros);
        //Compruebo que me devolviera algo
        if(!is_array($datosPartidas)){
            throw new \Exception($datosPartidas);
        }
    }
}
catch(\PDOException $pdoError){
    $datosPartidas = ["error" => $pdoError->getMessage()];
}
catch(\Exception $error){
    $datosPartidas = ["error" => $error->getMessage()];
}

echo json_encode($datosPartidas);
