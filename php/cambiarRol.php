<?php

use \Infraestructuras\Bd as bd;

require_once "autocarga.php";
session_start(); // iniciamos sesión
// A cambiarRol.php le va a llegar un json
// Como no aparecerá en $_POST tendremos que usar la función file_get_contents para recuperar los datos
$contenido_js_en_json = file_get_contents("php://input");
//Tenemos que traducir de json a php
$contenido_js_en_php = json_decode($contenido_js_en_json, true); // Esto nos devuelve un array asociativo, en el que sólo está el mail
//Instanciamos BD
$bd = new bd();

try {
    if (!isset($_SESSION["usuario"]["rol"])||$_SESSION["usuario"]["rol"]!=1) {
        throw new \Exception("El solicitante no se trata de un administrador");
    }
    // Y ahora podemos pasar al cambio de rol en sí
    //Creamos una sentencia que cambie el rol del usuario elegido por el rol seleccionado
    $sentencia = "UPDATE usuarios SET rol = :rol WHERE email = :email";
    $datosUsuario["rol"] = intval($contenido_js_en_php["rol"]);
    $datosUsuario["email"] = $contenido_js_en_php["email"];
    // Ahora intentamos hacer el cambio
    $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosUsuario);
    // Si algo ha ido mal
    if (is_string($resultado) && stripos($resultado, "error") !== false) {
        // Si nos da error devolvemos false para sacar una alerta
        $resultado = false;
        unset($sentencia);
        // Devolvemos el resultado para mostrar una alerta negativa
        echo json_encode($resultado);
    } else {
        // Si todo va bien lo contrario, sacaremos una alerta positiva
        $resultado = true;
        unset($sentencia);
        // Devolvemos el resultado para mostrar una alerta positiva
        echo json_encode($resultado);
    }
} catch (\PDOException $pdoError) {
    echo json_encode(["error" => "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage()]);
} catch (\Exception $error) {
    echo json_encode(["error" => "Error " . $error->getCode() . ": " . $error->getMessage()]);
}
