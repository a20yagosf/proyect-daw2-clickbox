<?php

namespace Usuarios;

use DateTime;
use \Infraestructuras\Bd as bd;
use PDOException;
use PDOStatement;

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

    public function __construct($email)
    {
        $this->email = $email;
    }

    //Sets y gets
    /**
     * Devuelve el valor del email
     *
     * @return  string  Email del usuario
     */
    public function getEmail()
    {
        return $this->email;
    }

    public function getRol()
    {
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

    /**
     * Envía una sentencia para que le devuelva las partidas filtradas según los filtros aplicados con un límite de 7 tuplas
     *
     * @param   array  $filtro  Cada uno de los parámetros a filtrar
     *
     * @return  array           La información de cada una de las tuplas
     */
    public function filtarPartidas($filtro) {
        $fecha1 = $filtro["fechaIni"];
        $fecha2 = $filtro["fechaFin"];
        $fechas = $this->comprobarFechas($fecha1, $fecha2);
        //Sentencia para contar el número de páginas es como la normal pero contando las tuplas sin limitar
        $sentenciaNumPag = "SELECT COUNT(P.id_partida) as num_pag FROM partidas as P INNER JOIN productos as PR ON P.juego_partida = PR.id_producto INNER JOIN juegos AS J ON PR.id_producto = J.juego";
        //Sentencia para pedir los datos
        $sentencia = "SELECT PR.nombre, P.imagen_partida,  J.genero, P.fecha, P.hora_inicio FROM partidas as P INNER JOIN productos as PR ON P.juego_partida = PR.id_producto INNER JOIN juegos AS J ON PR.id_producto = J.juego";
        //Datos que pasaremos a la sentencia como parámetros a sustituir
        $datosFiltrado = [];
        //Recorremos los filtros y vamos añadiendo
        if (!empty($filtro["genero"])) {
            //Como consigo el género como un string le voy concatenando los elementos (por si hay mas de uno)
            $filtrado = " WHERE genero IN (";
            foreach ($filtro["genero"] as $indice => $valor) {
                $filtrado .= ":" . $indice . ", ";
            }
            //Quito la última coma y espacio
            $filtrado = mb_substr($filtrado, 0, -2);
            $filtrado .= ")";
            $datosFiltrado["genero"] = $filtro["genero"];
        }
        //Compruebo cuantas fechas tengo
        if (count($fechas) == 2) {
            $sentenciaNumPag .= isset($filtrado) ? $filtrado . " AND DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin" : " WHERE DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin";
            $sentencia .= isset($filtrado) ? $filtrado . " AND DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin" : " WHERE DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin";
            $datosFiltrado["fechaIni"] = $fechas[0];
            $datosFiltrado["fechaFin"] = $fechas[1];
        } else if (count($fechas) == 1) {
            $sentenciaNumPag .= isset($filtrado) ? " AND (DATE(P.fecha) >= :fechaIni" : " WHERE DATE(P.fecha) >= :fechaIni)";
            $sentencia .= isset($filtrado) ? " AND (DATE(P.fecha) >= :fechaIni" : " WHERE DATE(P.fecha) >= :fechaIni)";
            $datosFiltrado["fechaIni"] = $fechas[0];
        }
        //Calculamos el número de páginas
        $numPag = $this->calcularNumPag($sentenciaNumPag, $datosFiltrado);
        //Añadimos el límite para la sentencia que recupera los datos
        $sentencia .= " LIMIT :pagina, :limite ;";
        $datosFiltrado["pagina"] = $filtro["pagina"];
        $datosFiltrado["limite"] = $filtro["limite"];
        //Instancio la BD
        $bd = new bd();
        //Envio la petición
        $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datosFiltrado);
        if (!$pdoStatement instanceof \PDOStatement) {
            throw new \PDOException($pdoStatement);
        }
        //Cogemos los valores con fetchAll ya que los tenemos limitados, como mucho devuelve 7 tuplas
        $tuplas = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
        if (!is_nan(intval($numPag))) {
            $numPag = floor($numPag / $filtro["limite"]);
        }
        $respuesta = ["numPag" => $numPag, "tuplas" => $tuplas];
        return $respuesta;
    }

    /**
     * Calcula el número de páginas que tendrá el resultado
     *
     * @param   string  $sentencia  Sentencia a ejecutar
     * @param   array  $datos      Datos a pasar
     *
     * @return  int                  Número de páginas que necesita
     */
    function calcularNumPag($sentencia, $datos = [])
    {
        try {
            //Instancio la BD
            $bd = new bd();
            //Envio la petición
            $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datos);
            if (!$pdoStatement instanceof PDOStatement) {
                throw new \PDOException($pdoStatement);
            }
            //Solo hacemos un fetch ya que sólo devolverá un número (el número de página a crear)
            $numPag = $pdoStatement->fetch(\PDO::FETCH_ASSOC)["num_pag"];
        } catch (\PDOException $pdoError) {
            $numPag = "Error " . $pdoError->getCode() . " :" . $pdoError->getMessage();
        } catch (\Exception $error) {
            $numPag = "Error " . $error->getCode() . " :" . $error->getMessage();
        }
        return $numPag;
    }

    /**
     * Comprueba que las fechas tengan valor, que sean posteriores al día actual y las devuelve en orden
     *
     * @param   string  $fecha1  Fecha 1
     * @param   string  $fecha2  Fecha2
     *
     * @return  array           Array con las fechas ordenadas (puede tener 2, 1 o 0 fechas)
     */
    protected function comprobarFechas($fecha1, $fecha2 = "")
    {
        //Comprobamos que ambos tengan valor
        $validez1 = !empty($fecha1);
        $validez2 = !empty($fecha2);
        $fechasOrdenadas = [];
        //Si ambas tienen valor
        if ($validez1 && $validez2) {
            //Comprobamos que sean posteriores al tiempo actual, sino le asignamos la fecha actual
            $fecha1 = $this->devolverFechasPostDiaActual($fecha1);
            $fecha2 = $this->devolverFechasPostDiaActual($fecha2);
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
            //Comprobamos que sea posteriores al tiempo actual, sino le asignamos la fecha actual
            $fecha1 = $this->devolverFechasPostDiaActual($fecha1);
            $fechasOrdenadas = [$fecha1];
        }
        //Sólo la segunda tiene valor
        else if (!$validez1 && $validez2) {
            //Comprobamos que sea posteriores al tiempo actual, sino le asignamos la fecha actual
            $fecha2 = $this->devolverFechasPostDiaActual($fecha2);
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
}
