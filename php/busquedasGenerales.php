<?php
require_once "autocarga.php";

use \Usuarios\Usuario as user;
use \Usuarios\Administrador as admin;
//Iniciamos sesión
session_start();

//Cogemos los valores que vendran de post
$datosBuscar = json_decode(file_get_contents("php://input"), true);
try {
    //Si buscamos un nombre de juego
    if(isset($datosBuscar["nombre_juego"])) {
        //Instanciamos usuario
        $usuario = new user($_SESSION["usuario"]["email"]);
        $nombreJuegos = $usuario->buscarNombreJuego($datosBuscar["nombre_juego"]);
        $devolver = ["nombreJuego" => $nombreJuegos];
    }

    else if(isset($datosBuscar["director_partida"])){
        //Compruebo que sea administrador
        if($_SESSION["usuario"]["rol"] != 1){
            echo json_encode(["noAdmin" => "No puede acceder aquí"]);
        }
        //Instanciamos al usuario admin
        $admi = new admin($_SESSION["usuario"]["email"], $_SESSION["usuario"]["rol"]);
        $nombreDirectoresPartida = $admi->buscarNombreDirectorPartida($datosBuscar["director_partida"]);
        $devolver = ["directorPartida" => $nombreDirectoresPartida];
    }
}
catch(\PDOException $pdoError){
    $devolver = ["error" => $pdoError->getMessage()];
}
catch(\Exception $error){
    $devolver = ["error" => $error->getMessage()];
}
echo json_encode($devolver);
