<?php
namespace Usuarios;

use \Infraestructuras\Bd as bd;
use \Usuarios\Usuario as user;
use \Infraestructuras\Email as mail;


class Administrador extends user{

    public function __construct($email, $rol) {
        parent::__construct($email);

        //Comprueba su rol, si no es administrador lanza un error
        $this->rol = $rol;
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
            $datosFiltrado = [];
            //Si es el propio
            if($propio){
                $datosFiltrado["email"] = $this->getEmail();
                //Instanciamos bd
                $bd = new bd();
                //Sentencia
                $sentenciaNumPag = "SELECT count(*) as num_pag FROM historico_usuarios WHERE email = :email";
                $sentencia = "SELECT fecha_ult_modif, CONCAT(email , '; ', rol, '; ', nombre, '; ', apellidos, '; ', IFNULL(telefono, ''), '; ', IFNULL(direccion, ''), '; ', IFNULL(genero_favorito, ''), '; ', IFNULL(suscripcion, ''), '; ', IFNULL(renovar, '')) AS datos FROM historico_usuarios WHERE email = :email";
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
            }
            //Si es el del otro
            else {
                //Instanciamos bd
                $bd = new bd();
                //Sentencia
                $sentenciaNumPag = "SELECT count(*) as num_pag FROM historico_usuarios";
                $sentencia = "SELECT fecha_ult_modif, CONCAT(email , '; ', rol, '; ', nombre, '; ', apellidos, '; ', IFNULL(telefono, ''), '; ', IFNULL(direccion, ''), '; ', IFNULL(genero_favorito, ''), '; ', IFNULL(suscripcion, ''), '; ', IFNULL(renovar, '')) AS datos FROM historico_usuarios";
                //Comprobamos si cogemos las fechas
                if(count($fechas) == 2){
                    $sentenciaNumPag .= " WHERE DATE(fecha_ult_modif) BETWEEN :fechaIni AND :fechaFin";
                    $sentencia .= " WHERE DATE(fecha_ult_modif) BETWEEN :fechaIni AND :fechaFin";
                    $datosFiltrado["fechaIni"] = $filtro["fechaIni"];
                    $datosFiltrado["fechaFin"] = $filtro["fechaFin"];
                }
                else if(count($fechas) == 1){
                    $sentenciaNumPag .= " WHERE DATE(fecha_ult_modif) >= :fechaIni";
                    $sentencia .= " WHERE DATE(fecha_ult_modif) >= :fechaIni";
                    $datosFiltrado["fechaIni"] = $filtro["fechaIni"];
                }
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
     * Cambia el rol del usuario
     *
     * @param   string  $usuario    Email del usuario
     * @param   int  $rolActual  Rol actual
     *
     * @return  mixed            String con el error o 0
     */
    public function cambiarRol($usuario, $rolActual){
        //Instanciamos BD
        $bd = new bd();
        //Creamos una sentencia que cambie el rol del usuario elegido por el rol seleccionado
        $sentencia = "UPDATE usuarios SET rol = :rol WHERE email = :email";
        $datosUsuario["rol"] = intval($rolActual);
        $datosUsuario["email"] = $usuario;
        // Ahora intentamos hacer el cambio
        $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosUsuario);
        return $resultado;
    }

    /**
     * Carga los usuairos y las páginas que necesitará mostrar
     *
     * @param   array  $filtroUsuario  Array asociativo con los datos a filtrar , como mínimo tendrá página y filtro
     *
     * @return  array                  Array con los datos conseguidos
     */
    public function cargarUsuarios($filtroUsuario) {
        //Instanciamos bd
        $bd = new bd();
        //Creamos la sentencia
        $sentenciaNumPag = "SELECT COUNT(email) as num_pag FROM usuarios";
        $sentencia = "SELECT email, rol FROM usuarios";
        $datosFiltrado = [];
        //Comprobamos los filtros que puede tener
        if(isset($filtroUsuario["email"])){
            $sentenciaNumPag .= " WHERE email LIKE :email";
            $sentencia .= " WHERE email LIKE :email";
            $datosFiltrado["email"] = "%" . $filtroUsuario["email"] . "%";
        }
        if(!empty($filtroUsuario["rol"])) {
            $sentenciaNumPag .= isset(($filtroUsuario["email"])) ? " AND rol = :rol" : " WHERE rol = :rol";
            $sentencia .= isset(($filtroUsuario["email"])) ? " AND rol = :rol" : " WHERE rol = :rol";
            $datosFiltrado["rol"] = intval($filtroUsuario["rol"]);
        }
        //Calculamos el número de la página
        $numPag = $this->calcularNumPag($sentenciaNumPag, $datosFiltrado, 7);
        //LE ponemos el limite
        $sentencia .= " LIMIT :pagina, :limite";
        $datosFiltrado["pagina"] = intval($filtroUsuario["pagina"]);
        $datosFiltrado["limite"] = intval($filtroUsuario["limite"]);
        //Calculamos los usuarios
        $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datosFiltrado);
        //Comprobamos que no diera error
        if(!$pdoStatement instanceof \PDOStatement){
            throw new \PDOException($pdoStatement);
        }
        //Cogemos todos los datos porque tiene le límite (sólo devolvera limite tuplas)
        $datosUsuarios = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
        return ["numPag" => $numPag, "datosUsuarios" => $datosUsuarios];
    }

    // PRODUCTOS

    public function editarProducto(){
        
    }
    public function eliminarProducto(){
        
    }
    public function crearProducto(){ // producto o accesorio
        
    }

    // PARTIDAS
    /**
     * Crea una partida
     *
     * @param   array  $datosPartida   Datos de la partida
     * @param   $_FILE  $imagenPartida  Archivo a subir
     *
     * @return  bool                  Si se creo la partida con éxito
     */
    public function crearPartida($datosPartida, $imagenesPartida){
        //Primero validamos los datos que nos pasaron en datosPartida
        $this->validarCamposForm($datosPartida);
        //Instanciamos bd
        $bd = new bd();
       try {
            //Empezamos la transaccion
            $pdo = $bd->iniciarTransaccionManual();
            //Movemos la imagen
            $carpetaFichero = dirname(__FILE__, 3) . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "partidas";
            $rutaImagenes = $bd->gestionarFichero($imagenesPartida, $carpetaFichero);
            if(is_string($rutaImagenes) && stripos($rutaImagenes, "error") !== false) {
                throw new \Exception("No se pudo mover el archivo");
            }
            //Sentencia para crear la partida
            $sentencia = "INSERT INTO partidas (plazas_min, plazas_totales,fecha, hora_inicio, duracion, director_partida, juego_partida) VALUES (:plazas_min, :plazas_totales,:fecha, :hora_inicio, :duracion, :director_partida, :juego_partida)";
            $sentencia2 = "INSERT INTO partidas_imagenes (partida, imagen) VALUES";
            //Guardamos la ruta relativa de cada una de las imágenes y añadimos las lineas de la sentencia
            foreach($imagenesPartida["name"] as $indice => $nombreImagen){
                $datosImagenPartida["imagen" . $indice] = ".." . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "partidas" . DIRECTORY_SEPARATOR . $nombreImagen;
                $sentencia2 .= " (:partida, :imagen$indice),";
            }
            //Añadimos el indice de la partida
            //Quitamos la última coma
            $sentencia2 = substr($sentencia2, 0, -1);
            //Añadimos a los datos del director
            $datosPartida["director_partida"] = $this->getEmail();
            //Realizamos la primera sentencia
            $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosPartida, $pdo);
            //Comprobamos que fuera un éxito
            if(is_string($resultado) && stripos($resultado, "error") !== false){
                throw new \Exception($resultado);
            }
            //Si no es un error $resultado el es indice de la inserción
            $datosImagenPartida["partida"] = intval($resultado);
            //Realizamos la segunda sentencia
            $resultado = $bd->agregarModificarDatosBDNum($sentencia2, $datosImagenPartida, $pdo);
            //Comprobamos que fuera un éxito
            if(is_string($resultado) && stripos($resultado, "error") !== false){
                throw new \Exception($resultado);
            }
            //Si fue un éxito hacemos commit
            $pdo->commit();
       }
       catch (\PDOException $pdoError){
            $pdo->rollBack();
            return "Error " . $pdoError->getMessage();
        }
        catch(\Exception $error){
            $pdo->rollBack();
            return "Error " . $error->getMessage();
        }
        return true;
    }
    
    /**
     * Devuelve los datos de la partida a editar
     *
     * @param   int  $idPartida  ID de la partida
     *
     * @return  mixed              Devuelve array con los datos o una Excepción
     */
    public function recuperarDatosActualesPartida($idPartida){
        //Primero validamos los datos que nos pasaron en datosPartida
        $this->validarCamposForm($idPartida);
        //Instanciamos la BD
        $bd = new bd();
        //Creamos la sentencia
        $sentencia = "SELECT P.juego_partida, PR.nombre as nombre_juego, P.fecha, P.plazas_min, P.plazas_totales, P.hora_inicio, P.duracion, P.director_partida  FROM partidas AS P INNER JOIN productos as PR ON P.juego_partida = PR.id_producto WHERE id_partida = :id_partida";
        //Guardamos el id en un array ya que es lo que pide el método y lo convertimos a int ya que al venir de JSOn viene como string
        $datosAsignar = ["id_partida" => intval($idPartida)];
        //Mandamos la sentencia para que se ejecute
        $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datosAsignar);
        //Comprobamos si nos devolvió un $pdoStatement
        if(!$pdoStatement instanceof \PDOStatement){
            throw new \PDOException($pdoStatement);
        }
        //Hacemos fetch con los datos, como el id es único sólo hacemos un fetch
        $datosPartida = $pdoStatement->fetch(\PDO::FETCH_ASSOC);
        //Comprobamos que nos devolviera algo
        if(!$datosPartida) {
            throw new \Exception("No existe esa partida");
        }
        return $datosPartida;
    }

    /**
     * Guarda los nuevos datos de la partida
     *
     * @param   array  $datosPartida  Datos a insertar
     *
     * @return  void                 No devuelve nada
     */
    public function editarPartida($datosPartida){
        //Validamos los campos
        $this->validarCamposForm($datosPartida);
        //Instanciamos bd
        $bd = new bd();
        //Creamos la sentencia
        $sentencia = "UPDATE partidas as P SET  plazas_min = :plazas_min, plazas_totales = :plazas_totales, fecha = :fecha, hora_inicio = :hora_inicio, duracion = :duracion, director_partida = :director_partida, juego_partida = :juego_partida WHERE id_partida = :id_partida";
        $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosPartida);
        //Comprobamos que no diera error
        if(is_string($resultado) && stripos($resultado, "error") !== false){
            throw new \PDOException($resultado);
        }
    }

    /**
     * Elimina la partida y todas las tuplas asociadas a ella
     *
     * @param   int  $idPartida  Id de la partida a eliminar
     *
     * @return  void              No devuelve nada
     */
    public function eliminarPartida($idPartida){
        //Validamos los cmapos
        $this->validarCamposForm($idPartida);
        //instanciamos bd
        $bd = new bd();
        try {
            //Iniciamos la transacción manual
            $pdo = $bd->iniciarTransaccionManual();
            //Convertimos el id a int
            $idPartida = ["id_partida" => intval($idPartida)];
            //Cogemos los datos de la partida
            $sentenciaPartida = "SELECT fecha from partidas WHERE id_partida = :id_partida;";
            $pdoStatement = $bd->recuperarDatosBDNum($sentenciaPartida, $idPartida);
            if(!$pdoStatement instanceof \PDOStatement){
                throw new \PDOException($pdoStatement);
            }
            $fechaPartida = $pdoStatement->fetch(\PDO::FETCH_ASSOC);
            unset($pdoStatement);
            //Cogemos los correos que estean asociados a esa
            $sentenciaDatos = "SELECT usuario FROM usuarios_partidas WHERE partida = :id_partida;";
            $pdoStatement = $bd->recuperarDatosBDNum($sentenciaDatos, $idPartida);
            if(!$pdoStatement instanceof \PDOStatement){
                throw new \PDOException($pdoStatement);
            }
            //Creamos la sentencia
            $sentencia2 = "DELETE FROM usuarios_partidas WHERE partida = :id_partida";
            $sentencia = "DELETE FROM partidas WHERE id_partida = :id_partida";
            $sentencias = [$sentencia2, $sentencia];
            foreach($sentencias as $sentencia) {
                $resultado = $bd->agregarModificarDatosBDNum($sentencia, $idPartida, $pdo);
                //Comprobamos que no diera error
                if(is_string($resultado) && stripos($resultado, "error") !== false){
                    throw new \PDOException($resultado);
                }
            }
            //Si llegamos hasta aquí es que no hubo ningún error asique Enviamos el correo a cada uno de las personas
            $email = new mail();
            while($tupla = $pdoStatement->fetch(\PDO::FETCH_ASSOC)){
                $correoEnviado = $email->enviarCorreos($tupla["usuario"], "cancelar partida", $fechaPartida);
                if($correoEnviado !== true) {
                    throw new \Exception($correoEnviado);
                }
            }
            $pdo->commit();
        }
        catch (\PDOException $pdoError){
            $pdo->rollBack();
            return "Error " . $pdoError->getMessage();
        }
        catch(\Exception $error){
            $pdo->rollBack();
            return "Error " . $error->getMessage();
        }
    }

    /**
     * Acepta la solicitud de reserva del usuairo
     *
     * @param   array  $datosReserva  Array con los datos a agregar en la consulta (id_partida e usuario)
     *
     * @return  void                 No devuelve nada
     */
    public function aceptarSolicitudPartida ($datosReserva) {
        $this->validarCamposForm($datosReserva);
        //Convertimos el id  a int ya que como viene de json viene como string
        $datosReserva["id_partida"] = intval($datosReserva["id_partida"]);
        //Instanciamos bd
        $bd = new bd();
        try {
            //Iniciamos una transacción manual
            $pdo = $bd->iniciarTransaccionManual();
            //Relizamos una consulta para coger los datos de la partida
            $sentencia = "SELECT P.fecha, P.hora_inicio, P.duracion, PR.nombre as juego FROM partidas AS P INNER JOIN productos AS PR ON P.id_partida = :id_partida AND P.juego_partida = PR.id_producto;";
            $pdoStatement = $bd->recuperarDatosBDNum($sentencia, ["id_partida" => $datosReserva["id_partida"]]);
            if(!$pdoStatement instanceof \PDOStatement){
                throw new \PDOException($pdoStatement);
            }
            $datos = $pdoStatement->fetch(\PDO::FETCH_ASSOC);
            if(empty($datos)){
                throw new \Exception("No existe esa partida");
            }
            //Sentencia para hacer update
            $sentencia = "UPDATE usuarios_partidas SET reservada = 1 WHERE partida = :id_partida AND usuario = :usuario;";
            $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosReserva);
            if(is_string($resultado) && stripos($resultado, "error") !== false){
                throw new \PDOException($resultado);
            }
            //Si llegó hasta aquí es que se realizó con éxito por lo que enviamos el correo
            $email = new mail();
            //Añadimos a datos que ha sido aceptada
            $datos["aceptada"] = true;
            $correoEnviado = $email->enviarCorreos($datosReserva["usuario"], "reserva", $datos);
            if($correoEnviado !== true) {
                throw new \Exception($correoEnviado);
            }
            $pdo->commit();
        }
        catch (\PDOException $pdoError){
            $pdo->rollBack();
            return "Error " . $pdoError->getMessage();
        }
        catch(\Exception $error){
            $pdo->rollBack();
            return "Error " . $error->getMessage();
        }
    }

    /**
     * Elimina la solicitud de reserva
     *
     * @param   array  $datosReserva  Array con los datos a agregar (id_partida e usuario)
     *
     * @return  void                 No devuelve nada
     */
    public function rechazarSolicitudPartida($datosReserva) {
        $this->validarCamposForm($datosReserva);
        //Instanciamos bd
        $bd = new bd();
        try {
            //Iniciamos una transacción manual
            $pdo = $bd->iniciarTransaccionManual();
            //Relizamos una consulta para coger los datos de la partida
            $sentencia = "SELECT P.fecha, P.hora_inicio, P.duracion, PR.nombre as juego FROM partidas AS P INNER JOIN productos AS PR ON P.id_partida = :id_partida AND P.juego_partida = PR.id_producto;";
            $pdoStatement = $bd->recuperarDatosBDNum($sentencia, ["id_partida" => $datosReserva["id_partida"]], $pdo);
            if(!$pdoStatement instanceof \PDOStatement){
                throw new \PDOException($pdoStatement);
            }
            $datos = $pdoStatement->fetch(\PDO::FETCH_ASSOC);
            if(empty($datos)){
                throw new \Exception("No existe esa partida");
            }
            //Sentencia para elimina de la BD
            $sentencia = "DELETE FROM usuarios_partidas WHERE partida = :id_partida AND usuario = :usuario;";
            //Convertimos el id  a int ya que como viene de json viene como string
            $datosReserva["id_partida"] = intval($datosReserva["id_partida"]);
            $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosReserva);
            if(is_string($resultado) && stripos($resultado, "error") !== false){
                throw new \PDOException($resultado);
            }
            //Si llegó hasta aquí es que se realizó con éxito por lo que enviamos el correo
            $email = new mail();
            //Añadimos a datos que ha sido rechazada
            $datos["rechazada"] = true;
            $correoEnviado = $email->enviarCorreos($datosReserva["usuario"], "reserva", $datos);
            if($correoEnviado !== true) {
                throw new \Exception($correoEnviado);
            }
        }
        catch (\PDOException $pdoError){
            $pdo->rollBack();
            return "Error " . $pdoError->getMessage();
        }
        catch(\Exception $error){
            $pdo->rollBack();
            return "Error " . $error->getMessage();
        }
    }

    public function filtrarReservas($datosPartida) {
        try {
            //Validamos los campos
            $this->validarCamposForm($datosPartida);
            //Comprobamos las fechas
            $fecha1 = $datosPartida["fecha"] ?? "";
            $fecha2 = $datosPartida["fechaFin"] ?? "";
            $fechas = $this->comprobarFechas($fecha1, $fecha2, false);
            //Parametros que le vamos a pasar para filtrar los datos
            $datosFiltrado = [];
            //Sentencias
            //Sentencia para contar el número de páginas es como la normal pero contando las tuplas sin limitar
            $sentenciaNumPag = "SELECT COUNT(UP.partida) as num_pag FROM usuarios_partidas as UP";
            //Sentenica para los datos
            $sentencia = "SELECT UP.partida as id_partida, UP.usuario, P.fecha, PR.nombre, P.director_partida  FROM usuarios_partidas as UP INNER JOIN partidas as P ON UP.reservada = 0 AND UP.partida = P.id_partida INNER JOIN productos as PR ON P.juego_partida = PR.id_producto";
            //Compruebo si se aplicó algún filtro
            if(!empty($datosPartida["usuario"])){
                $sentenciaNumPag .= " AND (UP.usuario LIKE :usuario)";
                $sentencia .= " AND (UP.usuario LIKE :usuario)";
                //Convertimos el elemento a int ya que como viene de  JS viene como cadena
                $datosFiltrado["usuario"] = "%" . $datosPartida["usuario"] . "%";
            }
            //Compruebo cuantas fechas tengo
            if(count($fechas) == 2) {
                $sentenciaNumPag .= " AND (DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin)";
                $sentencia .= " AND (DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin)";
                $datosFiltrado["fechaIni"] = $fechas[0];
                $datosFiltrado["fechaFin"] = $fechas[1];
            }
            else if(count($fechas) == 1){
                $sentenciaNumPag .= " AND (DATE(P.fecha) >= :fechaIni)";
                $sentencia .= " AND (DATE(P.fecha) >= :fechaIni)";
                $datosFiltrado["fechaIni"] = $fechas[0];
            }
            //Calculamos el número de páginas
            $numPag = $this->calcularNumPag($sentenciaNumPag, $datosFiltrado,  intval($datosPartida["limite"]));
            //Añadimos el límite para la sentencia que recupera los datos
            $sentencia .= " LIMIT :pagina, :limite ;";
            //Convertimos los elementos a int ya que como viene de  JS viene como cadena
            $datosFiltrado["pagina"] = intval($datosPartida["pagina"]);
            $datosFiltrado["limite"] = intval($datosPartida["limite"]); 
            //Instanciamos la bd
            $bd = new bd();
            //Envio la petición
            $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datosFiltrado);
            if(!$pdoStatement instanceof \PDOStatement){
                throw new \PDOException($pdoStatement);
            }
            //Cogemos los valores con fetchAll ya que los tenemos limitados, como mucho devuelve 7 tuplas
            $tuplas = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
            $respuesta = ["numPag" => $numPag, "reservas" => $tuplas];
        }
        catch(\PDOException $pdoError) {
            $respuesta = "Error " . $pdoError->getCode() . " :" . $pdoError->getMessage();
        }
        catch(\Exception $error){
            $respuesta = "Error " . $error->getCode() . " :" . $error->getMessage();
        }
        return $respuesta;
    }

    /**
     * Filtra las partidas que muestra al administrador
     *
     * @param   array  $datosPartida  Array con los datos a filtrar de la partida
     *
     * @return  mixed                 O el error en string o un objeto
     */
    public function filtarPartidas($datosPartida) {
        try {
            //Validamos los campos
            $this->validarCamposForm($datosPartida);
            //Comprobamos las fechas
            $fecha1 = $datosPartida["fecha"] ?? "";
            $fecha2 = $datosPartida["fechaFin"] ?? "";
            $fechas = $this->comprobarFechas($fecha1, $fecha2, false);
            //Parametros que le vamos a pasar para filtrar los datos
            $datosFiltrado = [];
            //Sentencias
            //Sentencia para contar el número de páginas es como la normal pero contando las tuplas sin limitar
            $sentenciaNumPag = "SELECT COUNT(P.id_partida) as num_pag from partidas as P INNER JOIN productos as PR ON P.juego_partida = PR.id_producto";
            //Sentenica para los datos
            $sentencia = "SELECT P.id_partida, PR.nombre as juego_partida, P.fecha,  CONCAT(P.plazas_min, '-', P.plazas_totales) as num_jugadores, P.director_partida  from partidas as P INNER JOIN productos as PR ON P.juego_partida = PR.id_producto";
            //Compruebo si se aplicó algún filtro
            if(!empty($datosPartida["juego_partida"])){
                $sentenciaNumPag .= " AND (PR.nombre LIKE :juego_partida)";
                $sentencia .= " AND (PR.nombre LIKE :juego_partida)";
                //Convertimos el elemento a int ya que como viene de  JS viene como cadena
                $datosFiltrado["juego_partida"] = "%" . $datosPartida["juego_partida"] . "%";
            }
            //Compruebo cuantas fechas tengo
            if(count($fechas) == 2) {
                $sentenciaNumPag .= " AND (DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin)";
                $sentencia .= " AND (DATE(P.fecha) BETWEEN :fechaIni AND :fechaFin)";
                $datosFiltrado["fechaIni"] = $fechas[0];
                $datosFiltrado["fechaFin"] = $fechas[1];
            }
            else if(count($fechas) == 1){
                $sentenciaNumPag .= " AND (DATE(P.fecha) >= :fechaIni)";
                $sentencia .= " AND (DATE(P.fecha) >= :fechaIni)";
                $datosFiltrado["fechaIni"] = $fechas[0];
            }
            //Calculamos el número de páginas
            $numPag = $this->calcularNumPag($sentenciaNumPag, $datosFiltrado,  intval($datosPartida["limite"]));
            //Añadimos el límite para la sentencia que recupera los datos
            $sentencia .= " LIMIT :pagina, :limite ;";
            //Convertimos los elementos a int ya que como viene de  JS viene como cadena
            $datosFiltrado["pagina"] = intval($datosPartida["pagina"]);
            $datosFiltrado["limite"] = intval($datosPartida["limite"]); 
            //Instanciamos la bd
            $bd = new bd();
            //Envio la petición
            $pdoStatement = $bd->recuperarDatosBDNum($sentencia, $datosFiltrado);
            if(!$pdoStatement instanceof \PDOStatement){
                throw new \PDOException($pdoStatement);
            }
            //Cogemos los valores con fetchAll ya que los tenemos limitados, como mucho devuelve 7 tuplas
            $tuplas = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
            $respuesta = ["numPag" => $numPag, "partidas" => $tuplas];
        }
        catch(\PDOException $pdoError) {
            $respuesta = "Error " . $pdoError->getCode() . " :" . $pdoError->getMessage();
        }
        catch(\Exception $error){
            $respuesta = "Error " . $error->getCode() . " :" . $error->getMessage();
        }
        return $respuesta;
    }
    
    // PANEL DE CONTROL

    public function cambiarVista(){ // alternar entre vista del panel de control y vista estándar

    }

    //JUEGOS
    /**
     * Carga 100 juegos (En el futuro se ampliará para poder cargar todos pero en tandas)
     *
     * @return  mixed  PDOStament o error
     */
    public function cargarJuegos() {
        //Instancio bd
        $bd = new bd();
        //Sentenica para pedir los juegos, limitamos a 100 para tener un número controlado y poder hacer fetch all, ya el número de juegos no se puede controlar
        //En el futuro plantearemos una forma más eficiente de buscar los juegos que pueda ir mostrando a pocos todos los juegos para seleccionar el adecuado, ya que esto haría que no se vieran todos los juegos si hay muchos
        $sentencia = "SELECT P.id_producto, P.nombre FROM productos as P INNER JOIN juegos as J ON P.id_producto = J.juego LIMIT 0, 100;";
        $resultado = $bd->recuperDatosBD($sentencia);
        if(!$resultado instanceof \PDOStatement){
            throw new \PDOException($resultado);
        }
        $resultado = $resultado->fetchAll(\PDO::FETCH_ASSOC);
        if(!$resultado){
            throw new \Exception("No hay ningún juego");
        }
        return $resultado;
    }

    //Directores partida
    public function buscarNombreDirectorPartida($datosDirector) {
        //Validamos el campo
        $this->validarCamposForm($datosDirectr);
        //Instanciamos bdo
        $bd = new bd();
        //Creamos la sentencia
        $sentencia = "SELECT email as nombre  FROM usuarios WHERE rol = 1 AND email LIKE ? LIMIT 0, 5";
        $datosAsignar = ["%" . $datosDirector . "%"];
        //Pasamos el dato a un array para enviarselo a la función
        $pdoStatement = $bd->recuperDatosBD($sentencia, $datosAsignar);
        //Comprobamos que nos devolviera un PDOStatement
        if(!$pdoStatement instanceof \PDOStatement){
            throw new \PDOException($pdoStatement);
        }
        //Hacemos fetchAll ya que la búsqueda está limitada a 5 como mucho
        $director_partida = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
        return $director_partida;
    }
    
}