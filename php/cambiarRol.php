<?php

use \Usuarios\Administrador as admin;

require_once "autocarga.php";
session_start(); // iniciamos sesión
// A cambiarRol.php le va a llegar un json
// Como no aparecerá en $_POST tendremos que usar la función file_get_contents para recuperar los datos
$contenido_js_en_json = file_get_contents("php://input");
//Tenemos que traducir de json a php
$contenido_js_en_php = json_decode($contenido_js_en_json, true); // Esto nos devuelve un array asociativo, en el que sólo está el mail

try {
    if (!isset($_SESSION["usuario"]["rol"])||$_SESSION["usuario"]["rol"]!=1) {
        throw new \Exception("El solicitante no se trata de un administrador");
    }
    //Cargar los usuarios y su rol
    if(isset($contenido_js_en_php["filtrarUsuarios"])) {
        $admin = new admin($_SESSION["usuario"]["email"], $_SESSION["usuario"]["rol"]);
        $devolver = $admin->cargarUsuarios($contenido_js_en_php["filtrarUsuarios"]);
    }
    //Cambiar el rol
    else {
        // Y ahora podemos pasar al cambio de rol en sí
        $admin = new admin($_SESSION["usuario"]["email"], $_SESSION["usuario"]["rol"]);
        $resultado = $admin->cambiarRol($contenido_js_en_php["email"], $contenido_js_en_php["rol"]);
        // Si algo ha ido mal
        if (is_string($resultado) && stripos($resultado, "error") !== false) {
            // Si nos da error devolvemos false para sacar una alerta
            $resultado = false;
            unset($sentencia);
            // Devolvemos el resultado para mostrar una alerta negativa
            $devolver = $resultado;
        } else {
            // Si todo va bien lo contrario, sacaremos una alerta positiva
            $resultado = true;
            unset($sentencia);
            // Devolvemos el resultado para mostrar una alerta positiva
            $devolver = $resultado;
        }
    }
} catch (\PDOException $pdoError) {
    $devolver = ["error" => "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage()];
} catch (\Exception $error) {
    $devolver = ["error" => "Error " . $error->getCode() . ": " . $error->getMessage()];
}
echo json_encode($devolver);
