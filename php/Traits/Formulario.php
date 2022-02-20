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
    private function comprobarCamposOblig($datos, $datosOblig) {
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
    private function validarCamposForm(&$datos, $index = 0) {
        //Comprueba si es un array
        if(is_array($datos)){
            array_walk($datos, [$this, "validarCamposForm"]);
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

    private function comprobarCamposNoOblig(&$campos, $camposOblig) {
        //Conseguimos sólo los campos no obligatorios
        $camposNoOblig = array_diff($campos, $camposOblig);
        //Recorremos los campos no obligatorios y comprobamos si no se ha introducido nada, si es el caso, introducimos null
        foreach($camposNoOblig as $indice =>$campo) {
            if($campo == "") {
                $campos[$indice] = null;
            }
        }
    }
}