//Carga los script
restringirAccesoNoAdmin();
cargarScripts();

window.onload = async function () {
    desactivarScroll();
    loginAutomatico();
    crearHeader();
    crearFooter();
    //Añadimos el js de Bootstrap al final de body, lo hacemos aquí ya que necesitamos que esté la página cargada
    document.querySelector("body").append(crearScript({"src": "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js", "integrity": "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p", "crossorigin": "anonymous"}));
    //Inicializamos los tooltip
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    //Añadimos el escuchador al enlace de filtros
    document.getElementById("panelAdmin").querySelector("a").addEventListener("click", ocultarMostrarOpcionesCreacion);
    //Creamos el mapa
    crearMapa();
    //Seleccionamos los class development y los prototipamos
    asignarTooltips();
    //Activamos los tooltips, en este caso los atributos son estáticos
    activarTooltips();
    //Cargamos el modo para usuarios
    await cargarModoUsuariosAdmin();
    crearBotonAccesibilidad();
    //Añadimos los escuchadores
    document.getElementById("pestPartidas").addEventListener("click", cargarPartidasAdmin);
    document.getElementById("pestUsuarios").addEventListener("click", cargarModoUsuariosAdmin);
    activarScroll();
};