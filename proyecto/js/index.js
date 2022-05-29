async function cargarPaginaPrincipal() {
    //Comprobamos si el usuario es anónimo o registrado viendo la variable local
    let usuario = (sessionStorage["email"] != undefined);
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
    //Añadimos los escuchadores para el header
   // document.getElementById("navSuscripciones").firstElementChild.addEventListener("click", cargarPaginaSuscripciones);
    //document.getElementById("navPartidas").firstElementChild.addEventListener("click", cargarPaginaPartidas);
    if(usuario){
        let botonPerfilUsuario = document.getElementById("perfilUsuarioEnlace");
        botonPerfilUsuario.addEventListener("click", cargarPerfilUsuario);
        if(administrador) {
            let botonPanelControl = document.getElementById("panelControlEnlace");
        }
    }

    //Cargamos la pantalla del footer
    let peticionFooter     = await fetch("../mustache/footer.mustache", opcionesFetchMustache);
    let plantillaFooter     = await peticionFooter.text();
    let resultadoFooter   = Mustache.render(plantillaFooter, {});
    document.querySelector("main").insertAdjacentHTML("afterend", resultadoFooter);
    crearMapa();
     //Añadimos el escuchador al carrito
    document.getElementById("iconoCarrito").firstElementChild.addEventListener("click", irCarrito);

    //Añadimos los escuchadores para el menú 
    if(usuario) {
        let botonPerfil = document.getElementById("botonPerfilUsuario");
        botonPerfil.addEventListener('click', ocultarMenu);
        document.getElementById('menuPerfilUser').lastElementChild.addEventListener('click', desconectarPerfil);
        document.getElementById('logoHeader').addEventListener("click", irPaginaPrincipal);
        //Activamos el evento para que oculte el menú
        botonPerfil.dispatchEvent(new Event('click'));
    }
    else {
        document.getElementById("inicioSesion").addEventListener('click', mostrarInicioSesion);
    }

    return usuario;
}


window.onload = async function () {
    activarPantallaCarga();
    let usuario = await cargarPaginaPrincipal();
    //Hacemos un tiemOut para que no se mire como se oculta el botón
    usuario ? setTimeout(desactivarPantallaCarga, 500) : desactivarPantallaCarga();

    //Router
      let rutasActivas = Array.from(document.querySelectorAll("[route]"));
      rutasActivas.forEach(ruta => ruta.addEventListener("click", cambiarHash));

    let paginaCompleta = window.location.pathname;
    let indice = paginaCompleta.lastIndexOf("/");
    var paginaActual = paginaCompleta.substring(indice);
    switch(paginaActual) {
        case "/":
        cargarCuerpoPrincipal();
        break;

        case "/suscripciones":
            cargarPaginaSuscripciones();
            break;

        case "/partidas":
        cargarPaginaPartidas();
        break;
    }

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
