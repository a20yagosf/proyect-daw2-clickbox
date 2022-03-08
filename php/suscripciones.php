<?php
require "autocarga.php";
use \Infraestructuras\Bd as bd;
use \ServiciosProductos\Suscripcion as suscription;
use \Usuarios\Usuario as user;

//Comprobamos si nos enviaron con post o get, como no enviamos datos en el GET vemos que en php://input nos devuelva almenos 1 parámetro
//Cogemos los datos que nos enviaron en la petición por POST, como nos devuelve un StdClass lo convertimos en array
$duracionSus = (array) json_decode(file_get_contents("php://input"));
//Si no tiene datos es que es la petición del get y carga todas las suscripciones
if(empty($duracionSus)) {
    //Hacemos la petición para que nos de la duración de las suscripciones
    $bd = new bd();
    $sentencia = "SELECT duracion FROM suscripciones";
    $resultado = $bd->recuperDatosBD($sentencia);
    //Compruebo si es de tipo PDOStatement
    if(!$resultado instanceof \PDOStatement) {
        //Devuelvo el error
        $mensajeDevolver = ["error" => $resultado];
    }
    else {
        //Lo devolvemos como fetch all ya que lo devolverá de forma
        $datos = $resultado->fetchAll(\PDO::FETCH_ASSOC);
        //Compruebo que no sea false o vacio
        if($datos == false || empty($datos)){
            $mensajeDevolver = ["error" => "No hay datos en la tabla suscripciones"];
        }
        else {
            $mensajeDevolver = $datos;
        }
    }
}
//Cargar los datos de una suscripcion
else if(isset($duracionSus["duracion"])) {
    //Instanciamos la BD
    $bd = new bd();
    //Sentencia para pedir los datos de la suscripción
    $sentencia = "SELECT precio FROM suscripciones WHERE duracion = ?";
    $resultado = $bd->recuperDatosBD($sentencia, [$duracionSus["duracion"]]);
    //Comprobamos si nos devolvió el PDOStatement (Si no falló la consulta)
    if(!$resultado instanceof \PDOStatement){
        $mensajeDevolver = ["error" => "Error al recuperar los datos"];
    }
    else {
        //Si llegó hasta aquí es que recuperó datos
        $precio = $resultado->fetch(\PDO::FETCH_ASSOC)["precio"];
        //Comprobamos si consiguió algún dato
        if(empty($precio)){
            $mensajeDevolver = ["error" => "Error al recuperar los datos"];
        }
        else {
            //Creamos el objeto suscripción
            $suscripcion = new suscription($duracionSus["duracion"], $precio);
            //Convertimos los datos a array asociativo
            $mensajeDevolver = $suscripcion->devolverDatos();
        }
    }
}
//Suscribirse
else if(isset($duracionSus["suscribirse"])) {
    //Iniciamos sesión ya que sólo podran suscribirse los usuarioss
    session_start();
    if(!isset($_SESSION["usuario"])){
        $mensajeDevolver = ["noSuscrita" => "Denes estar suscrito"];
    }
    else {
        $usuario = new user($_SESSION["usuario"]["email"]);
        $resultado = $usuario->suscribirse($duracionSus["suscribirse"]);
        //Comprobamos que no diera error
        if($resultado !== true){
            $mensajeDevolver = ["error" => $resultado];
        }
        else {
            $mensajeDevolver = ["exito" => "Suscrito con exito"];
        }
    }
}
//Cancelar suscripcion
else {
    //Iniciamos sesión ya que sólo podran suscribirse los usuarioss
    session_start();
    $usuario = new user($_SESSION["usuario"]["email"]);
    $resultado = $usuario->cancelarRenovacionSusc();
    $mensajeDevolver = ["exito" => $resultado];
}
//Se lo devolvemos a js
echo json_encode($mensajeDevolver);
