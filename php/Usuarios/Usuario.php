<?php
include("bd.php"); // En un futuro se reemplazará con autocarga
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
        $conBd = new Bd();
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
