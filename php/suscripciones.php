<?php
require "autocarga.php";
use \Infraestructuras\Bd as bd;
use \ServiciosProductos\Suscripcion as suscription;

//Comprobamos si nos enviaron con post o get, como no enviamos datos en el GET vemos que en php://input nos devuelva almenos 1 parámetro
//Cogemos los datos que nos enviaron en la petición por POST
$duracionSus = json_decode(file_get_contents("php://input"));
//Si no tiene datos es que es la petición del get
if(count($duracionSus) == 0) {
    //Hacemos la petición para que nos de la duración de las suscripciones
    $bd = new bd();
    $sentencia = "SELECT duracion FROM suscripciones";
    $resultado = $bd->recuperDatosBD($sentencia);
    //Compruebo si es de tipo PDOStatement
    if(!$resultado instanceof \PDOStatement) {
        //Devuelvo el error
        $mensajeDevolver = ["error" => $resultado];
    }
    //Lo devolvemos como fetch all ya que lo devolverá de forma
    $datos = $resultado->fetchAll(PDO::FETCH_ASSOC);
    //Compruebo que no sea false o vacio
    if($datos == false || empty($datos)){
        $mensajeDevolver = ["error" => "No hay datos en la tabla suscripciones"];
    }
    else {
        $mensajeDevolver = $datos;
    }
    //Devolvemos la respuesta
    echo json_encode($mensajeDevolver);
}
else {
    //Instanciamos la BD
    $bd = new bd();
    //Sentencia para pedir los datos de la suscripción
    $sentencia = "SELECT precio FROM suscripciones WHERE duracion = ?";
    $resultado = $bd->recuperDatosBD($sentencia, [$duracionSus["duracion"]]);
    if(!$resultado){
        echo json_encode(["error" => "Error al recuperar los datos"]);
    }
    else {
        //Si llegó hasta aquí es que recuperó datos
        $precio = $resultado->fetch(PDO::FETCH_ASSOC)["precio"];
        //Creamos el objeto suscripción
        $suscripcion = new suscription($duracionSus["duracion"], $precio);
        //Convertimos los datos a array asociativo
        $datosDevolver = $suscripcion->devolverDatos();
        //Se lo devolvemos a js
        echo json_encode($datosDevolver);
    }
}


