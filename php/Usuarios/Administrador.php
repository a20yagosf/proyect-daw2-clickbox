<?php
namespace Usuarios;

use \Infraestructuras\Bd as bd;
use \Usuarios\Usuario as user;


class Administrador extends user{

    public function __construct($email, $rol) {
        parent::__construct($email);

        //Comprueba su rol, si no es administrador lanza un error
        $this->rol = $rol;
    }

    // PERFILES
    public function CargarCambiosPerfilTodos(){
        
    }
    public function CambiarRol($usuario, $rolActual){
        
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
    public function crearPartida($datosPartida, $imagenPartida){
        //Primero validamos los datos que nos pasaron en datosPartida
        $this->validarCamposForm($datosPartida);
        //Instanciamos bd
        $bd = new bd();
        //Movemos la imagen
        $carpetaFichero = dirname(__FILE__, 3) . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "partidas";
        $rutaImagen = $bd->gestionarFichero($imagenPartida, $carpetaFichero);
        if(stripos($rutaImagen, "error") !== false) {
            throw new \Exception("No se pudo mover el archivo");
        }
        //Guardamos la ruta relativa
        $rutaImagen = ".." . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "partidas" . DIRECTORY_SEPARATOR . $imagenPartida["name"];
        //Sentencia para crear la partida
        $sentencia = "INSERT INTO partidas (plazas_min, plazas_totales,fecha, hora_inicio, duracion, imagen_partida, director_partida, juego_partida) VALUES (:plazas_min, :plazas_totales,:fecha, :hora_inicio, :duracion, :imagen_partida, :director_partida, :juego_partida)";
        //Añadimos a los datos del director
        $datosPartida["imagen_partida"]  = $rutaImagen;
        $datosPartida["director_partida"] = $this->getEmail();
        $resultado = $bd->agregarModificarDatosBDNum($sentencia, $datosPartida);
        //Comprobamos que fuera un éxito
        if(is_string($resultado) && stripos($resultado, "error") !== false){
            throw new \Exception($resultado);
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
        //Creamos la sentencia
        $sentencia2 = "DELETE FROM usuarios_partidas WHERE partida = :id_partida";
        $sentencia = "DELETE FROM partidas WHERE id_partida = :id_partida";
        $sentencia3 = "DELETE FROM partidas_generos WHERE partida = :id_partida";
        $sentencias = [$sentencia2, $sentencia, $sentencia3];
        //Convertimos el id a int
        $idPartida = intval($idPartida);
        $resultado = $bd->agregarModDatosNumTransaction($sentencias, [["id_partida" =>  $idPartida], ["id_partida" =>  $idPartida], ["id_partida" =>  $idPartida]]);
        if(is_string($resultado) && stripos($resultado, "error") !== false){
            throw new \PDOException($resultado);
        }
    }
    public function aceptarSolicitudPartida(){

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
            $numPag = $this->calcularNumPag($sentenciaNumPag, $datosFiltrado);
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
            if(!is_nan(intval($numPag))){
                $numPag = floor($numPag / $datosFiltrado["limite"]);
            }
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
        $this->validarCamposForm($datosDirector);
        //Instanciamos bd
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