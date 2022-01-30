<?php
class bd {
    private static $ficheroConfig;
    private static $ficheroConfivValid;
    
    public function conectarBD() {
        try {
            //Leo la configuración del archivo XML para conseguir la ip, base de datos, usuario y contraseña
            $config = $this->leerConfig();
            //Establezco la conexión con la base de datos
            $pdo = new PDO($config[0], $config[1], $config[2]);
        }
        //Ambos try catch devuelve el error para mostrarlo por pantalla y poder solucionarlo, cuando lo acabemos quitaremos la muestra de los errores, esto es sólo para desarrollo
        catch(\PDOException $pdoError) {
            $pdo = "Error " . $pdoError->getCode() . ":" . $pdoError->getMessage();
        }
        catch(\Exception $error) {
            $pdo = "Error " . $error->getCode() . ":" . $error->getMessage();
        }
        return $pdo;
    }

    private function leerConfig(){
        //Consigo el rol del usuario
        $rol = $_SESSION["usuario"]["rol"] ?? "conexion";
        //Creo un documento
        $config = new DOMDocument();
        //Cargo el fichero XML
        $config->load(self::$ficheroConfig);
        //Lo valido con el fichero de schema
        $resultado = $config->schemaValidate(self::$ficheroConfivValid);
        //Si es falso devuelvo false
        if(!$resultado){
            throw new InvalidArgumentException("Revise el fichero de configuración");
        }
        //Si llega hasta aquí es que la validación tuvo éxito
        //Cargo el fichero xml
        $fichero = simplexml_load_file(self::$ficheroConfig);
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
}
?>