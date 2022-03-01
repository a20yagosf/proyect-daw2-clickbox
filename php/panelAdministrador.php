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
    $datosPOST = json_decode(file_get_contents("php://input"), true);
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
    else if(isset($datosPOST["filtrosPartida"])) {
        $partidas = $admin->filtarPartidas($datosPOST["filtrosPartida"]);
        if($partidas){
            $devolver = $partidas;
        }
    }
    //Si está en modo edición de una partida
    else if(isset($datosPOST["id_partida"])) {
        $partida = $admin->recuperarDatosActualesPartida($datosPOST["id_partida"]);
        //Creamos una cookie con la partida en la que estamos
        setcookie("partida", $datosPOST["id_partida"]);
        //Devolvemos los datos (Si no devolvió nada salta la excepción por lo que si llegamos aquí es que hay datos)
        $devolver = $partida;
    }
    else if(isset($datosPOST["edicion_partida"])){
        //Cogemos el id de la partida de la cookie que creamos
        $datosPOST["edicion_partida"]["id_partida"] = $_COOKIE["partida"];
        $admin->editarPartida($datosPOST["edicion_partida"]);
        //Devolvemos exito (Si da error salta la excepción por lo que si llegamos aquí es que hay datos)
        $devolver = ["exito"=> "Datos actualizados con éxito"];
    }
    //Eliminar la partida
    else if(isset($datosPOST["idPartidaEliminar"])) {
        $admin->eliminarPartida($datosPOST["idPartidaEliminar"]);
        //Devolvemos exito (Si da error salta la excepción por lo que si llegamos aquí es que hay datos)
        $devolver = ["exito"=> "Datos actualizados con éxito"];
    }
}
catch(\PDOException $pdoError) {
    $devolver = ["error" => $pdoError->getMessage()];
}
catch(\Exception $error){
    $devolver = ["error" => $error->getMessage()];
}
echo json_encode($devolver);