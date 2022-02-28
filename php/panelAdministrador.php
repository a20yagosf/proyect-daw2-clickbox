<?php
include_once "autocarga.php";
use \Usuarios\Administrador as admin;
//Iniciamos sesión
session_start();
 //Compruebo que sea administrador
 if($_SESSION["usuario"]["rol"] != 1){
    echo json_encode(["noAdmin" => "No puede acceder aquí"]);
}
try {
    //Creamos al usuario administrador
    $admin = new admin($_SESSION["usuario"]["email"], $_SESSION["usuario"]["rol"]);
    //Filtro de las partidas (Si es que lo envié)
    $filtroPartidas = (array) json_decode(file_get_contents("php://input"), true);
    //Compruebamos si me pidió los juegos
    if(isset($_GET["juego"])) {
        $juegos = $admin->cargarJuegos();
        if(count($juegos) == 0){
            throw new \Exception("No hay juegos");
        }
        $devolver = ["juegos" => $juegos];
    }
    //Si se está creando una partida
    else if(isset($_POST["datosPartida"])) {
        //Cogemos los datos del POST
        $datosPartida = json_decode($_POST["datosPartida"], true);
        //Convertimos a int los que tienen que serlo ya que al cogerlos por JSON vienen como strings
        $datosPartida["plazas_min"] = intval($datosPartida["plazas_min"]);
        $datosPartida["plazas_totales"] = intval($datosPartida["plazas_totales"]);
        $datosPartida["duracion"] = intval($datosPartida["duracion"]);
        $datosPartida["juego_partida"] = intval($datosPartida["juego_partida"]);
        //Cogemos la imagen
        $imagenPartida = $_FILES["imagenPartida"];
        $resultado = $admin->crearPartida($datosPartida, $imagenPartida);
        if($resultado){
            $devolver = ["exito" => "Se creó la partida con éxito"];
        }
    }
    //Si se está cargando el panel de partidas
    else if(isset($filtroPartidas["filtrosPartida"])) {
        $partidas = $admin->filtarPartidas($filtroPartidas["filtrosPartida"]);
        if($partidas){
            $devolver = $partidas;
        }
    }
}
catch(\PDOException $pdoError) {
    $devolver = ["error" => $pdoError->getMessage()];
}
catch(\Exception $error){
    $devolver = ["error" => $error->getMessage()];
}
echo json_encode($devolver);