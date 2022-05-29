<?php

use Usuarios\Usuario;

require "autocarga.php";

use \Usuarios\Usuario as user;

$usuario = new user("irea.vila.ramilo@gmail.com");
$usuario->generarFacturaCarrito();