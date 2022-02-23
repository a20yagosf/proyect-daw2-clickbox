<?php
use \Infraestructuras\Bd as bd;
use \Usuarios\Usuario as user;
require_once "autocarga.php";
session_start();

if(isset($_GET["desconectar"])){
   //Borramos la variable de sesión
   unset($_SESSION["usuario"]);
   echo json_encode(["exito" => "Se borró con éxito"]);
}
else {
     //Cogemos los datos y los decodificamos
    $datosUsuairo = json_decode(file_get_contents("php://input"));

    //Instanciamos BD
    $bd = new bd();
    //Comprobamos que el usuario exista
    $pwdHash = $bd->comprobarUsuario($datosUsuairo->email);
    //Comprobamos que no sea false
    if($pwdHash === false){
        $mensaje = ["error"=> "El usuario no existe"];
    }
    //Comprobamos que no saltara un error
    else if(mb_stristr($pwdHash, "error")){
        $mensaje = ["error"=> $pwdHash];
    }
    else {
        //Creamos un objeto usuairo con su email y lo guardamos en una variable de sesión
        $usuario = new user($datosUsuairo->email);
        //Cargamos el rol del usuario
        $mensaje  = ["exito" => $usuario->getRol()];
        $_SESSION["usuario"] = ["email" => $usuario->getEmail(), "rol" => $usuario->getRol()];
    }
    //Devolvemos el mensaje
    echo json_encode($mensaje);
}
