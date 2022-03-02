//Carga los script
restringirAccesoNoAdmin();
cargarScripts();

window.onload = function () {
    crearHeader();
    crearFooter();
    //Añadimos el js de Bootstrap al final de body, lo hacemos aquí ya que necesitamos que esté la página cargada
    document.querySelector("body").append(crearScript({"src": "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js", "integrity": "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p", "crossorigin": "anonymous"}));
    //Añadimos el escuchador al enlace de filtros
    document.getElementById("panelAdmin").querySelector("a").addEventListener("click", ocultarMostrarOpcionesCreacion);
    //document.getElementById("formPanelAdmin").addEventListener("submit", crearPartida);
    //Cargamos las opciones de los juegos
    //cargarOpcionesJuegos(document.querySelector("select"));
    //Cargamos las partidas
    //cargarPartidasAdmin();
    //Cargamos los usuarios
    //cargarUsuariosAdmin(); //todavía no implementado
        // una pequeña prueba para usar currentTarget
        document.getElementById("eventoprueba").addEventListener("click", recogerDatos);
    //Creamos el mapa
    crearMapa();
};