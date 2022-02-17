<?php

namespace Infraestructuras;
//Trait totalmente cualificado
use \Traits\Formulario as formulario;

/**
 * Clase con los métodos de tipo estático para la manipulación de la BD
 */
abstract class Bd {
    //Ficheros configuración
    /**
     * Fichero con la configuración de la BD
     *
     * @var string FICHERO_CONF
     */
    private const FICHERO_CONF = __DIR__  . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "xmlConfig.xml";
    /**
     * Fichero con la validación del fichero de configuración de la BD
     *
     * @var string FICHERO_CONF
     */
    private const FICHERO_CONF_VALIDAR = __DIR__  . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "xmlConfig.xsd";
    /**
     * Trait de formulario para los métodos de validarCampos y comprobarCamposOblig
     */
    use formulario;

    /**
     * Crea una conexión la BD
     *
     * @return  PDO  PDO con la conexión
     */
    private static function conectarBD() {
        //Leo la configuración del archivo XML para conseguir la ip, base de datos, usuario y contraseña
        $config = Bd::leerConfig();
        //Establezco la conexión con la base de datos
        $pdo = new \PDO($config[0], $config[1], $config[2]);
        return $pdo;
    }

    /**
     * Lee la configuración del archivo de configuración de la BD y devuelve el enlace para la conexión (Todo esto dependiendo del rol asignado)
     *
     * @return  string  Configuración para la conexión PDO
     */
    private static function leerConfig(){
        //Consigo el rol del usuario
        $rol = $_SESSION["usuario"]["rol"] ?? "conexion";
        //Creo un documento
        $config = new \DOMDocument();
        //Cargo el fichero XML
        $config->load(self::FICHERO_CONF);
        //Lo valido con el fichero de schema
        $resultado = $config->schemaValidate(self::FICHERO_CONF_VALIDAR);
        //Si es falso devuelvo false
        if(!$resultado){
            throw new \InvalidArgumentException("Revise el fichero de configuración");
        }
        //Si llega hasta aquí es que la validación tuvo éxito
        //Cargo el fichero xml
        $fichero = simplexml_load_file(self::FICHERO_CONF);
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
    public static function modificarDatosBD($sentencia, $datos){
        try {
            //Creo la conexión
            $pdo = Bd::conectarBD();
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute($datos);
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch(\PDOException $pdoError) {
            $resultado = false;
        }
        catch(\Exception $error) {
            $resultado = false;
        }
        return $resultado;
    }

    /**
     * Método para realizar select (Estático)
     *
     * @param   string  $sentencia  Sentencia de la BD a ejecutar
     * @param   array  $datos      Array con los parámetros a asignar en la función preparada
     *
     * @return  mixed             Puede devolver un array con los datos o false si se produjo un error
     */
    public static function recuperDatosBD($sentencia, $datos) {
        try {
            //Creo la conexión
            $pdo = Bd::conectarBD();
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute($datos);
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch(\PDOException $pdoError) {
            $resultado = false;
        }
        catch(\Exception $error) {
            $resultado = false;
        }
        return $resultado;
    }


    public static function registrarUsuario($datosUsuario, $datosOblig) {
        //Validamos todos los campos
        $datosValidados = Bd::validarCamposForm($datosUsuario);
        //Comprobamos que todos los campos sean validos
        $camposValidos = Bd::comprobarCamposOblig($datosUsuario, $datosOblig);
        if($camposValidos){

            //Hasheamos la contraseña
            $datosUsuario["pwd"] = password_hash($datosUsuario["pwd"], PASSWORD_DEFAULT);
            //Comprobamos que las contraseñas coincidan
            $clavesValidas = Bd::comprobarClaves($datosUsuario["pwd"], $datosUsuario["pwd2"]);
        }
    }

    private static function comprobarClaves($clave, $clave2){
        
    }

}

