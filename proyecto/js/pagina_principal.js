//Carga los script
cargarScripts();


window.onload = async function () {
    activarPantallaCarga();
    loginAutomatico();
    //Creamos el header
    crearHeader();
    crearFooter();
    //Añadimos el js de Bootstrap al final de body, lo hacemos aquí ya que necesitamos que esté la página cargada
    document.querySelector("body").append(crearScript({"src": "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js", "integrity": "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p", "crossorigin": "anonymous"}));
    //Añadimos los escuchadores
    //Botones de suscripciones
    let botonSusc = document.getElementById("suscripciones").lastElementChild;
    botonSusc.addEventListener("click", irSuscripciones);
    //Botones para ir a partidas
    let botonesPartidas = Array.from(document.getElementById("partidas").querySelectorAll("button"));
    botonesPartidas.forEach(boton => boton.addEventListener("click", irPartidas));
    crearBotonAccesibilidad();
    await cargarUltimasCajas();
    cargarProductosMain();
    //crearVentanaCarga();
    //Creamos el mapa
    crearMapa();
    //Seleccionamos los class development y los prototipamos
    asignarTooltips();
    //Activamos los tooltips
    activarTooltips();
    //Activamos el scroll
    desactivarPantallaCarga();
};
