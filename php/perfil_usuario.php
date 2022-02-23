<?php
use \Infraestructuras\Bd as bd;
require_once "autocarga.php";

// A perfil_usuario.php le va a llegar un json
// Como no aparecerá en $_POST tendremos que usar la función file_get_contents para recuperar los datos
$contenido_js_en_json = file_get_contents("php://input");
//Tenemos que traducir de json a php
$contenido_js_en_php = json_decode($contenido_js_en_json); // Esto nos devuelve un array asociativo, en el que sólo está el mail
//Instanciamos BD
$bd = new bd();

try {
    //Creamos una sentencia que nos devuelva los datos de un usuario del que sabemos su email
    $sentencia = "SELECT nombre, apellidos, telefono, direccion, genero_favorito FROM usuarios WHERE email = ?";
    //Devolvemos lo que nos devuelve (Error o los datos del usuario)
    $resultado = $this->recuperDatosBD($sentencia, [$contenido_js_en_php["email"]]); //le pasamos el email y la sentencia
    if (is_string($resultado)) {
        throw new \Exception($resultado);
    }
    $resultado = $resultado->fetch(\PDO::FETCH_ASSOC);
} catch (\PDOException $pdoError) {
    return "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
} catch (\Exception $error) {
    return "Error " . $error->getCode() . ": " . $error->getMessage();
}

