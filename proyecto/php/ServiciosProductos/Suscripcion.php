<?php
namespace ServiciosProductos;

class Suscripcion {
    /**
     * Precio base de las suscripciones que tienen todos
     *
     * @var float
     */
    private const PRECIO_BASE = 20;
    /**
     * Duración de la suscripción en meses
     *
     * @var int
     */
    private $duracion;
    /**
     * Precio de la suscripción
     *
     * @var float
     */
    private $precioSuscripcion;
    /**
     * Ahorro de la suscripción en porcentaje
     *
     * @var float
     */
    private $ahorro;

    /**
     * Constructor de la clase Suscripción
     *
     * @param   int  $duracion           Duración de la suscripción en meses
     * @param   float  $precioSuscripcion  Precio de la suscripción en €
     *
     */
    public function __construct($duracion, $precioSuscripcion) {
        $this->duracion = $duracion;
        $this->precioSuscripcion = $precioSuscripcion;
        $this->calcularAhorro();
    }

    /**
     * Calcula el ahorro de la suscripción en porcentaje respecto al precio base y se lo asigna al atributo
     *
     */
    private function calcularAhorro() {
        //Calcula el ahorro en porcentage (Ej: 20 -> 20%)
        $this->ahorro = (self::PRECIO_BASE - $this->precioSuscripcion) * 100 / self::PRECIO_BASE;
    }

    /**
     * Devuelve un array con los datos de la suscripción (menos precio base)
     *
     * @return  array  Datos de la suscripción
     */
    public function devolverDatos() {
        return ["duracion" => $this->duracion, "precio" => $this->precioSuscripcion, "ahorro" => $this->ahorro];
    }
}