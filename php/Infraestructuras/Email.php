<?php

namespace Infraestructuras;
/*
 * Utilizamos la librería de terceros PHPMailer proporcionada por Composer
 */

use DateInterval;
use DateTime;
use \DOMDocument;
use \PHPMailer\PHPMailer\PHPMailer;

require dirname(__FILE__, 2) .  '/vendor/autoload.php';
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
        $this->ficheroConfCorreo = dirname(__FILE__, 3) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "xmlCorreo.xml";
        $this->ficheroConfCorreoValidate = dirname(__FILE__, 3) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "xmlCorreo.xsd";
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

    /**
     * Crea un correo dependiendo del tipo que le pasemos
     *
     * @param   mixed  $correo      Array o cadena
     * @param   string  $tipoCorreo  Tipo de correo (reserva, cancelar partida, etc..)
     * @param   array  $datos       Array con los datos a mostrar en el correo
     *
     * @return  mixed               Devuelve true si salió bien o string con el fallo
     */
    public function enviarCorreos($correo, $tipoCorreo, $datos) {
        $cuerpoCorreo = "";
        $asunto = "";
        $correos = [$correo];
        switch($tipoCorreo){
            case "reserva":
                //Damos formato a la fecha
                $datos["fecha"] = date_format(new DateTime($datos["fecha"]), "d-m-Y");
                $cuerpoCorreo = $this->crearCorreoReserva($correo, $datos);
                $asunto = "Reserva partida " . $datos["fecha"];
                break;

            case "cancelar partida";
                //Damos formato a la fecha
                $datos["fecha"] = date_format(new DateTime($datos["fecha"]), "d-m-Y");
                $cuerpoCorreo = $this->crearCorreoCancelacionPartida($datos);
                $asunto = "Cacelación partida " . $datos["fecha"];
                break;

            case "suscribirse":
                $cuerpoCorreo = $this->crearCorreoSuscripción($datos);
                $asunto = "Suscripción a ClickBox";
                break;

            case "nuevaReserva":
                $datos["fecha"] = date_format(new DateTime($datos["fecha"]), "d-m-Y");
                $cuerpoCorreo = $this->crearCorreoNuevaReserva($datos);
                $asunto = "Nuevas reservas para procesar para la partida del día " . $datos["fecha"];
                
        }
        return $this->enviarCorreoMultiple($correos, $cuerpoCorreo, $asunto);
    }

    /**
     * Crea el cuerpo del correo para reservas
     *
     * @param   string  $correo        Correo al que se envía
     * @param   array  $datosReserva  Datos con información de la partida
     *
     * @return  string                 Cadena con el cuerpo del mensaje
     */
    private function crearCorreoReserva($correo, $datosReserva) {
        //Formateamos la hora de inicio
        $datosReserva["hora_inicio"] = date_format(new DateTime($datosReserva["hora_inicio"]), "H:i");
        if(isset($datosReserva["aceptada"])) {
            //Cabecera
            $mensaje = '<!DOCTYPE html><html lang="es"><head><meta charset=UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email</title></head>';
            //Div contenedor de todo con sus estilos
            $mensaje .= '<body style="background-size: cover; margin: 0px;">';
            //Div que conteien toda la información y el div que conteien el logo, titulo y texto
            $mensaje .= '<div style="box-sizing: border-box; background-color: white; width: 50%; padding: 3%; position: relative; inset-inline-start: 50%; transform: translate(-50%); border-inline-start: 2px solid #026a79; border-inline-end: 2px solid #026a79;"><div>';
            //Logo
            $mensaje .= '<img src="cid:logo" alt="Logo ClickBox" style="width: 300px; display: block; margin: auto;"/>';
            //Titulo
            $mensaje .= '<h1 style="font-family: PoetsenOne; text-align: center; margin-block-end: 4%; color: #026a79;">Reserva partida ' . $datosReserva["fecha"] . ': Aceptada</h1>';
            //Eliminamos la variable ya que ya no nos hace falta
            unset($datosReserva["partida"]);
            unset($datosReserva["aceptada"]);
            //Mensaje
            $mensaje .= '<p style="font-family: Resolve; text-align: justify">Hola ' . $correo .  '! Tu reserva para la partida del día ' . $datosReserva["fecha"] . ' ha sido aceptada</p>';
            //Tabla con la información
            $mensaje .= '<div style="padding: 7% 0%; padding-block-end: 10%; border-block-start: 1px solid grey; border-block-end: 1px solid grey;"><table style="width: 60%; margin: auto;">';
            //Cabecera tabla
            $mensaje .= '<tr><th colspan="2"><h1 style="font-family: PoetsenOne; text-align: center; padding-block-end: 5%; color: #026a79;">Información de la reserva</h1></th></tr>';
            //Creamos cada una de las filas
            foreach($datosReserva as $indice => $dato) {
                $mensaje .= '<tr><td>' . $indice . '</td><td style="text-align: start;">' . $dato . '</td></tr>';
            }
            //Cerramos la tabla
            $mensaje .= '</table></div>';
            //Texto información sobre correo autogenerado
            $mensaje .= '<p style="text-align: justify;">Este mensaje ha sido enviada desde una cuenta de sólo envío. Por favor no responda a este mensaje. Si tiene alguna duda o pregunta correspondiente a esta reserva póngase en contacto con nosotros <a href="clickbox.a2.daw2d.iesteis.gal">aquí</a></p>';
            //Cerramos todo
            $mensaje .= '</div></body></html>';
        }
        else {
            //Cabecera
            $mensaje = '<!DOCTYPE html><html lang="es"><head><meta charset=UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email</title></head>';
            //Div contenedor de todo con sus estilos
            $mensaje .= '<body style="background-size: cover; margin: 0px;">';
            //Div que conteien toda la información y el div que conteien el logo, titulo y texto
            $mensaje .= '<div style="box-sizing: border-box; background-color: white; width: 50%; padding: 3%; position: relative; inset-inline-start: 50%; transform: translate(-50%); border-inline-start: 2px solid #026a79; border-inline-end: 2px solid #026a79;"><div  style="margin-block-end: 5%;">';
            //Logo
            $mensaje .= '<img src="cid:logo" alt="Logo ClickBox" style="width: 300px; display: block; margin: auto;"/>';
            //Titulo
            $mensaje .= '<h1 style="font-family: PoetsenOne; text-align: center; margin-block-end: 4%; color: #026a79; flex-basis: 100%;">Reserva partida ' . $datosReserva["fecha"] . ': Rechazada</h1>';
            //Mensaje
            $mensaje .= ' <p style="font-family: Resolve; text-align: justify flex-basis: 100%;">Su reserva para la partida del día ' . $datosReserva["fecha"] . ' ha sido rechazada. Que esto no te desanime para seguir probando nuestros juegos y servicios. Cada semana realizamos diversas partidas, busca otra partida antes de que se acaben las plazas!</p>';
            //Enlace a la página
            $mensaje .= '<a href="http://clickbox.a2.daw2d.iesteis.gal/" style="display:block; width: max-content; padding: 1.5%; text-decoration: none; margin: auto; background-color: #026a79; color: white; border-radius: 10px; margin-block-end: 2%;">Buscar más partidas</a></div>';
            //Texto información sobre correo autogenerado
            $mensaje .= '<p style="text-align: justify;">Este mensaje ha sido enviada desde una cuenta de sólo envío. Por favor no responda a este mensaje. Si tiene alguna duda o pregunta correspondiente a esta reserva póngase en contacto con nosotros <a href="clickbox.a2.daw2d.iesteis.gal">aquí</a></p>';
            //Cerramos todo
            $mensaje .= '</div></body></html>';
        }
        return $mensaje;
    }

    /**
     * Crea el cuerpo de un correo para partida cancelada
     *
     * @param   array  $datosPartida  Datos de la partida
     *
     * @return  string                 Cadena con el mensaje
     */
    private function crearCorreoCancelacionPartida($datosPartida) {
        //Cabecera
        $mensaje = '<!DOCTYPE html><html lang="es"><head><meta charset=UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email</title></head>';
        //Div contenedor de todo con sus estilos
        $mensaje .= '<body style="background-size: cover; margin: 0px;">';
        //Div que conteien toda la información y el div que conteien el logo, titulo y texto
        $mensaje .= '<div style="box-sizing: border-box; background-color: white; width: 50%; padding: 3%; position: relative; inset-inline-start: 50%; transform: translate(-50%); border-inline-start: 2px solid #026a79; border-inline-end: 2px solid #026a79;"><div  style="margin-block-end: 5%;">';
        //Logo
        $mensaje .= '<img src="cid:logo" alt="Logo ClickBox" style="width: 300px; display: block; margin: auto;"/>';
        //Titulo
        $mensaje .= '<h1 style="font-family: PoetsenOne; text-align: center; margin-block-end: 4%; color: #026a79; flex-basis: 100%;">Partida ' . $datosPartida["fecha"] . ': Cancelada</h1>';
        //Mensaje
        $mensaje .= ' <p style="font-family: Resolve; text-align: justify flex-basis: 100%;">Sentimos comunicaros que la partida prevista para el día ' . $datosPartida["fecha"] . ' fue cancelada por motivos ajenos a la organización. Que esto no detenga tus ganas de probar, échale un vistazo a otras partidas que organizamos</p>';
        //Enlace a la página
        $mensaje .= '<a href="http://clickbox.a2.daw2d.iesteis.gal/" style="display:block; width: max-content; padding: 1.5%; text-decoration: none; margin: auto; background-color: #026a79; color: white; border-radius: 10px; margin-block-end: 2%;">Buscar más partidas</a></div>';
        //Texto información sobre correo autogenerado
        $mensaje .= '<p style="text-align: justify;">Este mensaje ha sido enviada desde una cuenta de sólo envío. Por favor no responda a este mensaje. Si tiene alguna duda o pregunta correspondiente a esta reserva póngase en contacto con nosotros <a href="clickbox.a2.daw2d.iesteis.gal">aquí</a></p>';
        //Cerramos todo
        $mensaje .= '</div></body></html>';
        return $mensaje;
    }

    /**
     * Crea el cuerpo para los correos de suscripción
     *
     * @param   array  $datosSuscripcion  Array con los datos de la suscripción
     *
     * @return  string                     Cadena con el mensaje
     */
    private function crearCorreoSuscripción($datosSuscripcion) {
        //Le sumamos a cuando se suscribió la duración de la suscripción
        $fechaRenovacion = $datosSuscripcion["fecha_ini_suscripcion"]->add(new \DateInterval("P" . ($datosSuscripcion["duracion"] - 1) . "M"))->format("d-m-Y");
        //Cabecera
        $mensaje = '<!DOCTYPE html><html lang="es"><head><meta charset=UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Clickbox</title></head>';
        //Div contenedor de todo con sus estilos
        $mensaje .= '<body style="background-size: cover; margin: 0px;">';
        //Div que conteien toda la información y el div que conteien el logo, titulo y texto
        $mensaje .= '<div style="box-sizing: border-box; background-color: white; width: 50%; padding: 3%; position: relative; inset-inline-start: 50%; transform: translate(-50%); border-inline-start: 2px solid #026a79; border-inline-end: 2px solid #026a79;"><div  style="margin-block-end: 5%;">';
        //Logo
        $mensaje .= '<img src="cid:logo" alt="Logo ClickBox" style="width: 300px; display: block; margin: auto;"/>';
        //Titulo
        $mensaje .= '<h1 style="font-family: PoetsenOne; text-align: center; margin-block-end: 4%; color: #026a79; flex-basis: 100%;">Te has suscrito ' . $datosSuscripcion["duracion"] . (intval($datosSuscripcion["duracion"]) == 1 ? " mes" : " meses")  .' a ClickBox</h1>';
        //Mensaje
        $mensaje .= ' <p style="font-family: Resolve; text-align: justify flex-basis: 100%;">Cada mes mientras dure la suscripción te enviaremos ha casa una caja con algún juego de mesa para que puedas descubrir juegos interesantes sin tener que dedicar tiempo a buscarlos. Ten en cuenta que la suscripciones se renuevan automaticamente, si no quieres recibir más cajas deberás cancelar la suscripción antes de la fecha de renovación</p>';
        $mensaje .= ' <p style="font-family: Resolve; text-align: justify flex-basis: 100%;">Tu fecha de renovación es el ' . $fechaRenovacion . '. Si quiere cancelar la suscripción pulse el siguiente enlace</p>';
        //Enlace a la página
        $mensaje .= '<a href="http://clickbox.a2.daw2d.iesteis.gal/" style="display:block; width: max-content; padding: 1.5%; text-decoration: none; margin: auto; background-color: #026a79; color: white; border-radius: 10px; margin-block-end: 2%;">Desactivar suscripción</a></div>';
        //Texto información sobre correo autogenerado
        $mensaje .= '<p style="text-align: justify;">Este mensaje ha sido enviada desde una cuenta de sólo envío. Por favor no responda a este mensaje. Si tiene alguna duda o pregunta correspondiente a esta reserva póngase en contacto con nosotros <a href="clickbox.a2.daw2d.iesteis.gal">aquí</a></p>';
        //Cerramos todo
        $mensaje .= '</div></body></html>';
        return $mensaje;
    }

    private function crearCorreoNuevaReserva($datospartida) {
         //Cabecera
         $mensaje = '<!DOCTYPE html><html lang="es"><head><meta charset=UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Clickbox</title></head>';
         //Div contenedor de todo con sus estilos
         $mensaje .= '<body style="background-size: cover; margin: 0px;">';
         //Div que conteien toda la información y el div que conteien el logo, titulo y texto
         $mensaje .= '<div style="box-sizing: border-box; background-color: white; width: 50%; padding: 3%; position: relative; inset-inline-start: 50%; transform: translate(-50%); border-inline-start: 2px solid #026a79; border-inline-end: 2px solid #026a79;"><div  style="margin-block-end: 5%;">';
         //Logo
         $mensaje .= '<img src="cid:logo" alt="Logo ClickBox" style="width: 300px; display: block; margin: auto;"/>';
         //Titulo
         $mensaje .= '<h1 style="font-family: PoetsenOne; text-align: center; margin-block-end: 4%; color: #026a79; flex-basis: 100%;"> Nueva reserva para procesar para la partida del día ' . $datospartida["fecha"] . '</h1>';
         //Mensaje
         $mensaje .= ' <p style="font-family: Resolve; text-align: justify flex-basis: 100%;">Tienes nuevas reservas para procesar para la partida del cual eres director</p>';
         //Enlace a la página
         $mensaje .= '<a href="http://clickbox.a2.daw2d.iesteis.gal/" style="display:block; width: max-content; padding: 1.5%; text-decoration: none; margin: auto; background-color: #026a79; color: white; border-radius: 10px; margin-block-end: 2%;">Desactivar suscripción</a></div>';
         //Texto información sobre correo autogenerado
         $mensaje .= '<p style="text-align: justify;">Este mensaje ha sido enviada desde una cuenta de sólo envío. Por favor no responda a este mensaje. Si tiene alguna duda o pregunta correspondiente a esta reserva póngase en contacto con nosotros <a href="clickbox.a2.daw2d.iesteis.gal">aquí</a></p>';
         //Cerramos todo
         $mensaje .= '</div></body></html>';
         return $mensaje;
    }

    /**
     * Envía el correo a la lista de correos que se le pasa por cabecera
     *
     * @param   array  $lista_correos  Lista de correos a la que se le envía el correo
     * @param   string  $cuerpo         Cuerpo del mensaje
     * @param   string  $asunto         Asunto del mensaje
     *
     * @return  mixed                  Devuelve true si se envió bien o una string si hubo fallo
     */
    private function enviarCorreoMultiple($lista_correos, $cuerpo, $asunto){
        //Leemos la configuración
        $config = $this->leerConfigCorreo();
        //Instanciamos el PhpMailer
        $email = new PHPMailer();
        $email->IsSMTP();
        $email->SMTPDebug = 0;  // cambiar a 1 o 2 para ver errores
        $email->SMTPAuth = true;
        $email->SMTPSecure = "tls";
        $email->Host = "a2-daw2d-iesteis-gal.correoseguro.dinaserver.com";
        $email->Port = 587;
        $email->Username = $config[0];  //usuario de gmail
        $email->Password = $config[1]; //contraseña de gmail   
        $email->SetFrom('clickbox@a2.daw2d.iesteis.gal', 'ClickBox');
        $email->Subject = utf8_decode($asunto);
        //Añadimos la imagen
        $email->addAttachment( dirname(__FILE__, 2) . DIRECTORY_SEPARATOR .  "img/logoClickBox.svg", "logo");
        //Añadimos el mensaje
        $email->MsgHTML($cuerpo);
        //Ponemos que codifique en UTF8
        $email->CharSet = "UTF-8";
        //Añadimos cada uno de los correos
        foreach ($lista_correos as $correo) {
            $email->AddAddress($correo, $correo);
        }
        //Comprobamos que se enviara bien
        if (!$email->Send()) {
            return $email->ErrorInfo;
        } else {
            return TRUE;
        }
    }
}