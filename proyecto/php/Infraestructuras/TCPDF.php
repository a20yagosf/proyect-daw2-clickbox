<?php
namespace Infraestructuras;
// Include the main TCPDF library (search for installation path).

use DateTime;
require_once dirname(__FILE__, 3) . DIRECTORY_SEPARATOR ."plugins" . DIRECTORY_SEPARATOR ."tcpdf" . DIRECTORY_SEPARATOR . "tcpdf.php";

class TCPDF {

    private $pdf;

    public function __construct($title, $asunto, $keyWords, $header = false, $footer = false) {
        // create un nuevo documento PDF
        $this->pdf = new \TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        //Pone la información del documento
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('Clickbox');
        $this->pdf->SetTitle($title);
        $this->pdf->SetSubject($asunto);
        $this->pdf->SetKeywords($keyWords);

        // Pone o remueve el header y footer por defecto
        $this->pdf->setPrintHeader($header);
        $this->pdf->setPrintFooter($footer);

        //Configuración de la página, letra, margenes, imagenes, etc..
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        $this->pdf->SetMargins(PDF_MARGIN_LEFT, 10, PDF_MARGIN_RIGHT);
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        //Fuente
        //$this->pdf->SetFont('resolvelight', 'BI', 20);

        //Añade una página
        $this->pdf->AddPage();
    }

    /**
     * Genera un pdf y lo abre en la pestaña de la factura del carrito
     *
     * @param   string  $datosFactura  Contenido a mostrar ya como html
     * @param   string  $fechaFactura  Fecha de la factura
     *
     * @return  void                 No devuelve nada
     */
    public function generarPDFactura($datosFactura, $fechaFactura) {
        $fechaFacturaFormat = preg_replace("/(\/|-)/", "_", $fechaFactura);
        $this->pdf->writeHTML($datosFactura);
        //var_dump($fechaFacturaFormat);
        //Abre el documento en la pestaña
        $this->pdf->Output('ClickBox_Factura_' . $fechaFacturaFormat . '.pdf', 'I');
        die();
    }
}