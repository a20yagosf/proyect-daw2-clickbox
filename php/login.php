<?php
use \Infraestructuras\Bd as bd;
use \Usuarios\Usuario as user;
require_once "autocarga.php";
session_start();

try {
    if(isset($_GET["desconectar"])){
    //Borramos la variable de sesión
    $user = new user($_SESSION["usuario"]["email"]);
    $user->cerrarSesion();
    $mensaje =["exito" => "Se borró con éxito"];
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
                throw new \Exception("El usuario no existe");
            }
            //Comprobamos que no saltara un error
            if(mb_stristr($pwdHash, "error")){
                throw new \PDOException($pwdHash);
            }
            //Comprobamos la contraseña
            if(!password_verify($datosUsuairo->pwd, $pwdHash)) {
                throw new \Exception("El email o la contraseña no coinciden");
            }
            //Creamos un objeto usuairo con su email y lo guardamos en una variable de sesión
            $usuario = new user($datosUsuairo->email);
            //Cargamos el rol del usuario
            $mensaje  = ["exito" => $usuario->getRol()];
            $_SESSION["usuario"] = ["email" => $usuario->getEmail(), "rol" => $usuario->getRol()];
            $usuario->guardarInicioSesion();
        }
    }
catch(\PDOException $pdoError){
    $mensaje = ["error" => $pdoError->getMessage()];
}
catch(\Exception $error){
    $mensaje = ["error" => $error->getMessage()];
}
//Devolvemos el mensaje
echo json_encode($mensaje);
