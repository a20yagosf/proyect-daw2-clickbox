<?php

namespace Infraestructuras;
//Trait totalmente cualificado

use DateTime;
use DateTimeZone;
use PDOException;
use \Traits\Formulario as formulario;
use \ServiciosProductos\Suscripcion as suscription;

/**
 * Clase con los métodos de tipo estático para la manipulación de la BD
 */
class Bd
{
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
    function __construct()
    {
        $this->ficheroConf = dirname(__FILE__, 3) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "xmlConfig.xml";
        $this->ficheroConfValidar = dirname(__FILE__, 3) . DIRECTORY_SEPARATOR  . "config" . DIRECTORY_SEPARATOR . "xmlConfig.xsd";
    }

    /**
     * Crea una conexión la BD
     *
     * @return  PDO  PDO con la conexión
     */
    private function conectarBD()
    {
        //Leo la configuración del archivo XML para conseguir la ip, base de datos, usuario y contraseña
        $config = $this->leerConfig();
        //Establezco la conexión con la base de datos
        $pdo = new \PDO($config[0] . ";charset=UTF8", $config[1], $config[2]);
        return $pdo;
    }

    /**
     * Lee la configuración del archivo de configuración de la BD y devuelve el enlace para la conexión (Todo esto dependiendo del rol asignado)
     *
     * @return  string  Configuración para la conexión PDO
     */
    private function leerConfig()
    {
        //Consigo el rol del usuario
        if (isset($_SESSION["usuario"]["rol"])) {
            switch ($_SESSION["usuario"]["rol"]) {
                case 1:
                    $rol = "admin";
                    break;

                default:
                    $rol = "estandar";
            }
        } else {
            $rol = "conexion";
        }

        //Creo un documento
        $config = new \DOMDocument();
        //Cargo el fichero XML
        $config->load($this->ficheroConf);
        //Lo valido con el fichero de schema
        $resultado = $config->schemaValidate($this->ficheroConfValidar);
        //Si es falso devuelvo false
        if (!$resultado) {
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
    public function agregarModificarDatosBD($sentencia, $datos)
    {
        try {
            //Creo la conexión
            $pdo = $this->conectarBD();
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute(array_values($datos));
            if (!$resultado) {
                throw new \PDOException($pdoStatement->errorInfo()[2]);
            }
            $resultado = $pdo->lastInsertId();
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch (\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        } catch (\Exception $error) {
            $resultado = "Error " . $error->getCode() . ": " . $error->getMessage();
        }
        return $resultado;
    }

    /**
     * Ejecuta diversas funciones en una transacción
     *
     * @param   array  $sentencias  Array de sentencias a ejecutar
     * @param   array  $datos       Array con los datos a asignar
     *
     * @return  mixed               Puede devolver error
     */
    public function agregarModDatosNumTransaction($sentencias, $datos)
    {
        try {
            //Creamos la conexión
            $pdo = $this->conectarBD();
            //Iniciamos la transacción
            $pdo->beginTransaction();
            //Recorremos las sentencias y vamos ejecutándolas
            for ($i = 0; $i < count($sentencias); $i++) {
                $pdoStatement = $pdo->prepare($sentencias[$i]);
                if (!$pdoStatement) {
                    throw new \PDOException($pdo->errorInfo()[2]);
                }
                //asignamos los datos
                foreach ($datos[$i] as $indice => $valor) {
                    $dato = is_string($valor) ? \PDO::PARAM_STR : \PDO::PARAM_INT;
                    $pdoStatement->bindParam(":" . $indice, $valor, $dato);
                    //Eliminamos el $indice y valor para que no de errores
                    unset($indice);
                    unset($valor);
                }
                //Lo ejecutamos
                $resultado = $pdoStatement->execute();
                if (!$resultado) {
                    throw new \PDOException($pdoStatement->errorInfo()[2]);
                }
            }
            //Si llegamos hasta aquí es que se ejecutó todo
            $pdo->commit();
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch (\PDOException $pdoError) {
            $pdo->rollBack();
            return "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        } catch (\Exception $error) {
            $pdo->rollBack();
            return "Error " . $error->getCode() . ": " . $error->getMessage();
        }
    }

    /**
     * Conecta con PDo e inicia la transacción, es usado para cuanto tenemos que hacer opciones que no tienen que ver con la BD pero necesitamos que si fallan se anulen las acciones en la BD también
     *
     * @return  PDO  Devuelve el pdo
     */
    public function iniciarTransaccionManual()
    {
        //Leemos la configuración
        $pdo = $this->conectarBD();
        //iniciamos la transaccion
        $pdo->beginTransaction();
        return $pdo;
    }

    /**
     * Método para realizar insert, update o delete (Estático)
     *
     * @param   string  $sentencia  Sentencia de la BD a ejecutar
     * @param   array  $datos      Array con los parámetros a asignar en la función preparada
     * @param   PDO     $pdo    Elemento PDO que usamos en una transaccion manual
     *
     * @return  mixed             Devuelve el id o error
     */
    public function agregarModificarDatosBDNum($sentencia, $datos, $pdo = "")
    {
        try {
            if ($pdo == "") {
                //Creo la conexión
                $pdo = $this->conectarBD();
            }
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Asignamos los valores
            foreach ($datos as $indice => $valor) {
                $tipoDato = is_string($valor) ? \PDO::PARAM_STR : \PDO::PARAM_INT;
                $pdoStatement->bindParam(":" . $indice, $valor, $tipoDato);
                //Limpiamos $indice o valor sino da error para los datos a partir del primero
                unset($indice);
                unset($valor);
            }
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute();
            if (!$resultado) {
                throw new \PDOException($pdoStatement->errorInfo()[2]);
            }
            $resultado = $pdo->lastInsertId();
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch (\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        } catch (\Exception $error) {
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
    public function recuperDatosBD($sentencia, $datos = [])
    {
        try {
            //Creo la conexión
            $pdo = $this->conectarBD();
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute($datos);
            if (!$resultado) {
                throw new \PDOException($pdoStatement->errorInfo()[2]);
            }
            //Devolvemos el $pdoStatement para poder hacer fetch con él
            $resultado = $pdoStatement;
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch (\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        } catch (\Exception $error) {
            $resultado = "Error " . $error->getCode() . ": "  . $error->getMessage();
        }
        return $resultado;
    }

    /**
     * Ejecuta y prepara la sentencia que le pasamos, se usa para sentencias que necesitan números como parámetros
     *
     * @param   string  $sentencia  Sentencia a ejecutar
     * @param   array  $datos      Datos a añadir como parámetros
     * @param   PDO     $pdo    Elemento PDO que usamos en una transaccion manual
     *
     * @return  mixed                  Devuelve un PDOSTamente o false en caso de error
     */
    public function recuperarDatosBDNum($sentencia, $datos = [], $pdo = "")
    {
        try {
            if ($pdo == "") {
                //Creo la conexión
                $pdo = $this->conectarBD();
            }
            //Ejecutamos la sentencia
            $pdoStatement = $pdo->prepare($sentencia);
            //Cargamos los parámetros
            $this->asignarValoresParam($datos, $pdoStatement);
            //Ejecutamos y asignamos las variables a la vez
            $resultado = $pdoStatement->execute();
            if (!$resultado) {
                throw new \PDOException($pdoStatement->errorInfo()[2]);
            }
            //Devolvemos el $pdoStatement para poder hacer fetch con él
            $resultado = $pdoStatement;
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch (\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        } catch (\Exception $error) {
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
    public function registrarUsuario($datosUsuario, $datosOblig, $fichero)
    {
        try {
            //Validamos todos los campos
            $this->validarCamposForm($datosUsuario);
            //Comprobamos que todos los campos sean validos ,si no son válidos lanzamos una excepción
            if (!$this->comprobarCamposOblig($datosUsuario, $datosOblig)) {
                throw new \Exception("Debe rellenar todos los campos obligatorios");
            }
            //Comprobamos que las contraseñas coincidan, si no coinciden lanzamos una excepción
            if (!$this->comprobarClaves($datosUsuario["pwd"], $datosUsuario["pwd2"])) {
                throw new \Exception("Las contraseñas no coinciden");
            }
            //Eliminamos la segunda contraseña del array ya que no nos hará falta
            unset($datosUsuario["pwd2"]);
            //Comprobamos que el email sea válido
            if (!$this->comprobarEmail($datosUsuario["email"])) {
                throw new \Exception("El email no es válido");
            }
            //Comprobamos que no exista ya alguien con ese correo y que no haya dado un error
            $claveUser = $this->comprobarUsuario($datosUsuario["email"]);
            //Comprobamos que no diera error la sentencia
            if (is_string($claveUser) && stripos($claveUser, "error") !== false) {
                throw new \PDOException($claveUser);
            }
            //Comprobamos que no exista el usuairo
            if ($claveUser !== false) {
                throw new \Exception("Ya existe un usuario registrado con ese correo");
            }
            //Comprobamos que se subiera bien el fichero y lo movemos a una carpeta en el disco duro
            $carpetaFichero = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR  . "img" . DIRECTORY_SEPARATOR . "usuarios" . DIRECTORY_SEPARATOR  . $datosUsuario["email"];
            $resultado = $this->gestionarFichero($fichero, $carpetaFichero);
            //Si no se pudo mover mandamos un error
            if (mb_stristr($resultado, "error") != false) {
                throw new \Exception($resultado);
            }
            //Añadimos al array la ruta del archivo para guardarla en la BD
            $datosUsuario["imagenPerfil"] = ".." . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "usuarios" . DIRECTORY_SEPARATOR  . $datosUsuario["email"] . DIRECTORY_SEPARATOR . $fichero["name"];
            //Hasheamos la contraseña
            $datosUsuario["pwd"] = password_hash($datosUsuario["pwd"], PASSWORD_DEFAULT);
            //Convertimos todos los campos NO obligatorios que NO se rellenaron a null
            $this->comprobarCamposNoOblig($datosUsuario, $datosOblig);
            //Fecha de registro (Como es ahora metemos nosotros la fecha actual) con la zona horaria de Europa, lo mismo para ultima modificación y ultimo acceso
            $fechaRegistro = new DateTime("now");
            //Sentencia para insertar los datos en la BD, no aparece el rol porque por defecto añade el rol estándar en la BD
            $sentencia = "INSERT INTO usuarios (email, pwd, nombre, apellidos, telefono, fecha_nac, fecha_registro, direccion, fecha_ult_modif, fecha_ult_acceso, rol, genero_favorito, imagen_perfil) VALUES (?, ?, ?, ?, ?, ?, '" . date_format($fechaRegistro, "Y-m-d") .  "', ?, NOW(), NOW(), 2, ?, ?);";
            //Ejecutamos la sentencia mediante la función que asignará los valores a la sentencia preparada y devolverá el resultado
            $resultado = $this->agregarModificarDatosBD($sentencia, $datosUsuario);
        } catch (\Exception $error) {
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
    private function asignarValoresParam($valores, $pdoStatement)
    {
        //Asignamos los valores
        foreach ($valores as $indice => $valor) {
            if (is_array($valor)) {
                $this->asignarValoresParam($valor, $pdoStatement);
            } else {
                $dato = is_string($valor) ? \PDO::PARAM_STR : \PDO::PARAM_INT;
                $pdoStatement->bindParam((":" . $indice), $valor, $dato);
            }
            //Eliminamos las variables porque sino la segunda sentencia que añade se lía
            unset($indice);
            unset($valor);
        }
    }

    public function loginUsuario($datosUsuario)
    {
        try {
            //Comprobamos que haya rellenado todos los campos Oblig (En este caso sabemos que todos los campos son obligatorios por lo que le pasamos las claves del arrya asociativo)
            $camposOblig = $this->comprobarCamposOblig($datosUsuario, array_keys($datosUsuario));
        } catch (\PDOException $pdoError) {
            $resultado = "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        } catch (\Exception $error) {
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
    private function comprobarClaves($clave, $clave2)
    {
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
    private function comprobarEmail($email)
    {
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
    public function gestionarFichero($fichero, $carpetaFichero)
    {
        try {
            if (is_array($fichero["name"])) {
                //Comprobamos si existe la carpeta en el disco duro
                if (!is_dir($carpetaFichero)) {
                    //Si no existe la creamos
                    if (!mkdir($carpetaFichero, 777)) {
                        throw new \RuntimeException("No se pudo crear la carpeta donde guarda la imagen");
                    }
                }
                for ($i = 0; $i < count($fichero["name"]); $i++) {
                    //Comprobamos que no hubiese errores en la subida
                    if ($fichero["error"][$i] != 0) {
                        throw new \RuntimeException("Hubo un error en la subida del fichero");
                    }
                    $nuevaRutaArchivo = $carpetaFichero . DIRECTORY_SEPARATOR . $fichero["name"][$i];
                    //Movemos el archivo a la carpeta creada
                    $resultadoSentencia = move_uploaded_file($fichero["tmp_name"][$i], $nuevaRutaArchivo);
                    //Si no se pudo mover lanzamos una excepción
                    if (!$resultadoSentencia) {
                        throw new \RuntimeException("No se puede realizar el cambio de localización del archivo");
                    }
                    //Guardamos en $resultado la ruta del archivo
                    $resultado[] = $nuevaRutaArchivo;
                }
            } else {
                //Comprobamos que no hubiese errores en la subida
                if ($fichero["error"] != 0) {
                    throw new \RuntimeException("Hubo un error en la subida del fichero");
                }
                //Comprobamos si existe la carpeta en el disco duro
                if (!is_dir($carpetaFichero)) {
                    //Si no existe la creamos
                    if (!mkdir($carpetaFichero, 777)) {
                        throw new \RuntimeException("No se pudo crear la carpeta donde guarda la imagen");
                    }
                }
                $nuevaRutaArchivo = $carpetaFichero . DIRECTORY_SEPARATOR . $fichero["name"];
                //Movemos el archivo a la carpeta creada
                $resultado = move_uploaded_file($fichero["tmp_name"], $nuevaRutaArchivo);
                //Si no se pudo mover lanzamos una excepción
                if (!$resultado) {
                    throw new \RuntimeException("No se puede realizar el cambio de localización del archivo");
                }
                //Guardamos en $resultado la ruta del archivo
                $resultado = $nuevaRutaArchivo;
            }
        } catch (\RuntimeException $error) {
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
    function comprobarUsuario($usuario)
    {
        try {
            //Creamos una sentencia que nos devuelva la clave del usuario si coincide el usuario
            $sentencia = "SELECT pwd FROM usuarios WHERE email = ?";
            //Devolvemos lo que nos devuelve (Error o la pwd hasheada del usuario)
            $resultado = $this->recuperDatosBD($sentencia, [$usuario]);
            if (is_string($resultado)) {
                throw new \Exception($resultado);
            }
            $resultado = $resultado->fetch(\PDO::FETCH_ASSOC);
        } catch (\PDOException $pdoError) {
            return "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        } catch (\Exception $error) {
            return "Error " . $error->getCode() . ": " . $error->getMessage();
        }
        return isset($resultado["pwd"]) ? $resultado["pwd"] : false;
    }

    /**
     * Carga los géneros desde la BD
     *
     * @return  mixed  Devuelve un string en caso de error o un array con los géneros
     */
    public function cargarGeneros()
    {
        try {
            $sentencia = "SELECT nombre_genero FROM generos LIMIT 0, 25;";
            $resultado = $this->recuperDatosBD($sentencia, []);
            if (!$resultado instanceof \PDOStatement) {
                throw new \PDOException($resultado);
            }
            $generos = $resultado->fetchAll(\PDO::FETCH_ASSOC);
            return $generos;
        } catch (\PDOException $pdoError) {
            return "Error " . $pdoError->getCode() . ": " . $pdoError->getMessage();
        } catch (\Exception $error) {
            return "Error " . $error->getCode() . ": " . $error->getMessage();
        }
    }

    /**
     * Codifica a utf8 el array o string
     *
     * @param   mixed  $array  Puede ser un array o una string
     *
     * @return  void          No devuelve nada
     */
    public function codificarArrayUtf8(&$array)
    {
        //Comprobamos si es un array
        if (is_array($array)) {
            array_walk($array, [$this, "codificarArrayUtf8"]);
        } else if (is_string($array)) {
            $array = mb_convert_encoding($array, "UTF-8", "auto");
        }
    }

    /**
     * Carga las $numCajas cajas sorpresa
     *
     * @param   [type]  $numCajas  [$numCajas description]
     *
     * @return  [type]             [return description]
     */
    public function cargarCajasSorpresa($numCajas)
    {
        try {
            //Sentencia para coger los id de las numCajas últimas cajas
            $sentenciaCajas = "SELECT id_caja FROM cajas_sorpresa WHERE fecha < (NOW() - INTERVAL DAYOFMONTH(NOW()) - 1 DAY) LIMIT 0, :numCajas;";
            //La prepraramos ya que la ejecutaremos varias veces
            $pdoStatement = $this->recuperarDatosBDNum($sentenciaCajas, ["numCajas" => $numCajas]);
            //Array donde guardaremos los datos de las cajas
            $datosCajas = [];
            //Comprobamos que no diera error
            if (!$pdoStatement instanceof \PDOStatement) {
                throw new PDOException($pdoStatement);
            }
            //Cargamos los tres resultados (como mucho)
            $cajas = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
            $contador = 0;
            //Recorremos cada una de las cajas para añadirlo a la sentencia
            foreach ($cajas as $id) {
                //Sentencia que ejecutaremos
                $sentencia = "SELECT CS.img_caja AS imagen_caja, CS.fecha, P.nombre, P.imagen_producto FROM cajas_sorpresa AS CS INNER JOIN cajas_sorpresa_producto as CP ON CS.id_caja = :id_caja AND CS.id_caja = CP.caja_sorpresa INNER JOIN productos as P ON CP.producto = P.id_producto LIMIT 0, 4;";
                //Como vamos a ejecutarla con frecuencia preparamos la sentencia
                $pdoStatement = $this->recuperDatosBD($sentencia, $id);
                //Comprobamos que no diera error
                if (!$pdoStatement instanceof \PDOStatement) {
                    throw new PDOException($pdoStatement);
                }
                //Guardamos cada uno de los productos de las cajas
                $productos = $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
                //Guardamos la fecha y la imagen de la caja fuera para que sea accesible en Mustache
                $datosCajas["cajaSorpresa"][] = ["fecha" => $productos[0]["fecha"], "imagen_caja" => $productos[0]["imagen_caja"], "producto" => $productos];
                $datosCajas["indicadores"][] = ["num" => $contador];
                $contador++;
            }
            // {"cajasSorpresa": {"caja": [{"fecha" : "X", "nombre": "Y", "imagen": "J"}, {"fecha" : "X", "nombre": "Y", "imagen": "J"}]}}
            //Ponemos el primer elemento como activo
            if ($cajas != false) {
                $datosCajas["cajaSorpresa"][0]["activo"] =  true;
                $datosCajas["indicadores"][0]["activo"] =  true;
            }
            return $datosCajas;
        } catch (\PDOException $pdoError) {
            throw $pdoError;
        } catch (\Exception $error) {
            throw $error;
        }
    }

    /**
     * Carga los últimos productos para el alert
     *
     * @param   int  $numProd  Número de productos
     *
     * @return  array            Array con la información de los productos
     */
    public function ultimoProducto($numProd)
    {
        try {
            //Creamos la sentencia
            $sentencia = "SELECT id_producto, imagen_producto, nombre, precio FROM productos ORDER BY id_producto DESC LIMIT 0, :numProduc";
            //La prepraramos ya que la ejecutaremos varias veces
            $pdoStatement = $this->recuperarDatosBDNum($sentencia, ["numProduc" => intval($numProd)]);
            //Comprobamos que no diera error
            if (!$pdoStatement instanceof \PDOStatement) {
                throw new PDOException($pdoStatement);
            }
            //Devolvemos el fetch ya que sólo devolverá 1
            return $pdoStatement->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $pdoError) {
            throw $pdoError;
        } catch (\Exception $error) {
            throw $error;
        }
    }

    /**
     * Cambia las claves del array por la clave que se le pasa
     *
     * @param   Array  $array  Array a cambiar
     * @param   string  $clave  Clave a ponerle
     *
     * @return  Array          Array con las claves
     */
    public function cambiarClavesArray($array, $clave)
    {
        $arrayClaves = array_fill(0, count($array), $clave);
        $arrayCambiado = array_combine(array_map(function ($arrayValores) use ($arrayClaves) {
            return $arrayClaves[$arrayValores];
        }, array_keys($array)), array_values($array));
        return $arrayCambiado;
    }

    public function cargarSuscripciones()
    {
        try {
            //Hacemos la petición para que nos de la duración de las suscripciones
            $sentencia = "SELECT * FROM suscripciones ORDER BY duracion";
            $resultado = $this->recuperDatosBD($sentencia);
            //Compruebo si es de tipo PDOStatement
            if (!$resultado instanceof \PDOStatement) {
                //Devuelvo el error
                throw new \PDOException($resultado);
            }
            //Lo devolvemos como fetch all ya que lo devolverá de forma controlada
            $datos["suscripciones"] = $resultado->fetchAll(\PDO::FETCH_ASSOC);
            //Compruebo que no sea false o vacio
            if ($datos["suscripciones"]  == false || empty($datos["suscripciones"])) {
                throw new \Exception("No hay datos en la tabla suscripciones");
            }
            //Cogemos la suscripción activa (Como es la primera vez cogemos la primera)
            //Creamos el objeto suscripción
            $suscripcionActiva =  new suscription($datos["suscripciones"][0]["duracion"], $datos["suscripciones"][0]["precio"]);
            $datos["suscripcionActiva"] = $suscripcionActiva->devolverDatos();
            $datos["suscripciones"][0]["activa"] = true;
            return $datos;
        } catch (\PDOException $pdoError) {
            throw $pdoError;
        } catch (\Exception $error) {
            throw $error;
        }
    }
}
