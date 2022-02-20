<?php

use \Infraestructuras\Bd as bd;

require_once "autocarga.php";
if(!isset($_POST["datosUsuario"])){
    //Ejecutamos la sentencia para obtener los géneros
    $bd = new bd();
    $sentencia = "SELECT nombre_genero FROM generos;";
    $resultado = $bd->recuperDatosBD($sentencia);
    //Comprobamos si es un pdoStatement (Hay datos)
    if($resultado instanceof \PDOStatement) {
        //Array con todos los géneros
        $generos = [];
        while($fila = $resultado->fetch(PDO::FETCH_NUM)){
            $generos[] = $fila[0];
        }
    }
    //Devolvemos el array de géneros o el error
    echo isset($generos) ? json_encode(["generos" => $generos]) : json_encode(["Error" =>$resultado]);
}
else {
    //Cogemos los datos del POST que corresponden con todos los datos menos el fichero
    $datos = json_decode($_POST["datosUsuario"], true);
    //Datos obligatorios
    $datosOblig = ["email", "pwd", "pwd2", "nombre", "apellidos", "fecha_nac"];
    //Cogemos el fichero de files
    $fichero = $_FILES["imagenPerfil"];
    //Creamos el objeto BD
    $bd = new bd();
    $resultado = $bd->registrarUsuario($datos, $datosOblig, $fichero);
    $mensaje  = stripos($resultado, "error") === false ? ["exito" => "Registro compleatado"] : ["error" => $resultado];
    //Devolvemos el resultado
    echo json_encode($mensaje);
}
