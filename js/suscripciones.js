
//Carga los script
cargarScripts();

window.onload = function () {
    let ventanaCarga = document.getElementById("ventanaCarga");
    ventanaCarga.style.display = "block";
    ventanaCarga.style.top = window.scrollY + "px";
    loginAutomatico();
    //Creamos el header
    crearHeader();
    crearFooter();
    //Añadimos el js de Bootstrap al final de body, lo hacemos aquí ya que necesitamos que esté la página cargada
    document.querySelector("body").append(crearScript({"src": "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js", "integrity": "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p", "crossorigin": "anonymous"}));
    //Inicializamos los tooltip
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    cargarTiposSuscripciones();
    document.getElementById("listaNav").firstElementChild.setAttribute("class", "navActive");
    //Creamos el mapa
    crearMapa();
    crearBotonAccesibilidad();
    //Eliminamos la pantalla de carga
    ventanaCarga.style.display = "none";
};