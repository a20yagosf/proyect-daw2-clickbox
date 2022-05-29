<?php

namespace Infraestructuras;

require_once dirname(__FILE__, 2) .  '/vendor/autoload.php';

class Smarty {

    private \Smarty $smarty;
    
    public function __construct () {
        $this->smarty = new \Smarty();

        $rutaSmarty = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . "smarty";

        //Configuramos cada una de las rutas para las template, cache, configuración, etc..
        $this->smarty->setTemplateDir($rutaSmarty . DIRECTORY_SEPARATOR . 'templates');
        $this->smarty->setCompileDir($rutaSmarty . DIRECTORY_SEPARATOR . 'templates_c');
        $this->smarty->setCacheDir($rutaSmarty . DIRECTORY_SEPARATOR . 'cache');
        $this->smarty->setConfigDir($rutaSmarty . DIRECTORY_SEPARATOR . 'configs');
    }

    public function renderTemplate($datos, $nombreTemplate) {
        foreach($datos as $nombreVariable => $valor){
            $this->smarty->assign($nombreVariable, $valor);
        }

        $contenido = $this->smarty->fetch($nombreTemplate);
        return $contenido;
    }
}