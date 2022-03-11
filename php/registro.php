<?php

use \Infraestructuras\Bd as bd;

require_once "autocarga.php";
$datos = json_decode(file_get_contents("php://input"), true);
$devolver = ["prueba" => "Funciona"];
try {
    if(isset($datos["cargarGeneros"])){
        //Ejecutamos la sentencia para obtener los géneros
        $bd = new bd();
        $sentencia = "SELECT nombre_genero FROM generos LIMIT 0, 25;";
        $resultado = $bd->recuperDatosBD($sentencia);
        $devolver = ["error" => "No se pudo cargar los generos"];
        //Comprobamos si es un pdoStatement (Hay datos)
        if($resultado instanceof \PDOStatement) {
            //Array con todos los géneros
            $generos = $resultado->fetchAll(\PDO::FETCH_NUM);
            $devolver = $generos;
        }
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
echo json_encode(utf8_encode($devolver));