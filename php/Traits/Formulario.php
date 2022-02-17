<?php

namespace Traits;

trait Formulario {

    /**
     * Comprueba que los datos obligatorios tengan valor
     *
     * @param   array  $datos       Array asociativo de datos a comprobar
     * @param   array  $datosOblig  Datos que deberían tener valor (Su cabecera del array asociativo)
     *
     * @return  boolean               Resultado de ver si todos los datos son válidos o no
     */
    private static function comprobarCamposOblig($datos, $datosOblig) {
        $datosValidos = true;
        //Recorremos los datos Obligatorio y vemos que esos datos tengan valor
        for($i = 0; $i < count($datosOblig) && $datosValidos; $i++){
            if($datos[$datosOblig[$i]]  == ""){
                $datosValidos = false;
            }
        }
        return $datosValidos;
    }

    /**
     * Valida cada uno de los campos (No lo devuelve ya se ven afectados)
     *
     * @param   array    $datos  Array con los datos a validar 
     *
     */
    private static function validarCamposForm(&$datos) {
        //Comprueba si es un array
        if(is_array($datos)){
            array_walk($datos, "validarCamposForm");
        }
        else {
            //Le quitamos los espacios antes y despues
            $datos = trim($datos);
            //Le quitamos los slashes
            $datos = stripslashes($datos);
            //Convertimos los caracterres en carácteres especiales html
            $datos = htmlspecialchars($datos);
        }
    }
}