<?php

namespace Infraestructuras;
require __DIR__ . "/vendor/autoload.php";
/*
 * Utilizamos la librería de terceros PHPMailer proporcionada por Composer
 */

use DOMDocument;
use PHPMailer\PHPMailer\PHPMailer;
/**
 * Clase email con las funciones y características para mandar correos automaticamente
 */
class Email {
    /**
     * Variable con el archivo xml con la configuración del correo
     *
     * @var string
     */
    private $ficheroConfCorreo;
     /**
     * Variable con el archivo xsd con la validación de la configuración del correo
     *
     * @var string
     */
    private $ficheroConfCorreoValidate;

    /**
     * Constructor de la clase
     *
     * @return  void  No devuelve nada
     */
    public function __construct() {
        $this->ficheroConfCorreo = dirname(__FILE__, 2) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "xmlCorreo.xml";
        $this->ficheroConfCorreoValidate = dirname(__FILE__, 2) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "xmlCorreo.xsd";
    }

    /**
     * Lee la configuración del correo
     *
     * @return  array  Array con la configuración del correo
     */
    private function leerConfigCorreo() {
        //Creamos un documento DOM
        $config = new DOMDocument();
        //Cargamos el fichero XML
        $config->load($this->ficheroConfCorreo);
        //Le aplicamos la validación con esquema
        if(!$config->schemaValidate($this->ficheroConfCorreoValidate)) {
            throw new \InvalidArgumentException("El fichero de configuración no cumple con la validación");
        }
        //Cargamos ahora el fichero como xml
        $datosConfig = simplexml_load_file($this->ficheroConfCorreo);
        //Cogemos cada uno de los parámetros
        $email = $datosConfig->xpath("//correo");
        $clave = $datosConfig->xpath("//clave");
        return [$email[0], $clave[0]];
    }

    public function crearCorreo() {
        
    }
}