<?php
namespace Usuarios;

use \Infraestructuras\Bd as bd;
class Usuario
{
    protected $id_usuario;
    protected $email;
    protected $nombre;
    protected $apellidos;
    protected $telefono;
    protected $fecha_registro;
    protected $direccion;
    protected $fecha_ult_modif;
    protected $fecha_ult_acceso;
    protected $rol;
    protected $genero_favorito;
    protected $suscripcion;
    protected $renovar;
    protected $fecha_ini_suscripcion;

    public function __construct($email) {
        $this->email = $email;
    }

    //Sets y gets
    /**
     * Devuelve el valor del email
     *
     * @return  string  Email del usuario
     */
    public function getEmail() {
        return $this->email;
    }

    public function getRol() {
        //Comprobamos si lo tiene asignado
        if(!isset($this->rol)){
            try {
                //Si no está asignado lo recuperamos de la base de datos y se lo asignamos
                $bd = new bd();
                $sentencia = "SELECT R.id_rol as rol FROM usuarios as U INNER JOIN roles as R ON U.rol = R.id_rol WHERE email = ?";
                $resultadoRol = $bd->recuperDatosBD($sentencia, [$this->email]);
                if($resultadoRol != false){
                    $rol = $resultadoRol->fetch(\PDO::FETCH_ASSOC)["rol"];
                    $this->rol = $rol != false ? $rol : null;
                }
            }
            catch(\PDOException $pdoError) {
                $error = "Error " . $pdoError->getMessage();
            }
            catch(\Exception $error) {
                $error = "Error " . $error->getMessage();
            }
        }
        return $this->rol;
    }

    /**
     * Método que recupera los datos del usuario que tiene la sesión iniciada
     *
     * @return  array Devuelve un array con los datos de dicho usuario
     */
    public function cargarDatos()
    {
        // Declaro la sentencia sql para recuperar los datos del usuario
        $sql1 = "SELECT id_usuario,
                        email,
                        nombre,
                        apellidos,
                        telefono,
                        fecha_registro,
                        direccion,
                        fecha_ult_modif,
                        fecha_ult_acceso,
                        rol,
                        genero_favorito,
                        suscripcion,
                        renovar,
                        fecha_ini_suscripcion
                        where email = ?";
        $email = $_SESSION['email'];
        //
        $conBd = new bd();
        $arrayDatos = $conBd->recuperDatosBD($sql1, $email); // "email" es el dato identificador
        return $arrayDatos;
    }
    public function modificarDatos()
    {
    }
    public function anadirCarrito()
    {
    }
    public function eliminarCarrito()
    {
    }
    public function realizarPedido()
    {
    }
    public function reservarPartida()
    {
    }
    public function cancelarPartida()
    {
    }
    public function suscribirse()
    {
    }
    public function cerrarSesion()
    {
    }
    public function cargarCambios_perfil()
    {
    }
}
