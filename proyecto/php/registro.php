<?php

use \Infraestructuras\Bd as bd;

require_once "autocarga.php";
$datos = json_decode(file_get_contents("php://input"), true);
$devolver = ["prueba" => "Funciona"];
//Instanciamos bd
$bd = new bd();
try {
    if(isset($datos["cargarGeneros"])){
        //Ejecutamos la sentencia para obtener los géneros
        $sentencia = "SELECT nombre_genero as genero FROM generos LIMIT 0, 25;";
        $resultado = $bd->recuperDatosBD($sentencia);
        $devolver = ["error" => "No se pudo cargar los generos"];
        //Comprobamos si es un pdoStatement (Hay datos)
        if($resultado instanceof \PDOStatement) {
            //Array con todos los géneros
            $generos = $resultado->fetchAll(\PDO::FETCH_ASSOC);
            $devolver = ["generos" => $generos];
        }
    }
    else if(isset($datos["cargarTematicas"])){
        //Ejecutamos la sentencia para obtener los géneros
        $sentencia = "SELECT nombre_tematica as tematica FROM tematicas LIMIT 0, 25;";
        $resultado = $bd->recuperDatosBD($sentencia);
        $devolver = ["error" => "No se pudo cargar las temáticas"];
        //Comprobamos si es un pdoStatement (Hay datos)
        if($resultado instanceof \PDOStatement) {
            //Array con todos los géneros
            $tematicas = $resultado->fetchAll(\PDO::FETCH_ASSOC);
            $devolver = ["tematicas" => $tematicas];
        }
    }
    else {
        //Cogemos los datos del POST que corresponden con todos los datos menos el fichero
        $datos = json_decode($_POST["datosUsuario"], true);
        //Datos obligatorios
        $datosOblig = ["email", "pwd", "pwd2", "nombre", "apellidos", "fecha_nac"];
        //Cogemos el fichero de files
        $fichero = $_FILES["imagenPerfil"];
        $resultado = $bd->registrarUsuario($datos, $datosOblig, $fichero);
        if(stripos($resultado, "error") === false) {
            $devolver = ["exito" => "Registro completado"];
        }
        else {
            $devolver  = ["error" => $resultado];
        }
    }
}
catch(\PDOException $pdoError){
    $devolver = ["error" => $pdoError];
}
catch(\Exception $error){
    $devolver = ["error" => $error];
}
//Ponemos la cabecera
header("Content-type: application/json");
$bd->codificarArrayUtf8($devolver);
$mensajeCod =  json_encode($devolver);
echo $mensajeCod;
//echo json_last_error_msg();