//Cargamos los scripts
cargarScripts();

window.onload = async function (){
    desactivarScroll();
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
    //Cargamos los géneros disponibles en el filtro
    crearOptionGeneros(document.getElementById("generos"));
    await cargarProductos();    //necesita crearse aún
    //Añadimos el escuchador del filtro al botón del formulario
    document.getElementsByClassName("formulario_envio")[0].addEventListener("click", filtrarProductos);
    //Seleccionamos como activo el enlace del nav de tienda (es el último)
    document.getElementById("listaNav").children[2].setAttribute("class", "navActive");
    //Creamos el mapa
    crearMapa();
    //Seleccionamos los class development y los prototipamos
    asignarTooltips();
    //Activamos los tooltips, en este caso los atributos son estáticos
    activarTooltips();
    crearBotonAccesibilidad();
    //Eliminamos la pantalla de carga
    ventanaCarga.style.display = "none";
    //Activamos el scroll
    activarScroll();
}