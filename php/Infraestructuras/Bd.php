<?php

namespace Infraestructuras;
//Trait totalmente cualificado

use DateTime;
use DateTimeZone;
use \Traits\Formulario as formulario;

/**
 * Clase con los métodos de tipo estático para la manipulación de la BD
 */
class Bd {
    //Ficheros configuración
    /**
     * Fichero con la configuración de la BD
     *
     * @var string $ficheroConf
     */
    private $ficheroConf;
    /**
     * Fichero con la validación del fichero de configuración de la BD
     *
     * @var string $ficheroConfValidar
     */
    private $ficheroConfValidar;
    /**
     * Trait de formulario para los métodos de validarCampos y comprobarCamposOblig
     */
    use formulario;

    /**
     * Asigna el valor a los ficheros ya que se forma a partir de funciones por lo que no pueden ser constantes que se inicialicen
     *
     */
    function __construct(){
        $this->ficheroConf = dirname(__FILE__, 3) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "xmlConfig.xml";
        $this->ficheroConfValidar = dirname(__FILE__, 3) . DIRECTORY_SEPARATOR  . "config" . DIRECTORY_SEPARATOR . "xmlConfig.xsd";
    }

    /**
     * Crea una conexión la BD
     *
     * @return  PDO  PDO con la conexión
     */
    private function conectarBD() {
        //Leo la configuración del archivo XML para conseguir la ip, base de datos, usuario y contraseña
        $config = $this->leerConfig();
        //Establezco la conexión con la base de datos
        $pdo = new \PDO($config[0], $config[1], $config[2]);
        return $pdo;
    }

    /**
     * Lee la configuración del archivo de configuración de la BD y devuelve el enlace para la conexión (Todo esto dependiendo del rol asignado)
     *
     * @return  string  Configuración para la conexión PDO
     */
    private function leerConfig(){
        //Consigo el rol del usuario
        if(isset($_SESSION["usuario"]["rol"])){
            switch($_SESSION["usuario"]["rol"]) {
                case 1:
                    $rol = "admin";
                    break;

                default: 
                    $rol = "estandar";
            }
        }
        else {
            $rol = "conexion";
        }
    
        //Creo un documento
        $config = new \DOMDocument();
        //Cargo el fichero XML
        $config->load($this->ficheroConf);
        //Lo valido con el fichero de schema
        $resultado = $config->schemaValidate($this->ficheroConfValidar);
        //Si es falso devuelvo false
        if(!$resultado){
            throw new \InvalidArgumentException("Revise el fichero de configuración");
        }
        //Si llega hasta aquí es que la validación tuvo éxito
        //Cargo el fichero xml
        $fichero = simplexml_load_file($this->ficheroConf);
        //Cojo cada uno de los datos con xpath
        $ip = $fichero->xpath("//ip");
        $nombreBd = $fichero->xpath("//nombreBD");
        //Busco el rol que necesito y consigo el padre para tener tambien el nombre y la clve
        $usuario = $fichero->xpath("//rol[.='$rol']/..")[0];
        //Cadena con la configuración de pdo
        $configPdo = sprintf("mysql:dbname=%s;host=%s", $nombreBd[0], $ip[0]);
        //Devuelvo un array con [0 => configuracion lenguaje,dbname y host, 1 => nombre usuario, 2 => clave usuario]
        return [$configPdo, $usuario->nombre, $usuario->clave];
    }

    /**
     * Método para realizar insert, update o delete (Estático)
     *
     * @param   string  $sentencia  Sentencia de la BD a ejecutar
     * @param   array  $datos      Array con los parámetros a asignar en la función preparada
     *
     * @return  boolean             Puede devolver true si se realizó con éxito o false si hubo un error
     */
    public function agregarModificarDatosBD($sentencia, $datos){
        try {
            //Creo la conexión
            $pdo = $this->conectarBD();
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute(array_values($datos));
            if(!$resultado){
                throw new \PDOException($pdoStatement->errorInfo()[2]);
            }
            $resultado = $pdo->lastInsertId();
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch(\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        }
        catch(\Exception $error) {
            $resultado = "Error " . $error->getCode() . ": " . $error->getMessage();
        }
        return $resultado;
    }


    /**
     * Método para realizar insert, update o delete (Estático)
     *
     * @param   string  $sentencia  Sentencia de la BD a ejecutar
     * @param   array  $datos      Array con los parámetros a asignar en la función preparada
     *
     * @return  mixed             Devuelve el id o error
     */
    public function agregarModificarDatosBDNum($sentencia, $datos){
        try {
            //Creo la conexión
            $pdo = $this->conectarBD();
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Asignamos los valores
            foreach($datos as $indice => $valor){
                $tipoDato = is_string($valor) ? \PDO::PARAM_STR : \PDO::PARAM_INT;
                $pdoStatement->bindParam(":" . $indice, $valor, $tipoDato);
                //Limpiamos $indice o valor sino da error para los datos a partir del primero
                unset($indice);
                unset($valor);
            }
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute();
            if(!$resultado){
                throw new \PDOException($pdoStatement->errorInfo()[2]);
            }
            $resultado = $pdo->lastInsertId();
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch(\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        }
        catch(\Exception $error) {
            $resultado = "Error " . $error->getCode() . ": " . $error->getMessage();
        }
        return $resultado;
    }

    /**
     * Método para realizar select (Estático)
     *
     * @param   string  $sentencia  Sentencia de la BD a ejecutar
     * @param   array  $datos      Array con los parámetros a asignar en la función preparada
     *
     * @return  mixed             Puede devolver un pdoStatement con los datos o false si se produjo un error
     */
    public function recuperDatosBD($sentencia, $datos = []) {
        try {
            //Creo la conexión
            $pdo = $this->conectarBD();
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute($datos);
            if(!$resultado){
                throw new \PDOException($pdoStatement->errorInfo()[2]);
            }
            //Devolvemos el $pdoStatement para poder hacer fetch con él
            $resultado = $pdoStatement;
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch(\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        }
        catch(\Exception $error) {
            $resultado = "Error " . $error->getCode() . ": "  . $error->getMessage();
        }
        return $resultado;
    }

    /**
     * Ejecuta y prepara la sentencia que le pasamos, se usa para sentencias que necesitan números como parámetros
     *
     * @param   string  $sentencia  Sentencia a ejecutar
     * @param   array  $datos      Datos a añadir como parámetros
     *
     * @return  mixed                  Devuelve un PDOSTamente o false en caso de error
     */
    public function recuperarDatosBDNum($sentencia, $datos = []) {
        try {
            //Creo la conexión
            $pdo = $this->conectarBD();
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Cargamos los parámetros
            $this->asignarValoresParam($datos, $pdoStatement);
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute();
            if(!$resultado){
                throw new \PDOException($pdoStatement->errorInfo()[2]);
            }
            //Devolvemos el $pdoStatement para poder hacer fetch con él
            $resultado = $pdoStatement;
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch(\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        }
        catch(\Exception $error) {
            $resultado = "Error " . $error->getCode() . ": "  . $error->getMessage();
        }
        return $resultado;
    }

    /**
     * Registra al usuario en la BD
     *
     * @param   array  $datosUsuario  Todos los datos a insertal del usuario
     * @param   array  $datosOblig    Cada uno de los campos que tiene que tener rellenado si o si
     * @param   File  $fichero       Fichero a subir
     *
     * @return  mixed                 Cadena con el error o true si todo fue bien
     */
    public function registrarUsuario($datosUsuario, $datosOblig, $fichero) {
        try {
            //Validamos todos los campos
            $this->validarCamposForm($datosUsuario);
            //Comprobamos que todos los campos sean validos ,si no son válidos lanzamos una excepción
            if(!$this->comprobarCamposOblig($datosUsuario, $datosOblig)){
                throw new \Exception("Debe rellenar todos los campos obligatorios");
            }
            //Comprobamos que las contraseñas coincidan, si no coinciden lanzamos una excepción
            if(!$this->comprobarClaves($datosUsuario["pwd"], $datosUsuario["pwd2"])){
                throw new \Exception("Las contraseñas no coinciden");
            }
            //Eliminamos la segunda contraseña del array ya que no nos hará falta
            unset($datosUsuario["pwd2"]);
            //Comprobamos que el email sea válido
            if(!$this->comprobarEmail($datosUsuario["email"])) {
                throw new \Exception("El email no es válido");
            }
            //Comprobamos que no exista ya alguien con ese correo y que no haya dado un error
            $claveUser = $this->comprobarUsuario($datosUsuario["email"]);
            //Comprobamos que no diera error la sentencia
            if(is_string($claveUser) && stripos($claveUser, "error") !== false){
                throw new \PDOException($claveUser);
            }
            //Comprobamos que no exista el usuairo
            if($claveUser !== false){
                throw new \Exception("Ya existe un usuario registrado con ese correo");
            }
            //Comprobamos que se subiera bien el fichero y lo movemos a una carpeta en el disco duro
            $carpetaFichero = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR  . "img" . DIRECTORY_SEPARATOR  . $datosUsuario["email"];
            $resultado = $this->gestionarFichero($fichero, $datosUsuario["email"], $carpetaFichero);
            //Si no se pudo mover mandamos un error
            if(mb_stristr($resultado, "error") != false){
                throw new \Exception($resultado);
            }
            //Añadimos al array la ruta del archivo para guardarla en la BD
            $datosUsuario["imagenPerfil"] = ".." . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . $datosUsuario["email"] . DIRECTORY_SEPARATOR . $fichero["name"];
            //Hasheamos la contraseña
            $datosUsuario["pwd"] = password_hash($datosUsuario["pwd"], PASSWORD_DEFAULT);
            //Convertimos todos los campos NO obligatorios que NO se rellenaron a null
            $this->comprobarCamposNoOblig($datosUsuario, $datosOblig);
            //Fecha de registro (Como es ahora metemos nosotros la fecha actual) con la zona horaria de Europa, lo mismo para ultima modificación y ultimo acceso
            $fechaRegistro = new DateTime("now");
            //Sentencia para insertar los datos en la BD, no aparece el rol porque por defecto añade el rol estándar en la BD
            $sentencia = "INSERT INTO usuarios (email, pwd, nombre, apellidos, telefono, fecha_nac, fecha_registro, direccion, fecha_ult_modif, fecha_ult_acceso, rol, genero_favorito, imagen_perfil) VALUES (?, ?, ?, ?, ?, ?, '" . date_format($fechaRegistro, "Y-m-d") .  "', ?, '" . date_format($fechaRegistro, "Y-m-d")  . "', '" . date_format($fechaRegistro, "Y-m-d")  . "', 3, ?, ?);";
            //Ejecutamos la sentencia mediante la función que asignará los valores a la sentencia preparada y devolverá el resultado
            $resultado = $this->agregarModificarDatosBD($sentencia, $datosUsuario);
        }
        catch(\Exception $error){
            $resultado = "Error " . $error->getCode() . ": " . $error->getMessage();
        }
        return $resultado;
    }

    /**
     * Asigna los valores a los parametros del PDOStatement
     *
     * @param   array  $valores       Array de valores a asignar
     * @param   [type]  $pdoStatement  [$pdoStatement description]
     *
     * @return  [type]                 [return description]
     */
    private function asignarValoresParam($valores, $pdoStatement) {
        //Asignamos los valores
        foreach($valores as $indice => $valor){
            if(is_array($valor)){
                $this->asignarValoresParam($valor, $pdoStatement);
            }
            else {
                $dato = is_string($valor) ? \PDO::PARAM_STR : \PDO::PARAM_INT;
                $pdoStatement->bindParam((":" . $indice),$valor,$dato);
            }
            //Eliminamos las variables porque sino la segunda sentencia que añade se lía
            unset($indice);
            unset($valor);
        }
    }

    public function loginUsuario($datosUsuario) {
        try {
            //Comprobamos que haya rellenado todos los campos Oblig (En este caso sabemos que todos los campos son obligatorios por lo que le pasamos las claves del arrya asociativo)
            $camposOblig = $this->comprobarCamposOblig($datosUsuario, array_keys($datosUsuario));
        }
        catch (\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        }
        catch(\Exception $error){
            $resultado = "Error " . $error->getCode() . ": " . $error->getMessage();
        }
        return $resultado;
    }

    /**
     * Comprueba que las contraseñas sean iguales
     *
     * @param   string  $clave   Clave introducida por primera vez
     * @param   string  $clave2  Repetición de la contraseña
     *
     * @return  boolean        Si ambas contraseñas son iguales o no
     */
    private function comprobarClaves($clave, $clave2){
        //Comprobamos que ambas contraseñas sean iguales
        return strcmp($clave, $clave2) == 0;
    }

    /**
     * Comprueba que el email sea un email válido
     *
     * @param   string  $email  Email del usuario
     *
     * @return  boolean         Si el email es válido o no
     */
    private function comprobarEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * Comprueba que se subiera bien el fichero y lo mueve a un directorio con el correo del usuario
     *
     * @param   array  $fichero  FIchero a subir con sus propiedades error, tmp_name, size, name
     * @param   string  $usuario  Correo del usuario
     *
     * @return  mixed            Si la operación salió bien (boolean) o hubo algún error (string con el error)
     */
    public function gestionarFichero($fichero, $carpetaFichero){
        //Carpeta donde guardaremos el fichero
        try {
            //Comprobamos que no hubiese errores en la subida
            if($fichero["error"] != 0){
                throw new \RuntimeException ("Hubo un error en la subida del fichero");
            }
            //Comprobamos si existe la carpeta en el disco duro
            if(!is_dir($carpetaFichero)) {
                //Si no existe la creamos
               if(!mkdir($carpetaFichero, 777)) {
                    throw new \RuntimeException("No se pudo crear la carpeta donde guarda la imagen de usuario");
               }
            }
            $nuevaRutaArchivo = $carpetaFichero . DIRECTORY_SEPARATOR . $fichero["name"];
            //Movemos el archivo a la carpeta creada
            $resultado = move_uploaded_file($fichero["tmp_name"], $carpetaFichero . DIRECTORY_SEPARATOR . $fichero["name"]);
            //Si no se pudo mover lanzamos una excepción
            if(!$resultado){
                throw new \RuntimeException("No se puede realizar el cambio de localización del archivo");
            }
            //Guardamos en $resultado la ruta del archivo
            $resultado = $nuevaRutaArchivo;
        }
        catch(\RuntimeException $error){
            $resultado =  "Error " . $error->getCode() . ": " . $error->getMessage();
        }
        //Si es verdadero devolvemos true, sino devolvemos un mensaje diciendo el error
        return $resultado;
    }

    /**
     * Comprueba si el usuario existe y devuelve la contraseña hasheada
     *
     * @param   string  $usuario  Email del usuario
     *
     * @return  mixed            Error o la contraseña del usuario hasheada o false si el usuario no existe
     */
    function comprobarUsuario($usuario) {
        try {
            //Creamos una sentencia que nos devuelva la clave del usuario si coincide el usuario
            $sentencia = "SELECT pwd FROM usuarios WHERE email = ?";
            //Devolvemos lo que nos devuelve (Error o la pwd hasheada del usuario)
            $resultado = $this->recuperDatosBD($sentencia, [$usuario]);
            if(is_string($resultado)){
                throw new \Exception($resultado);
            }
            $resultado = $resultado->fetch(\PDO::FETCH_ASSOC);
        }
        catch(\PDOException $pdoError) {
            return "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        }
        catch(\Exception $error) {
            return "Error " . $error->getCode() . ": " . $error->getMessage();
        }
        return isset($resultado["pwd"]) ? $resultado["pwd"]: false;
    }
}