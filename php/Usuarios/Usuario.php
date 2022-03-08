<?php

namespace Usuarios;

use DateInterval;
use DateTime;
use \Infraestructuras\Bd as bd;
use Infraestructuras\Email;
use \Traits\Formulario as formulario;
use \ServiciosProductos\Suscripcion as suscription;

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

    use formulario;

    public function __construct($email) {
        $this->validarCamposForm($email);
        $this->email = $email;
    }

    //Sets y gets
    /**
     * Devuelve el valor del email
     *
     * @return  string  Email del usuario
     */
    public function getEmail()   {
        return $this->email;
    }

    public function getRol()  {
        //Comprobamos si lo tiene asignado
        if (!isset($this->rol)) {
            try {
                //Si no está asignado lo recuperamos de la base de datos y se lo asignamos
                $bd = new bd();
                $sentencia = "SELECT rol FROM usuarios WHERE email = ?";
                $resultadoRol = $bd->recuperDatosBD($sentencia, [$this->email]);
                if (!is_string($resultadoRol) && $resultadoRol != false) {
                    $rol = $resultadoRol->fetch(\PDO::FETCH_ASSOC)["rol"];
                    $this->rol = $rol != false ? $rol : null;
                }
            } catch (\PDOException $pdoError) {
                $error = "Error " . $pdoError->getMessage();
            } catch (\Exception $error) {
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
    public function cargarDatos() {
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

    /**
     * Guarda el momento del inicio de sesión
     *
     * @return  void  No devuelve nada
     */
    public function guardarInicioSesion() {
        //Instanciamos bd
        $bd = new bd();
        $sentencia = "UPDATE usuarios SET fecha_ult_acceso = NOW() WHERE email = ?";
        $resultado = $bd->agregarModificarDatosBD($sentencia, [$this->getEmail()]);
        if($resultado === false) {
            throw new \PDOException($resultado);
        }
    }

    /**
     * Crea el contendor de mas información de una partida
     *
     * @param   int  $idPartida  ID de la partida
     *
     * @return  void              No deuvelve nada
     */
    public function masInfoPartida($idPartida) {
        //Instanciamos bd
        $bd = new bd();
        $idPartidaPasar = ["id_partida" => $idPartida];
        //Creamos la sentencia
        $sentencia = "SELECT P.fecha, P.hora_inicio, P.duracion, PR.nombre as juego, J.genero, P.plazas_totales as plazas, J.genero FROM partidas AS P INNER JOIN productos as PR ON P.juego_partida = PR.id_producto INNER JOIN juegos AS J ON PR.id_producto = J.juego WHERE id_partida = :id_partida";
        //La ejecutamos
        $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $idPartidaPasar);
        //Comprobamos que no diera error
        if(!$pdoStatement instanceof \PDOStatement){
            throw new \PDOException($pdoStatement);
        }
        //Cogemos los datos, como las partidas son únicas sólo hacemos fetch
        $datos["infoPartida"] = $pdoStatement->fetch(\PDO::FETCH_ASSOC);
        //Le añadimos el id
        $datos["infoPartida"]["id_partida"] = $idPartida;
        unset($pdoStatement);
        //Cogemos las imágenes
        $sentenciaImg = "SELECT imagen FROM partidas_imagenes WHERE partida = :id_partida LIMIT 0, 5";
        $pdoStatement = $bd->recuperarDatosBDNum($sentenciaImg, $idPartidaPasar);
        //Comprobamos que no diera error
        if(!$pdoStatement instanceof \PDOStatement){
            throw new \PDOException($pdoStatement);
        }
        //HAcemos fetch All ya que sabemos que como mucho serán 5
        $datos["imagenes"] = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
        return $datos;
    }

    /**
     * Reserva una partida para el usuario
     *
     * @param   int  $idPartida  ID de la partida
     * @param   string  $email      Email del usuario
     *
     * @return  void              No devuelve nada
     */
    public function reservarPartida($idPartida, $email) {
        $datosReserva = ["partida" => $idPartida, "usuario" => $email];
        $this->validarCamposForm($datosReserva);
        //Instanciamos la BD
        $bd = new bd();
        //Cogemos la información del director de partida para enviarle un mail avisándolo de que hay nuevas reservas
        $sentencia = "SELECT director_partida, fecha FROM partidas WHERE id_partida = :id_partida";
        $resultadoDirector = $bd->recuperarDatosBDNum($sentencia, ["id_partida" => $idPartida]);
        //Comprobamos que no diera error
        if(!$resultadoDirector instanceof \PDOStatement) {
            throw new \PDOException($resultadoDirector);
        }
        //Cogemos al director
        $infoPartida = $resultadoDirector->fetch(\PDO::FETCH_ASSOC);
        //Creamos al sentencia
        $sentencia = "INSERT INTO usuarios_partidas (usuario, partida, momento_reserva, reservada) VALUES (:usuario, :partida, NOW(), 0);";
        //Convertimos el id a int porque viene como string
        $datosReserva["partida"] = intval($datosReserva["partida"]);
        $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosReserva);
        //Comprobamos que no diera error
        if(is_string($resultado) && stripos($resultado, "error") !== false) {
            throw new \PDOException($resultado);
        }
        //Si no dió error enviamos un mail a todos los administradores
        $email = new Email();
        $email->enviarCorreos($infoPartida["director_partida"], "nuevaReserva", $infoPartida);
    }
    
    public function cancelarPartida() {
    }

    /**
     * Suscribe al usuario a esa suscripción
     *
     * @param   string  $duracion  Duración de la suscripcion (Es una string porque en el JSON se convierte)
     *
     * @return  boolean           Devuelve un error o true si todo fue bien
     */
    public function suscribirse($duracion) {
        try {
            //Instanciamos bd
            $bd = new bd();
            //Comprobamos si ya tiene una suscripción
            $sentencia = "SELECT suscripcion, fecha_ini_suscripcion FROM usuarios WHERE email = ?;";
            $pdoStatement = $bd->recuperDatosBD($sentencia, [$this->getEmail()]);
            if(!$pdoStatement instanceof \PDOStatement){
                throw new \PDOException($pdoStatement);
            }
            $datosSuscripcion = $pdoStatement->fetch();
            //Comprobamos si tiene una suscripions
            if($datosSuscripcion["suscripcion"] != "") {
                //Si tiene una suscripción comprobamos que no esté caducada
                $fechaIniSusc = new \DateTime($datosSuscripcion["fecha_ini_suscripcion"]);
                $intervalSusc = new \DateInterval("P" . $datosSuscripcion["suscripcion"] . "M");
                //Lo sumamos
                $fechaIniSusc->add($intervalSusc);
                if($fechaIniSusc->diff(new DateTime())->days > 0){
                    throw new \Exception("Ya tienes una suscripción activa!!");
                }
            }
            //Creamos la sentencia, por defecto se pondrá renovar a true y la fecha actual de la suscripcion
            $fechaIniSusc = new DateTime();
            //Añadimos la fecha de inicio de suscripción porque fue generada por nosotros con control, por lo que podemos confiar de ella
            $sentencia = "UPDATE usuarios SET suscripcion = :suscripcion, renovar = 1, fecha_ini_suscripcion = NOW() WHERE email = :email;";
            //Array con los datos que tenemos que pasarle
            $datosAnhadir = ["suscripcion" => intval($duracion), "email" => $this->getEmail()];
            $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosAnhadir);
            //Comprobamos que no diera un error
            if(is_string($resultado) && stripos($resultado, "error") !== false){
                throw new \PDOException($resultado);
            }
            //Enviamos el correo
            $email = new Email();
            $correoEnviado = $email->enviarCorreos($this->getEmail(), "suscribirse", ["duracion" => intval($duracion), "fecha_ini_suscripcion" => $fechaIniSusc]);
            if($correoEnviado !== true) {
                throw new \Exception($correoEnviado);
            }
        }
        catch (\PDOException $pdoError){
            $devolver = "Error " . $pdoError->getMessage();
        }
        catch (\Exception $error){
            $devolver = "Error " . $error->getMessage();
        }
        return $devolver ?? true;
    }

    /**
     * Cancela la renovación de la suscripción
     *
     * @return  boolean  Devuelve true si se completó bien la operación
     */
    public function cancelarRenovacionSusc() {
        //Instanciamos bd
        $bd = new bd();
        //Comprobamos que no tenga una renovación
        $sentencia = "SELECT renovar FROM usuarios WHERE email = ?;";
        $pdoStatement = $bd->recuperDatosBD($sentencia, [$this->getEmail()]);
        if(!$pdoStatement instanceof \PDOStatement) {
            throw new \PDOException($pdoStatement);
        }
        $renovar = $pdoStatement->fetch(\PDO::FETCH_ASSOC);
        //Creamos la sentnecia
        if($renovar != 1){
            return "No tienes activado para renovar la suscripcion";
        }
        $sentencia = "UPDATE usuarios SET renovar = 0 WHERE email = ?;";
        $resultado = $bd->agregarModificarDatosBD($sentencia, [$this->getEmail()]);
        if(is_string($resultado) && stripos($resultado, "error") !== false){
            throw new \PDOException($resultado);
        }
        return true;
    }

    /**
     * Cierra la sesión eliminando la variable de sesión de usuario
     *
     * @return  void  No devuelve nada
     */
    public function cerrarSesion(){
        session_destroy();
        session_unset();
    }

    /**
     * Cargar los datos del perfil
     *
     * @return  [type]  [return description]
     */
    public function cargarPerfil(){
        //Instanciamos BD
        $bd = new bd();
        //Creamos una sentencia que nos devuelva los datos de un usuario del que sabemos su email
        $sentencia = "SELECT nombre, apellidos, telefono, direccion, genero_favorito, fecha_ult_modif, fecha_ult_acceso, rol, suscripcion, renovar, imagen_perfil, DATE_ADD(fecha_ini_suscripcion, INTERVAL suscripcion MONTH) AS fecha_renovacion FROM usuarios WHERE email = ?";
        //Devolvemos lo que nos devuelve (Error o los datos del usuario)
        $resultado = $bd->recuperDatosBD($sentencia, [$this->getEmail()]); //le pasamos el email y la sentencia
        if (!$resultado instanceof \PDOStatement) {
            throw new \Exception($resultado);
        }
        $resultado = $resultado->fetch(\PDO::FETCH_ASSOC);
        if ($resultado==false) {
            throw new \Exception("No existe ese usuario");
        }
        return $resultado;
    }

    public function guardarPerfil($datos) {
        try {
            $this->comprobarCamposNoOblig($datos, ["telefono", "direccion", "genero_favorito"]);
            //Instanciamos BD
            $bd = new bd();
            //Creamos la sentencia
            $datos["email"] = $this->getEmail();
            $sentencia = "UPDATE usuarios SET nombre = :nombre, apellidos = :apellidos, telefono = :telefono, direccion = :direccion, genero_favorito = :genero_favorito WHERE email = :email";
            $bd->agregarModificarDatosBDNum($sentencia, $datos);
        }
        catch(\PDOException $pdoError){
            throw $pdoError;
        }
        catch(\Exception $error) {
            throw $error;
        }
    }

    /**
     * Carga el historial del usuario
     *
     * @param   array $filtro  Filtros que se le asignan
     * @param   boolean $propio  Si es sólo nuestro perfil o no
     *
     * @return  array       Número de página y los datos del historial
     */
    public function cargarHistorial($filtro, $propio = true) {
        //Comprobamos que las fechas no sean null
        $fecha1 = $filtro["fechaIni"] ?? "";
        $fecha2 = $filtro["fechaFin"] ?? "";
        $fechas = $this->comprobarFechas($fecha1, $fecha2, false);
        $datosFiltrado["email"] = $this->getEmail();
        //Instanciamos bd
        $bd = new bd();
        //Sentencia
        $sentenciaNumPag = "SELECT count(*) as num_pag FROM historico_usuarios WHERE email = :email";
        $sentencia = "SELECT fecha_ult_modif, CONCAT('email:',email , '; ', 'rol:',rol, '; ', 'nombre:',nombre, '; ', 'apellidos:',apellidos, '; ', 'telefono:', IFNULL(telefono, ''), '; ', 'direccion:', IFNULL(direccion, ''), '; ', 'genero_favorito:', IFNULL(genero_favorito, ''), '; ', 'suscripcion:', IFNULL(suscripcion, ''), '; ', 'renovar:', IFNULL(renovar, '')) AS datos FROM historico_usuarios WHERE email = :email";
        //Comprobamos si cogemos las fechas
        if(count($fechas) == 2){
            $sentenciaNumPag .= " AND (DATE(fecha_ult_modif) BETWEEN :fechaIni AND :fechaFin)";
            $sentencia .= " AND (DATE(fecha_ult_modif) BETWEEN :fechaIni AND :fechaFin)";
            $datosFiltrado["fechaIni"] = $filtro["fechaIni"];
            $datosFiltrado["fechaFin"] = $filtro["fechaFin"];
        }
        else if(count($fechas) == 1){
            $sentenciaNumPag .= " AND (DATE(fecha_ult_modif) >= :fechaIni)";
            $sentencia .= " AND (DATE(fecha_ult_modif) >= :fechaIni)";
            $datosFiltrado["fechaIni"] = $filtro["fechaIni"];
        }
        //Calculamos el número de página
        $numPag = $this->calcularNumPag($sentenciaNumPag, $datosFiltrado);
        //Añadimos el limite
        $sentencia .= " LIMIT :pagina, :limite;";
        $datosFiltrado["pagina"] = intval($filtro["pagina"]);
        $datosFiltrado["limite"] = intval($filtro["limite"]);
        //Cogemos los datos
        $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datosFiltrado);
        if(!$pdoStatement instanceof \PDOStatement){
            throw new \PDOException($pdoStatement);
        }
        //Cogemos todas las tuplas
        $historial = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
        return ["numPag" => $numPag, "historial" => $historial];
    }

    /**
     * Envía una sentencia para que le devuelva las partidas filtradas según los filtros aplicados con un límite de 7 tuplas
     *
     * @param   array  $filtro  Cada uno de los parámetros a filtrar
     *
     * @return  array           La información de cada una de las tuplas
     */
    public function filtarPartidas($filtro) {
        $this->validarCamposForm($filtro);
        $fecha1 = $filtro["fechaIni"] ?? "";
        $fecha2 = $filtro["fechaFin"] ?? "";
        $fechas = $this->comprobarFechas($fecha1, $fecha2, true);
        //Sentencia para contar el número de páginas es como la normal pero contando las tuplas sin limitar
        $sentenciaNumPag = "SELECT COUNT(P.id_partida) as num_pag FROM partidas as P INNER JOIN productos as PR ON P.id_partida NOT IN (SELECT partida FROM usuarios_partidas WHERE usuario = :usuario) AND P.juego_partida = PR.id_producto INNER JOIN juegos AS J ON PR.id_producto = J.juego";
        //Sentencia para pedir los datos
        $sentencia = "SELECT P.id_partida, PR.nombre, PR.imagen_producto as imagen_partida,  J.genero, P.fecha, P.hora_inicio FROM partidas as P INNER JOIN productos as PR ON P.id_partida NOT IN (SELECT partida FROM usuarios_partidas WHERE usuario = :usuario) AND P.juego_partida = PR.id_producto INNER JOIN juegos AS J ON PR.id_producto = J.juego";
        //Datos que pasaremos a la sentencia como parámetros a sustituir
        $datosFiltrado = ["usuario" => $this->getEmail()];
        //Recorremos los filtros y vamos añadiendo
        if (!empty($filtro["genero"])) {
            //Como consigo el género como un string le voy concatenando los elementos (por si hay mas de uno)
            $sentenciaNumPag .= " AND J.genero = :genero";
            $sentencia .= " AND J.genero = :genero";
            $datosFiltrado["genero"] = $filtro["genero"];
        }
        //Compruebo cuantas fechas tengo
        if (count($fechas) == 2) {
            $sentenciaNumPag .= " AND (DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin)";
            $sentencia .= " AND (DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin)";
            $datosFiltrado["fechaIni"] = $fechas[0];
            $datosFiltrado["fechaFin"] = $fechas[1];
        } else if (count($fechas) == 1) {
            $sentenciaNumPag .= " AND (DATE(P.fecha) >= :fechaIni)";
            $sentencia .= " AND (DATE(P.fecha) >= :fechaIni)";
            $datosFiltrado["fechaIni"] = $fechas[0];
        }
        //Calculamos el número de páginas
        $numPag = $this->calcularNumPag($sentenciaNumPag, $datosFiltrado,  intval($filtro["limite"]));
        //Añadimos el límite para la sentencia que recupera los datos
        $sentencia .= " LIMIT :pagina, :limite ;";
        //Los converitmos a int porque como vienen del JSON vienen como string
        $datosFiltrado["pagina"] = intval($filtro["pagina"]);
        $datosFiltrado["limite"] = intval($filtro["limite"]);
        //Instancio la BD
        $bd = new bd();
        //Envio la petición
        $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datosFiltrado);
        if (!$pdoStatement instanceof \PDOStatement) {
            throw new \PDOException($pdoStatement);
        }
        //Cogemos los valores con fetchAll ya que los tenemos limitados, como mucho devuelve 7 tuplas
        $tuplas = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
        $respuesta = ["numPag" => $numPag, "tuplas" => $tuplas];
        return $respuesta;
    }

    /**
     * Calcula el número de tuplas que tendrá el resultado
     *
     * @param   string  $sentencia  Sentencia a ejecutar
     * @param   array  $datos      Datos a pasar
     *
     * @return  int                  Número de páginas que necesita
     */
    function calcularNumPag($sentencia, $datos = [], $limite = 7) {
        try {
            //Instancio la BD
            $bd = new bd();
            //Envio la petición
            $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datos);
            if (!$pdoStatement instanceof \PDOStatement) {
                throw new \PDOException($pdoStatement);
            }
            //Solo hacemos un fetch ya que sólo devolverá un número (el número de página a crear)
            $numPag = $pdoStatement->fetch(\PDO::FETCH_ASSOC)["num_pag"];
            //Calculamos el número de página dividiendolo por el límite
            $numPag = ceil(intval($numPag) / $limite);
        } catch (\PDOException $pdoError) {
            $numPag = "Error " . $pdoError->getCode() . " :" . $pdoError->getMessage();
        } catch (\Exception $error) {
            $numPag = "Error " . $error->getCode() . " :" . $error->getMessage();
        }
        return !is_string($numPag) && $numPag != 0 ? $numPag - 1 : 0;
    }

    /**
     * Comprueba que las fechas tengan valor, que sean posteriores al día actual y las devuelve en orden
     *
     * @param   string  $fecha1  Fecha 1
     * @param   string  $fecha2  Fecha2
     * @param   boolean $soloActuales No deja que las fechas sean anteriores a la fecha actual
     *
     * @return  array           Array con las fechas ordenadas (puede tener 2, 1 o 0 fechas)
     */
    protected function comprobarFechas($fecha1, $fecha2 = "", $soloActuales = true) {
        //Comprobamos que ambos tengan valor
        $validez1 = !empty($fecha1);
        $validez2 = !empty($fecha2);
        $fechasOrdenadas = [];
        //Si ambas tienen valor
        if ($validez1 && $validez2) {
            if($soloActuales) {
                //Comprobamos que sean posteriores al tiempo actual, sino le asignamos la fecha actual
                $fecha1 = $this->devolverFechasPostDiaActual($fecha1);
                $fecha2 = $this->devolverFechasPostDiaActual($fecha2);
            }
            //Comprobamos cual es mayor y asignamos en ese orden
            if ($fecha1 < $fecha2) {
                $fechasOrdenadas = [$fecha1, $fecha2];
            } else if ($fecha1 > $fecha2) {
                $fechasOrdenadas = [$fecha2, $fecha1];
            }
            //Si ambas son iguales sólo devolvemos una fecha
            else {
                $fechasOrdenadas = [$fecha1];
            }
        }
        //Sólo la primera tiene valor
        else if ($validez1 && !$validez2) {
            if($soloActuales) {
                //Comprobamos que sea posteriores al tiempo actual, sino le asignamos la fecha actual
                $fecha1 = $this->devolverFechasPostDiaActual($fecha1);
            }
            $fechasOrdenadas = [$fecha1];
        }
        //Sólo la segunda tiene valor
        else if (!$validez1 && $validez2) {
            if($soloActuales) {
                //Comprobamos que sea posteriores al tiempo actual, sino le asignamos la fecha actual
                $fecha2 = $this->devolverFechasPostDiaActual($fecha2);
            }
            $fechasOrdenadas = [$fecha2];
        }
        return $fechasOrdenadas;
    }

    /**
     * Comprueba que las fechas sean posteriores al día actual, si lo son devuelven la fecha, sino devuelven la fecha de hoy
     *
     * @param   string  $fecha  Fecha a comprobar
     *
     * @return  string       string Con la misma fecha si es posterior o con la fecha actual
     */
    protected function devolverFechasPostDiaActual($fecha)
    {
        $fechaSeg = strtotime($fecha);
        $fechaActualSeg = strtotime("now");
        return $fechaSeg >= $fechaActualSeg ? $fecha : date("Y-m-d");
    }

    /**
     * Busca nombres similares al que le pasamos
     *
     * @param   string  $nombreJuego  Nombre del juego a buscar
     *
     * @return  mixed                O una excepción o un PDOStatement
     */
    public function buscarNombreJuego($nombreJuego) {
        //Validamos el campo
        $this->validarCamposForm($nombreJuego);
        //Instanciamos bd
        $bd = new bd();
        //Creamos la sentencia
        $sentencia = "SELECT PR.id_producto, PR.nombre  FROM productos AS PR INNER JOIN juegos AS J ON PR.id_producto = J.juego AND nombre LIKE ? LIMIT 0, 5";
        $datosAsignar = ["%" . $nombreJuego . "%"];
        //Pasamos el dato a un array para enviarselo a la función
        $pdoStatement = $bd->recuperDatosBD($sentencia, $datosAsignar);
        //Comprobamos que nos devolviera un PDOStatement
        if(!$pdoStatement instanceof \PDOStatement){
            throw new \PDOException($pdoStatement);
        }
        //Hacemos fetchAll ya que la búsqueda está limitada a 5 como mucho
        $juegos = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
        return $juegos;
    }
}
