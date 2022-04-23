async function cargarPaginaPrincipal() {
    //Comprobamos si el usuario es anónimo o registrado viendo la variable local
    let usuario = (localStorage["email"] != undefined);
    //Si da verdadero vemos el rol
    let administrador = usuario ? (sessionStorage["rol"] == 1) : usuario;

    //Hacemos una petición para cargar las últimas novedades
    let ultimasNovedades = await cargarUltimasNovedades();

    let datos = {"usuario" : usuario, "administrador" : administrador, "novedades": ultimasNovedades};
    //Cargamos la plantilla del header página principal
    let peticion = await fetch("../mustache/header.mustache", opcionesFetchMustache);
    let plantilla = await peticion.text();
    let resultadoMustache = Mustache.render(plantilla, datos);
    document.querySelector("header").insertAdjacentHTML("beforeend", resultadoMustache);

    //Añadimos los escuchadores para el menú 
    if(usuario) {
        let botonPerfil = document.getElementById("botonPerfilUsuario");
        botonPerfil.addEventListener('click', ocultarMenu);
        document.getElementById('menuPerfilUser').lastElementChild.addEventListener('click', desconectarPerfil);
        //Activamos el evento para que oculte el menú
        botonPerfil.dispatchEvent(new Event('click'));
    }
    else {
        document.getElementById("inicioSesion").addEventListener('click', mostrarInisioSesion);
    }
    //Si es administrador cargamos el panel de control
    if(administrador){

    }
    //Si es un usuario estandar o anónimo cargamos la página principal
    else {
        await cargarCuerpoPrincipal();
    }
    return usuario;
}


window.onload = async function () {
    activarPantallaCarga();
    let usuario = await cargarPaginaPrincipal();
    //Hacemos un tiemOut para que no se mire como se oculta el botón
    usuario ? setTimeout(activarScroll, 500) : desactivarPantallaCarga();
    /*loginAutomatico();
    //Creamos el header
    crearHeader();
    crearFooter();
    let botonSusc = document.getElementById("suscripciones").lastElementChild;
    botonSusc.addEventListener("click", irSuscripciones);
    //Botones para ir a partidas
    let botonesPartidas = Array.from(document.getElementById("partidas").querySelectorAll("button"));
    botonesPartidas.forEach(boton => boton.addEventListener("click", irPartidas));
    crearBotonAccesibilidad();
    //crearVentanaCarga();
    //Creamos el mapa
    crearMapa();
    //Seleccionamos los class development y los prototipamos
    asignarTooltips();
    //Activamos los tooltips
    activarTooltips(); */
    //Activamos el scroll
};
