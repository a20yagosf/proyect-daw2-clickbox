<?php
use \Usuarios\Usuario as user;
require_once "autocarga.php";
session_start();

// A perfil_usuario.php le va a llegar un json
// Como no aparecerá en $_POST tendremos que usar la función file_get_contents para recuperar los datos
$contenido_js_en_json = file_get_contents("php://input");
//Tenemos que traducir de json a php
$contenido_js_en_php = json_decode($contenido_js_en_json, true); // Esto nos devuelve un array asociativo, en el que sólo está el mail
try {
    if($_SESSION["usuario"]["email"] == null){
        $devolver = ["noUser" => "No es un usuario registrado"];
    }
    else if(isset($contenido_js_en_php["guardaCambios"])) {
        $user = new user($_SESSION["usuario"]["email"]);
        $user->guardarPerfil($contenido_js_en_php["guardaCambios"]);
        $devolver = ["exito" => "Guardado con éxito"];
    }
    else {
        $user = new user($_SESSION["usuario"]["email"]);
        $resultado = $user->cargarPerfil();
        $devolver = $resultado;
    }
} catch (\PDOException $pdoError) {
    $devolver = ["error"=>"Error " . $pdoError->getCode() . ": " . $pdoError->getMessage()];
} catch (\Exception $error) {
    $devolver = ["error"=>"Error " . $error->getCode() . ": " . $error->getMessage()];
}
echo json_encode($devolver);

