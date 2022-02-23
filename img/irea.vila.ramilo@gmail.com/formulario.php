<?php

echo "Estes son os datos que enviaches no teu formulario:<br/>";

foreach ($_REQUEST as $clave => $valor) {
    echo "<strong>$clave</strong>:";
    if (!is_array($valor)) {
        echo " $valor";
    } else {
        echo var_dump($valor);
    }
    echo "<br/>";
}