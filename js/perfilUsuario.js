//Carga los script
cargarScripts();

window.onload = function () {
    loginAutomatico();
    crearHeader();
    crearFooter();
    //Añadimos el js de Bootstrap al final de body, lo hacemos aquí ya que necesitamos que esté la página cargada
    document.querySelector("body").append(crearScript({"src": "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js", "integrity": "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p", "crossorigin": "anonymous"}));
    //Añadimos el escuchador al botón de editar perfil
    document.getElementById("editarCuenta").addEventListener("click", editarPerfil);
    document.getElementById("cancelarRenovacion").addEventListener("click", cancelarRenovacionSusc);
    document.getElementById("historial").addEventListener("click", mostrarHistorial);
    //Creamos el mapa
    crearMapa();
    crearBotonAccesibilidad();
    //Le añadimos el escuchador al boton del input
    document.querySelector("form").addEventListener("submit", guardarCambiosPerfil);
    // Cargamos los datos del usuario
    cargarDatosPerfil();
};