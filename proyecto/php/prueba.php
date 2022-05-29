<?php

require_once "Infraestructuras/TCPDF.php";
use \Infraestructuras\TCPDF as PDF;

$pdf = new PDF("prueba", "prueba", "");
$pdf->generarPDFactura("<p>Prueba</p>", date("m/d/Y"));