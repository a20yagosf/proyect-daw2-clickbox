/**
 * Crea el mapa a partir de la API de Lefletjs
 *
 */
 function crearMapa() {
    //Creamos el mapa, asignandole unas coordenadas [] y un zoom
    let mapa = L.map("map").setView([42.23089017869441, -8.728312405255604], 16);
    //Creamos lo que es la vista del mapa
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //Máximo Zoom que permitimos, este es el máximo zoom que permite lefletjs
    maxZoom: 18,
    //Id del stilo
    id: 'mapbox/streets-v11',
    //Tamaño que tendrán cada una de las celdas, por defecto Mapbox devuelve celdas de 512x512 por eso le damos zoomOffeset -1 (las convierte en 256x256)
    tileSize: 512,
    zoomOffset: -1,
    //Token que creamos en la cuenta de mapbox
    accessToken: 'pk.eyJ1IjoiaXJlYSIsImEiOiJja3pidXhhMHkxdGp5MnJuOWd0OHJ2dGIwIn0.tbQ-y0uTguMhMomhbFL8lA'
}).addTo(mapa);
    //Creamos un marcador para el mapa
    let marcador = L.marker([42.23089017869441, -8.728312405255604]).addTo(mapa);
    //Creamos un pop up en el marcador para marcar que ese es nuestor local
    marcador.bindPopup("Aquí estamos!").openPopup(); 
}

/**
 * Crea la cabecera
 *
 */
function crearHeader() {
    //Creamos la alerta
    let alerta = crearAlert(["#"], ["Últimas novedades BD"]);
    //Creamos el elemento header
    let cabecera = document.createElement("header");
    //Creamos el nav
    let navegador = crearNav(["./suscripciones.html", "./partidas.html", "#"], ["Suscripciones", "Partidas", "Tienda"]);
    //Añadimos al header
    cabecera.append(navegador);
    //Comprobamos si existe el rol //Rol 1: Admin 2: Estandar 3: Anónimo
    if(sessionStorage.getItem("rol") !== null) {
        let contenedorPerfil;
        let enlacePerfil;
        let salirPerfil;
        //Creamos el botón del usuario
        switch(sessionStorage.getItem("rol")) {
            //Admin
            case 1:
                //Creamos el botón del usuario
                //Botón para iniciar sesión
                let botonPanelControl = crearBoton(sessionStorage["email"], {"id": "botonPerfilUsuario"});
                //Creamos el div  con el cotenido
                contenedorPerfil = document.createElement("div");
                contenedorPerfil.setAttribute("id", "menuPerfilUser");

                //Creamos los enlaces
                enlacePerfil = crearEnlace( "../html/perfilUsuario.html", "Perfil de usuario");
                enlacePanelControl = crearEnlace( "../html/panelAdministrador.html", "Panel de Control");
                salirPerfil = crearEnlace("#", "Desconectarme");
                //Añadimos el escuchador para desconectarnos
                salirPerfil.addEventListener("click", desconectarPerfil);

                //Lo añadimos al contenedor del perfil
                contenedorPerfil.append(enlacePerfil, enlacePanelControl, salirPerfil);
                //Ocultamos el contenedor del perfil
                $(contenedorPerfil).slideUp(500);
                //Añadimos el escuchador al botón del header
                botonPanelControl.addEventListener("click", desplegarMenuPerfil);
                //Añadimos el botón al contenedor fluid el botón de Inicio de sesión
                navegador.firstChild.append(botonPanelControl, contenedorPerfil);
                //Añadimos al header
                cabecera.append(navegador);
                //Añadimos al body al inicio de todo
               cuerpo = document.querySelector("body");
                //Los añadimos el que queremos de último primero para que se coloquen en el orden correcto ya que los ponemos de primer hijo
                cuerpo.insertBefore(cabecera, cuerpo.firstChild);
                cuerpo.insertBefore(alerta, cuerpo.firstChild);
                break;

            //Estandar
            default:
                //Creamos el botón del usuario
                //Botón para iniciar sesión
                let botonPerfil = crearBoton(sessionStorage["email"], {"id": "botonPerfilUsuario"});
                //Creamos el div  con el cotenido
                contenedorPerfil = document.createElement("div");
                contenedorPerfil.setAttribute("id", "menuPerfilUser");
                //Creamos los enlaces
                enlacePerfil = crearEnlace( "../html/perfilUsuario.html", "Perfil de usuario");
                salirPerfil = crearEnlace("#", "Desconectarme");
                //Añadimos el escuchador para desconectarnos
                salirPerfil.addEventListener("click", desconectarPerfil);
                //Lo añadimos al contenedor del perfil
                contenedorPerfil.append(enlacePerfil, salirPerfil);
                
                //Ocultamos el contenedor del perfil
                $(contenedorPerfil).slideUp(500);
                //Añadimos el escuchador al botón del header
                botonPerfil.addEventListener("click", desplegarMenuPerfil);
                //Añadimos el botón al contenedor fluid el botón de Inicio de sesión
                navegador.firstChild.append(botonPerfil, contenedorPerfil);
                //Añadimos al header
                cabecera.append(navegador);
                //Añadimos al body al inicio de todo
               cuerpo = document.querySelector("body");
                //Los añadimos el que queremos de último primero para que se coloquen en el orden correcto ya que los ponemos de primer hijo
                cuerpo.insertBefore(cabecera, cuerpo.firstChild);
                cuerpo.insertBefore(alerta, cuerpo.firstChild);
                break;
        }
    }
    //Usuario anónimo
    else {
        //Botón para iniciar sesión
        botonInicioSesion = crearBoton("Iniciar sesión");
        botonInicioSesion.setAttribute("id", "inicioSesion");
        //Añadimos el escuchador al botón del header
        botonInicioSesion.addEventListener("click", aparecerLogin);
        //Añadimos el botón al contenedor fluid el botón de Inicio de sesión
        navegador.firstChild.append(botonInicioSesion);
        //Añadimos al body al inicio de todo
        cuerpo = document.querySelector("body");
        //Los añadimos el que queremos de último primero para que se coloquen en el orden correcto ya que los ponemos de primer hijo
        cuerpo.insertBefore(cabecera, cuerpo.firstChild);
        cuerpo.insertBefore(alerta, cuerpo.firstChild);
    }
}

/**
 * Crea el navegador con javascript
 *
 * @param   {array}  redireccion   A donde llevarán los enlaces
 * @param   {array}  elementosNav  Cada uno de los nombres de los enlaces que pondremos
 *
 * @return  {DOMElement}                Navegador hecho con javascript
 */
function crearNav(redireccion, elementosNav, rol) {
   //Creamos el elemento nav
   let navegador = document.createElement("nav");
   //Le añadimos las clases
   navegador.setAttribute("class", "navbar navbar-expand-md");
   //Creamos su contenedor
   let contenedorNav = document.createElement("div");
   //LE añadimos la clase
   contenedorNav.setAttribute("class", "container-fluid");
   //Enlace del logo
   let logo = crearEnlace("index.html", crearImg({"src": "../img/logoClickBox.svg", "alt": "Logo ClickBox"}));
   //Creamos el botón hamburguesa
   let botonHamburguesa = crearBoton("", {"class" : "navbar-toggler", "type": "button", "data-bs-toggle": "collapse", "data-bs-target": "#listaNav", "aria-controls": "listaNav", "aria-expanded": "false", "aria-label": "Menú hamburguesa"});
   //Creamos la lista
   let lista = crearLista("ul", crearArrayElem("crearEnlace", 3, [redireccion, elementosNav]), {"id": "listaNav", "class": "collapse navbar-collapse"});
   //Añadimos todo al contenedor del nav y despues al nav
   contenedorNav.append(logo, botonHamburguesa, lista);
   navegador.append(contenedorNav);
   //Creamos el enlace
    return navegador;
}

/**
 * Crea una alerta con tantos span como le pasemos enlaces y textos
 *
 * @param   {array}  enlaces  Enlaces que tiene que redirigir cada enlace
 * @param   {string}  textos   Textos de cada enlace
 *
 * @return  {DOMElement}           Div con la alerta
 */
function crearAlert(enlaces, textos) {
    //Creamos el div que contendrá la alerta
    let contenedor = document.createElement("div");
    //Le añadimos el id
    contenedor.setAttribute("id", "alerta");
    //Creamos todos los enlaces necesarios
    for(let i =0; i < enlaces.length; i++){
        //Añadimos cada uno de los enlaces
        contenedor.append(crearEnlace(enlaces[i], textos[i]));
    }
    return contenedor;
}

/**
 * Crea el footer de manera procedural
 *
 */
function crearFooter() {
    //Creamos el footer
    let footer = document.createElement("footer");

    //Lista enlaces página
    //Creamos la lista que contendrá las diferentes páginas recomendadas
    let imagenLogo = crearImg({"src": "../img/logoClickBoxFooter.svg", "alt": "Logo ClickBox"});
    //Enlaces de la lista
    let enlacesLista =  crearArrayElem("crearEnlace", 5, [["#", "#", "#", "#", "#"], [imagenLogo, "Sobre nosotros", "Suscripciones", "Partidas", "Tienda"]]);
    let lista = crearLista("ul", enlacesLista);
    lista.setAttribute("id", "infoPag");

    //Conenedor de redes
    let contenedorRedes = document.createElement("div");
    contenedorRedes.setAttribute("id", "redes");
    //Imagenes de las redes que creamos mediante js
    let imagenesRedes = crearArrayElem("crearImg", 3, [{"src": "../img/iconos/logoTwitter.svg", "alt": "Logo de Twitter"}, {"src": "../img/iconos/logoInstagram.svg", "alt": "Logo de Instagram"}, {"src": "../img/iconos/logoTickTock.svg", "alt": "Logo de Tick Tock"}]);
    //Enlaces de las redes
    let enlacesRedes = crearArrayElem("crearEnlace", 3, [["#", "#", "#"], imagenesRedes]);
    contenedorRedes.append(...enlacesRedes);

    //Contenedor de localización
    let contenedorLocalizacion = document.createElement("div");
    contenedorLocalizacion.setAttribute("id", "localizacion");
    //Creamos el h4
    let cabeceraLocalizacion = document.createElement("h4");
    cabeceraLocalizacion.textContent = "Localización";
    //Enlace de la localización del local
    let enlaceLocalizacion = crearEnlace("https://www.google.com/maps/place/Paseo+Cronista+Xos%C3%A9+M.+%C3%81lvarez+Bl%C3%A1zquez,+26,+36203+Vigo,+Pontevedra/@42.230894,-8.7304107,17z/data=!3m1!4b1!4m5!3m4!1s0xd2f6212e2ab8fbf:0x3a36a0a129ebbdd9!8m2!3d42.23089!4d-8.728222", "Paseo Cronista Xosé M. Álvarez Blázquez, 26, 36203 Vigo, Pontevedra");
    //Contenedor del mapa
    let contenedorMapa = document.createElement("div");
    contenedorMapa.setAttribute("id", "map");
    //Añadimos todo a localización 
    contenedorLocalizacion.append(cabeceraLocalizacion, enlaceLocalizacion, contenedorMapa);

    //Añadimos todo al footer
    footer.append(lista, contenedorRedes, contenedorLocalizacion);
    //Añadimo al cuerpo el footer
    document.querySelector("body").append(footer);
}

/**
 * Crea un enlace quer edirige al enlace que le pasara y con el texto que se le pasa
 *
 * @param   {string}  enlace  Enlace al que redirige
 * @param   {mixed}  elemento   Texto o elemento a añadir
 *
 * @return  {DOMElement}          Enlace
 */
function crearEnlace(enlace, elemento) {
    //Creamos el enlace
    let elemEnlace = document.createElement("a");
    //Le añadimos el href
    elemEnlace.setAttribute("href", enlace);
    //Comprobamos si es un texto o un elemento y lo añadimos
    typeof elemento == "string" ? elemEnlace.innerHTML = elemento : elemEnlace.append(elemento);
    return elemEnlace;
}

/**
 * Crea un elemento imagen de tipo DOM con los atributos que se le pasan por cabecera
 *
 * @param   {Object}  atributos  Object con clave valor con el nombre del atributo: valor del atributo
 *
 * @return  {NodeElement}            Elemento img del DOM
 */
function crearImg(atributos){
    //Creamos la imagen del logo
    let imagen = document.createElement("img");
    //Le añadimos sus atributos a la imagen diviendolo en array de [clave, valor]
    Object.entries(atributos).forEach(atributo => {
        imagen.setAttribute(atributo[0], atributo[1]);
    });
    return imagen;
}

/**
 * Crea una lista con los atributos y elementos que le pasamos
 *
 * @param   {string}  tipoLista           Desordenada "ul" o ordenada "ol"
 * @param   {array}  elementosContiene   Array con los elementos que contiene que puede ser de tipo DOMElement o string
 * @param   {Object}  atributosLista      Atributos que tiene la lista de tipo {clave: valor, clave2: valor} Puede dejarse vacío
 * @param   {Object}  atributosElementos  Atributos que tiene el li de tipo {clave: valor, clave2: valor} Puede dejarse vacío
 *
 * @return  {DOMElement}                      Lista
 */
function crearLista(tipoLista, elementosContiene, atributosLista = {}, atributosElementos = {}) {
    //Creamos la lista
    let lista = tipoLista == "ul" ? document.createElement("ul") : document.createElement("ol");
    //Le añadimos los atributos diviendolo en array [clave, valor]
    Object.entries(atributosLista).forEach(atributo => lista.setAttribute(atributo[0], atributo[1]));
    //Creamos los elementos añadiendole los atributos y el texto u elemento
    elementosContiene.forEach(elemento => {
        let elementoLista = document.createElement("li");
        //Comprobamos el tipo del elemento y lo añadimos
        typeof elemento == "string" ? elementoLista.textContent = elemento : elementoLista.append(elemento);
        //Le añadimos los atributos diviendolos en [clave, valor]
        Object.entries(atributosElementos).forEach(atributo => elementoLista.setAttribute(atributo[0], atributo[1]));
        //Lo añadimos a la lista
        lista.append(elementoLista);
    });
    return lista;
}

/**
 * Crea un botón con los atributos  y texto que le pasamos
 *
 * @param   {string}  texto      Texto que aparecerá en el botón
 * @param   {Object}  atributos  Atributos de tipo {clave: valor, clave2, valor2} Puede dejarse vacío
 *
 * @return  {DOMElement}             Botón
 */
function crearBoton(texto = "", atributos = {}){
    //Creamos el boton
    let boton = document.createElement("button");
    //Le asignamos los atributos (si tiene) diviendolo en array de [clave, valor]
    Object.entries(atributos).forEach(atributo => boton.setAttribute(atributo[0], atributo[1]));
    //Le asignamos el texto
    boton.textContent = texto;
    return boton;
}

/**
 * Crea un array con los elementos de 1 tipo que queramos
 *
 * @param   {string}  callback      Nombre de la función a llamar
 * @param   {int}  numElementos  Número de elementos a crear
 * @param   {array}  argumentos    Argumentos a pasar
 *
 * @return  {array}                Array de elementos
 */
function crearArrayElem(callback,  numElementos, argumentos) {
    let arrayElementos = [];
    //Comprobamos el nombre de la función y la ejecutamos creando tantos de ese tipo como queramos
    switch(callback) {
        case "crearEnlace":
            for(let i = 0; i < numElementos; i++){
                arrayElementos.push(crearEnlace(argumentos[0][i], argumentos[1][i]));
            }
            break;

        case "crearImg":
            for(let i = 0; i < numElementos; i++){
                arrayElementos.push(crearImg(argumentos[i]));
            }
            break;

        case "crearLista":
            for(let i = 0; i < numElementos; i++){
                arrayElementos.push(crearLista(argumentos[0][i], argumentos[1][i], argumentos[2][i], argumentos[3][i]));
            }
            break;

        case "crearBoton":
            for(let i = 0; i < numElementos; i++){
                arrayElementos.push(crearBoton(argumentos[0][i], argumentos[1][i]));
            }
            break;

        case "crearElemForm":
            for(let i = 0; i < numElementos; i++){
                argumentos.length < 3 ? arrayElementos.push(crearElemForm(argumentos[0][i], argumentos[1][i])) : arrayElementos.push(crearElemForm(argumentos[0][i], argumentos[1][i], argumentos[2][i]));
            }
            break;
    }
    return arrayElementos;
}

/**
 * Convierte al botón en el botón activo eliminando al anterior botón activo antes
 *
 * @param   {Event}  e  Evento
 *
 */
function seleccionarSusc(e) {
    //Botón seleccionado, ponemos parentElement ya que el target cogerá a los hijos que contiene ya que ocupan todo el botón
    let boton = e.target.parentElement;
    //Buscamos la selección activa y le quito la clase
    let botonActivo = boton.parentElement.getElementsByClassName("suscActiva")[0];
    botonActivo.classList.remove("suscActiva");
    //Le cambiamos el textCont al mes
    document.querySelector("th").textContent = boton.children[0].textContent + " " + boton.children[1].textContent;
    //Le añado la clase al boton
    boton.classList.add("suscActiva");
}

/**
 * Carga los script generales que se usan mientras
 *
 */
function cargarScripts() {
    //Añade todos los scripts y css por defecto al header (Los de leflet, bootstrap)
    let cabeza = document.querySelector("head");
    //CSS Leaflet.js
    cabeza.append(crearLink({"rel": "stylesheet", "href": "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css", "integrity": "sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==", "crossorigin": ""}));
    //JS Leflet.js
    cabeza.append(crearScript({"src": "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js", "integrity": "sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==", "crossorigin": ""}));
    //CSS Bootstrap
    cabeza.append(crearLink({"href": "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css", "rel": "stylesheet", "integrity": "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3", "crossorigin": "anonymous"}));
    //librería jquery
    cabeza.append(crearScript({"src": "https://code.jquery.com/jquery-3.6.0.min.js"}));
    //CSS general
    cabeza.append(crearLink({"rel": "stylesheet", "href": "../css/styles.css"}));
}

/**
 * Crea un script de tipo DOM
 *
 * @param   {Object}  atributos  Atributos de tipo {clave: valor, clave2: valor}
 *
 * @return  {DOMElement}             Script
 */
function crearScript(atributos) {
    //Creamos el script
    let elementoScript = document.createElement("script");
    //Dividimos los atributos en [clave, valor]
    Object.entries(atributos).forEach(atributo => elementoScript.setAttribute(atributo[0], atributo[1]));
    return elementoScript;
}

/**
 * Crea un script de tipo DOM
 *
 * @param   {Object}  atributos  Atributos de tipo {clave: valor, clave2: valor}
 *
 * @return  {DOMElement}             Script
 */
 function crearLink(atributos) {
    //Creamos el script
    let elementoLink = document.createElement("link");
    //Dividimos los atributos en [clave, valor]
    Object.entries(atributos).forEach(atributo => elementoLink.setAttribute(atributo[0], atributo[1]));
    return elementoLink;
}

/**
 * Hace aparecer o desaparecer la ventana de login
 *
 */
function aparecerLogin(){
    let contenedorLogin = document.getElementById("login");
    //Compruebamos si el login ya existe
    if(contenedorLogin) {
        //Ocultamos o elemento
        $(contenedorLogin).toggle(1000);
    }
    //Si no existe creamos el elemento
    else {
        contenedorLogin = document.createElement("div");
        //Le asignamos el id
        contenedorLogin.setAttribute("id", "login");
        //Creamos los componentes del interior
        let encabezado = document.createElement("h2");
        encabezado.textContent = "Registrate o inicia sesión";
        let paragrafo = document.createElement("p");
        paragrafo.textContent = "Por favor crea una cuenta para poder acceder a más funcionalidades de la web como suscribirte, reservar partidas y mucho más";
        //Parrafo que explica que * son los campos obligatorios
        let parrafoOblig = document.createElement("p");
        parrafoOblig.textContent = "Los campos obligatorios están marcados con :";
        parrafoOblig.setAttribute("class", "campoOblig");
        //Contenedor de los botones
        let contenedorBotones = document.createElement("div");
        //Botones
        let registro = crearBoton("Registrarse", {"class": "noActivo", "data-nombre": "registro"});
        let login = crearBoton("Iniciar sesión", {"data-nombre": "login"});
        let botones = [registro, login]
        contenedorBotones.append(...botones);
        //Creamos el formulario (Por defecto se activa con el login)
        let formulario = document.createElement("form");
        //Atributos del formulario
        let atributosForm = {"action": "../php/registro.php", "method": "POST", "enctype": "multipart/form-data"};
        //Le asignamos los atributos al formulario
        Object.entries(atributosForm).forEach(atributo => formulario.setAttribute(atributo[0], atributo[1]));
        //Creamos el botón de cierre
        let botonCierre = crearBoton("X");
        //Lo añadimos todo al contenedor login
        contenedorLogin.append(encabezado, paragrafo, parrafoOblig, contenedorBotones, formulario, botonCierre);
        //Le añadimos los escuchadores a los botones
        botones.forEach(boton => boton.addEventListener("click", cambiarForm));
        botonCierre.addEventListener("click", aparecerLogin);
        //Pomos o elemento como display none para mostralo cunha animación
        contenedorLogin.style.display = "none";
        //Añadimos el contenedor al body
        document.querySelector("body").append(contenedorLogin);
        //Creamos el interior del formulario
        crearLogin(formulario);
        //Marcamos los campos Obligatorios
        marcarCamposOblig(["email", "pwd"]);
        $(contenedorLogin).show(1000);
    }
}

/**
 * Cambiar el formulario
 *
 * @param   {Event}  e  Evento disparado
 *
 */
function cambiarForm(e) {
    let boton = e.target;
    let formulario = boton.parentElement.nextSibling;
    //Cambiamos la clase de noActivo si la tiene el botón pulsado
    if(boton.classList.contains("noActivo")){
        //Le quito la clase y se lo paso al otro
        boton.classList.remove("noActivo");
        //Dependiendo de que botón el pulsado le asignamos a su hermano (si es login su hermano es el anterior, si es registro su hermano es el posterior)
        boton.dataset.nombre == "login" ? boton.previousSibling.classList.add("noActivo") : boton.nextSibling.classList.add("noActivo");
    }
    //Limpio el formulario
    formulario.innerHTML = "";
    //Le creo el formulario que le toque
    boton.dataset.nombre == "login" ? crearLogin(formulario) : crearRegistro(formulario);
}


/**
 * Crea un elemento del formulario del tipo que se envíe por cabecera
 *
 * @param   {string}  tipoElemento  Tipo de elemento (Ej: input, label, etc..)
 * @param   {Object}  atributos     Atributos que tendrá el elemento de tipo {clave: valor}
 * @param   {string}  texto         Texto que contendrá (Puedo no asignarle nada)
 *
 * @return  {DOMElement}                Elemento a crear
 */
function crearElemForm(tipoElemento, atributos, texto = "") {
    //Creamos el elemento
    let elementoForm = document.createElement(tipoElemento);
    //Le asignamos los atributos conviertiendolos a [clave, valor]
    Object.entries(atributos).forEach(atributo => elementoForm.setAttribute(atributo[0], atributo[1]));
    //Le asignamos el texto
    elementoForm.textContent = texto;
    return elementoForm;
}

/**
 * Crea los elementos del login y los asigna al formulario que le pasemos
 *
 * @param   {DOMElement}  formulario  Formulario del DOM
 *
 */
function crearLogin(formulario) {
    //Le quitamos el escucharo del registro (si lo tiene) y le añadimos al formulario el botón para escuchar el evento
    formulario.removeEventListener("submit", procesarRegistro);
    formulario.addEventListener("submit", procesarLogin);
    //Label del login
    let labelEmail = crearElemForm("label", {"for": "email"}, "Email");
    let labelClave = crearElemForm("label", {"for": "pwd"}, "Contraseña");
    //Input login
    let inputEmail = crearElemForm("input",{"type": "email", "name": "email", "placeholder": "Correo electrónico", "id": "email"});
    let inputClave = crearElemForm("input",{"type": "password", "name": "pwd", "placeholder": "Contraseña", "id": "pwd"});
    //Creamos los input y los añadimos al formulario
    formulario.append(labelEmail, inputEmail, labelClave, inputClave);
    //Marcamos los campos Obligatorios
    marcarCamposOblig(["email", "pwd"]);
    //Párrafo para mostrar el mensaje de éxito o error
    let parrafoResult = document.createElement("p");
    parrafoResult.setAttribute("id", "resultadoForm");
    //Botón para móvil para poder salir
    let botonCancelar = crearBoton("Cancelar", {"type": "button"});
    botonCancelar.setAttribute("class", "movil");
    //Añadimos el escuchador al botón
    botonCancelar.addEventListener("click", aparecerLogin);
    let botonLogin = crearBoton("Iniciar sesión", {"type": "submit"});
    //Creo el botón de iniciar sesión
    formulario.append(parrafoResult, botonLogin, botonCancelar);
}

/**
 * Crea los elementos del registro del login
 *
 * @param   {DOMElement}  formulario  Formulario del login
 *
 */
function crearRegistro(formulario) {
    //Le quitamos el escucharo del registro (si lo tiene) y le añadimos al formulario el botón para escuchar el evento
    formulario.removeEventListener("submit", procesarLogin);
    formulario.addEventListener("submit", procesarRegistro);
    //Acordeon 1
    formulario.append(crearAcordeonDatosCuenta());

    //Acordeon2
    formulario.append(crearAcordeonDatosPersonales());

    //Marcamos los campos Obligatorios
    marcarCamposOblig(["email", "pwd", "pwd2", "imagenPerfil", "nombre", "apellidos", "fecha_nac"]);
    //Párrafo para mostrar el mensaje de éxito o error
    let parrafoResult = document.createElement("p");
    parrafoResult.setAttribute("id", "resultadoForm");
    //Botón de registro
    let botonRegistro = crearElemForm("input", {"type": "submit", "value": "Registrarme"});
    //Botón para móvil para poder salir
    let botonCancelar = crearBoton("Cancelar", {"type": "button"});
    botonCancelar.setAttribute("class", "movil");
     //Añadimos el escuchador al botón
    botonCancelar.addEventListener("click", aparecerLogin);

    //Añadimos todo al formulario
    formulario.append(parrafoResult, botonRegistro, botonCancelar);
}

/**
 * Acordeon con los label e input de la seccion datos cuenta
 *
 * @return  {DOMElement}  Acordeon con todos sus elementos creados
 */
function crearAcordeonDatosCuenta() {
    //Creamos el acordeon
    let acordeon1 = document.createElement("div");
    //Le asignamos la clase
    acordeon1.setAttribute("class", "acordeon");
    //Creamos el botón
    let botonAcordeon1 = crearBoton("Datos cuenta", {"type": "button"});
    //Le añadimos los listener a los botones del acordeon
    botonAcordeon1.addEventListener("click", manipularAcordeon);
    //Div que contendrá los input
    let divAcordeon1 = document.createElement("div");

    //Creamos todos los label
    let labelEmail = crearElemForm("label", {"for": "email"}, "Email");
    let labelClave = crearElemForm("label", {"for": "pwd"}, "Contraseña");
    let labelClaveRep = crearElemForm("label", {"for": "pwd2"}, "Repetir contraseña");
    let labelImagen = crearElemForm("label", {"for": "imagenPerfil"}, "Imagen de perfil");
    let labelFavGen = crearElemForm("label", {"for": "genero_favorito"}, "Género favorito");
    //Array con todos los label
    let labels =[labelEmail, labelClave, labelClaveRep, labelImagen, labelFavGen];

    //Creamos todos los inputs
    let inputEmail = crearElemForm("input", {"type": "text", "name": "email", "id": "email"});
    let inputClave = crearElemForm("input", {"type": "password", "name": "pwd", "id": "pwd"});
    let inputClaveRep = crearElemForm("input", {"type": "password", "name": "pwd2", "id": "pwd2"});
    let inputImagen = crearElemForm("input", {"type": "file", "name": "imagenPerfil", "id": "imagenPerfil"});
    let selectFavGen = crearElemForm("select", {"name": "genero_favorito", "id": "genero_favorito"});
    
    //Option por defecto
    let opcionDefault = document.createElement("option");
    opcionDefault.setAttribute("value", "");
    opcionDefault.setAttribute("selected", "selected");
    opcionDefault.textContent = "No especificado";
    selectFavGen.append(opcionDefault);

    //Creamos todos los option del select
    crearOptionGeneros(selectFavGen);

    //Array con todos los inputs
    let inputs = [inputEmail, inputClave, inputClaveRep, inputImagen, selectFavGen];

    //Añadimos todo al divAcordeon alternando entre label e input (Como ambos tienen la misma longitud usamos la longitud de los label como referencia)
    for(let i = 0; i < labels.length; i++){
        divAcordeon1.append(labels[i], inputs[i]);
    }
    //Añadimos el boton y el div al acordeon
    acordeon1.append(botonAcordeon1, divAcordeon1);
    return acordeon1;
}

/**
 * Crea el arcordeon con los label e input de datos personales
 *
 * @return  {DOMElement}  Acordeon con los elementos creados
 */
function crearAcordeonDatosPersonales() {
    //Creamos el segundo acordeon
    let acordeon2 = document.createElement("div");
    acordeon2.setAttribute("class", "acordeon");
    //Creamos el botón
    let botonAcordeon2 = crearBoton("Datos personales", {"type": "button"});
    //Le añadimos los listener a los botones del acordeon
    botonAcordeon2.addEventListener("click", manipularAcordeon);
    //Div que contendrá los input
    let divAcordeon2 = document.createElement("div");

    //Todos los labl del acordeon
    let labelNombre = crearElemForm("label", {"for": "nombre"}, "Nombre");
    let labelApellidos= crearElemForm("label", {"for": "apellidos"}, "Apellidos");
    let labelTelf = crearElemForm("label", {"for": "telf"}, "Teléfono");
    let labelFechaNac = crearElemForm("label", {"for": "fecha_nac"}, "Fecha de nacimiento");
    let labelDirc= crearElemForm("label", {"for": "direccion"}, "Dirección");
    //Array con los label
    let labelPersonales = [labelNombre, labelApellidos, labelTelf, labelFechaNac, labelDirc];

    //Todos los input
    let inputNombre = crearElemForm("input",  {"type": "text", "name": "nombre", "id": "nombre"});
    let inputApellidos= crearElemForm("input", {"type": "text", "name": "apellidos", "id": "apellidos"});
    let inputTelf = crearElemForm("input", {"type": "telf", "name": "telf", "id": "telf"});
    let inputFechaNac = crearElemForm("input", {"type": "date", "name": "fecha_nac", "id": "fecha_nac"});
    let inputDirc= crearElemForm("input", {"type": "text", "name": "direccion", "id": "direccion"});
    //Array con todos los input
    let inputPersonales = [inputNombre, inputApellidos, inputTelf, inputFechaNac, inputDirc];

    //Añadimos todo al divAcordeon alternando entre label e input (Como ambos tienen la misma longitud usamos la longitud de los label como referencia)
    for(let i = 0; i < labelPersonales.length; i++){
        divAcordeon2.append(labelPersonales[i], inputPersonales[i]);
    }

    //Ocultamos el divAcordeon2
    divAcordeon2.style.display = "none";
    //Añadimos el boton y el div al acordeon
    acordeon2.append(botonAcordeon2, divAcordeon2);
    return acordeon2;
}

/**
 * Encoje o muestra el arcodeon con un animación de jquery
 *
 * @param   {EventListener}  e  evento que lo desencadena
 *
 */
function manipularAcordeon(e) {
    //Contenedor de los elementos del formulario de ese boton
    let contenedor = e.target.nextSibling;
    //Miramos si es visible o no y le aplicamos el efecto
    contenedor.style.display == "none" ? $(contenedor).slideDown(500) : $(contenedor).slideUp(500);
   
}

/**
 * Pone como editable o lo quita de editable el formulario del perfil de ususario
 *
 */
function editarPerfil() {
    //Botón editar perfil
    let botonEditar = document.getElementById("editarCuenta");
    //Compruebo si está ya editando o no
    if(botonEditar.textContent == "Editar perfil") {
        //Buscamos todos los input con readonly y le quito este atributo
        let inputsFormulario = document.querySelectorAll("input[readonly]");
        inputsFormulario.forEach(input => input.removeAttribute("readonly"));
        //Le quitamos también el disabled al select
        document.querySelector("select[disabled]").removeAttribute("disabled");
        //Pone como visible el input para guardar los cambios
        document.querySelector("input[type='submit']").style.display = "block";
        //Cambiamos el texto de Editar perfil a cancelar
        botonEditar.textContent = "Cancelar";
    }
    else {
        //Ponemos todos los input con la propiedad readonly
        let inputs = document.querySelectorAll("input");
        inputs.forEach(input => input.setAttribute("readonly", "readonly"));
        //Ponemos el disabled al select
        document.querySelector("select").setAttribute("disabled", "disabled");
        //Ocultamos el botón de guardar cambios
        document.querySelector("input[type='submit']").style.display = "none";
        //Cambiamos el texto de cancelar a Editar perfil
        botonEditar.textContent = "Editar perfil";
    }
}

/**
 * Procesa el formulario de login, comprobando los campos y si son correctos enviándoselos al servidor y procesando su respuesta
 *
 */
async function procesarLogin(evento) {
    //Prevenimos al botón de realizar su tarea normalmente (Enviar la petición al servidor)
    evento.preventDefault();
    //Párrafo donde mostraremos el mensaje
    let resultado = document.getElementById("resultadoForm");
    try {
        //Comprobamos que todos los campos obligatorios estean cubiertos
        let camposOblig = ["email", "pwd"];
        if(!comprobarCamposOblig(camposOblig)){
            throw "Debe rellenar todos los campos obligatorios";
        }
        //Elementos
        let email = document.getElementById("email").value;
        let pwd = document.getElementById("pwd").value;
        //Comprobamos que el email sea válido
        if(!validarEmail(email)){  
            throw "El email no es válido";
        }
        //Enviamos la petición al servidor
        const respuestaJSON = await fetch("../php/login.php", {
            method: "POST",
            headers: {"Content-type": "application/json; charset=utf-8"},
            body: JSON.stringify({"email": email, "pwd": pwd})
        });
        //Cogemos el mensaje y esperamos a que este listo
        const resultadoPeticion = await respuestaJSON.json();
        //Comprobamos que no saltara un error
        if(Object.hasOwn(resultadoPeticion, "error")){
            throw new respuestaJSON["error"];
        }
        //Guardamos en sesión el usuario y su rol
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("rol", resultadoPeticion["exito"]);
        location.assign("../html/index.html");
    }
    catch($error){
        //Asignamos al p el mensaje
        resultado.textContent = "Error: " + $error;
        resultado.classList = "error";
    }
}

/**
 * Procesa el formulario de registro
 *
 * @param   {Event}  evento  Evento que dispara esta función
 *
 */
async function procesarRegistro(evento){
    //Prevenimos al botón de realizar su tarea normalmente (Enviar la petición al servidor)
    evento.preventDefault();
    //Párrafo donde mostraremos el mensaje
    let resultado = document.getElementById("resultadoForm");
    try {
        //Comprobamos que todos los campos obligatorios estean cubiertos
        let camposOblig = ["email", "pwd", "pwd2", "imagenPerfil", "nombre", "apellidos", "fecha_nac"];
        if(!comprobarCamposOblig(camposOblig)){
            throw "Debe rellenar todos los campos obligatorios";
        }
        //Elementos que enviaremos a php
        let email = document.getElementById("email").value;
        let clave = document.getElementById("pwd").value;
        let clave2 = document.getElementById("pwd2").value;
        let imagenPerfil = document.getElementById("imagenPerfil").files[0];
        let nombre = document.getElementById("nombre").value;
        let apellidos = document.getElementById("apellidos").value;
        let telefono = document.getElementById("telf").value;
        let fecha_nac = document.getElementById("fecha_nac").value;
        let direccion = document.getElementById("direccion").value;
        let genero_favorito = document.getElementById("genero_favorito").value;
        //Comprobamos que el email sea válido
        if(!validarEmail(email)){  
            throw "El email no es válido";
        }
        //Comprobamos que las contraseñas coincidan
        if(!validarClaves(clave, clave2)){
            throw "Las contraseñas no coinciden";
        }
        //Comprobamos que la fecha de nacimiento sea válida
        if(!validarFecha(fecha_nac)){
            throw "La fecha de nacimiento no es válida";
        }
        //Creamos el objeto con los datos
        let datosUsuario = {"email": email, "pwd": clave, "pwd2": clave2, "nombre": nombre, "apellidos": apellidos, "telefono": telefono, "fecha_nac": fecha_nac, "direccion": direccion, "genero_favorito": genero_favorito};
        const mensajeJSON = new FormData();
        mensajeJSON.append("imagenPerfil", imagenPerfil);
        mensajeJSON.append("datosUsuario", JSON.stringify(datosUsuario));
        //Enviamos los datos a php
        const resultadoJSON = await fetch("../php/registro.php", {
            method: "POST",
            body: mensajeJSON
        });
        const mensaje = await resultadoJSON.json();
        //Cambiamos el mensaje y le añadimos la claseque trae de respuesta del php (Si dio un error el atributo será error y el mensaje de error sino éxito y su mensaje)
        let propiedadObjeto = Object.hasOwn(mensaje, "exito") ? "exito" : "error" ;
        resultado.textContent = mensaje[propiedadObjeto];
        resultado.classList = propiedadObjeto;
        //Si es éxito borramos los input del formulario
        if(propiedadObjeto == "exito") {
            await limpiarTodosCamposForm(true);
        }
    }
    catch($error){
        //Asignamos al p el mensaje
        resultado.textContent = "Error: " + $error;
        resultado.classList = "error";
    }
}

/**
 * Marca los campos que le pasamos en el array como obligatorios
 *
 * @param   {array}  camposOblig  Array con los id de los input obligatorios
 *
 */
function marcarCamposOblig(camposOblig){
    //Pone antes de cada campo un * para marcar que es un campo Obligatorio
    //Recorremos cada uno de los id de los input
    camposOblig.forEach(campo => {
        //Cogemos el label que tiene el for para ese id y le añadimos la clase campoOblig
        document.querySelector(`label[for='${campo}']`).setAttribute("class", "campoOblig");
    });
}

/**
 * Comprueba que todos los campos obligatorios tengan valor
 *
 * @param   {array}  camposOblig  Todos los ide de los campos obligatorios
 *
 * @return  {boolean}               True si todos los campos están cubiertos, False si no
 */
function comprobarCamposOblig(camposOblig){
    return camposOblig.find(campo => document.getElementById(campo).value == "") == undefined;
}

/**
 * Valida el email contra una expresión regular
 *
 * @param   {string}  email  Email del usuario
 *
 * @return  {boolean}         Si el email es válido o no
 */
function validarEmail(email) {
    /* Expresión regular que comprueba: que tenga Cualquier caracter de letra o número un . o - + cualquier letra o número @ letra o número acompañado o no
     * 1.- Que empiece por cualquier caracter alfanumérico (^\w)
     * 2.- Que tengo (o no) un punto o guión (o no) y seguido de algún caracter alfanumérico (([\.-]?\w+)*)
     * 3.- Que vaya seguido de un @ seguido de algún caracter alfanumérico (@\w+)
     * 4.- Que pueda ir acompañado de un punto o guion y algún caracter alfanumérico (([\.-]?\w+)*)
     * 5.- Que termine en punto y de 2 a 3 caracteres alfanuméricos (\.\w{2,3})$
    */
   let regEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/);
   //Comprobamos si encuentra esa expresión si la encuentra devolvemos true sino false (Ponemos esto porque sino devuelve la expresión o un array vacio)
   return email.match(regEmail) ? true : false;
}

/**
 * Comprueba que las contraseñas coincidan
 *
 * @param   {string}  clave1  Clave
 * @param   {string}  clave2  Clave repetida
 *
 * @return  {boolean}          Devuelve si ambas claves son la misma
 */
function validarClaves(clave1, clave2){
    return clave1 === clave2;
}

/**
 * Comprueba que una fecha sea válida
 *
 * @param   {string}  fecha  Fecha
 *
 * @return  {boolean}         True si es valida, False si no
 */
function validarFecha(fecha){
    //Convertimos la fecha con Date.parse, si da Nan es que no es válida, sino es válida
    return !isNaN(Date.parse(fecha));
}

/**
 * Limpia todos los campos de los formularios despues de 2s
 *
 * @param   {boolean}  archivo  Si hay algún input de tipo file
 *
 */
async function limpiarTodosCamposForm(archivo) {
    setTimeout(archivo => {
        //Comprobamos si hay algún input de tipo archivo
        if(archivo){
            //Todos os input menos el de archivo y el de submit
            let inputsFormulario = document.querySelectorAll("input:not(input[type='file'], input[type='submit'])");
            inputsFormulario.forEach(campo => campo.value = "");
            //Limpiamos el select también, ponemos el value "" como seleccionado
            document.querySelector("option[selected]").removeAttribute("selected");
            //Limpiamos el archivo
            document.querySelector("input[type='file']").files = null;
        }
        else {
            //Todos os input menos el de submit
            let inputsFormulario = document.querySelectorAll("input:not(input[type='submit'])");
            inputsFormulario.forEach(campo => campo.value = "");
        }
    }, 2000);
}

/**
 * Crea cada una de las opciones de los géneros
 *
 * @param   {DOMElement}  selectAnhadir  Select donde irán las opciones
 *
 */
async function crearOptionGeneros(selectAnhadir){
    //Nos conectamos con el servidor para pedirle los géneros, como no envíamos datos y no devuelve datos comprometidos sólo especificamos el método
    const respuestaJSON = await fetch("../php/registro.php", {
        method: "GET",
        headers: {"Content-type": "application/json; charset=utf-8"}
    });
    //Es importante poner la espera en la respuesta porque sino lo lee como undefined
    let generos = await respuestaJSON.json();
    if(Object.hasOwn(generos, "generos")){
        //Formamos un option con cada género
        generos["generos"].forEach(genero => {
            let opcion = document.createElement("option");
            opcion.setAttribute("value", genero);
            opcion.textContent = genero;
            selectAnhadir.append(opcion);
        });
    }
}

/**
 * Despliega el menú del perfil
 *
 * @param   {Event}  e  Evento que disparó al escuchador
 *
 */
function desplegarMenuPerfil(e) {
    let contenedorOpciones = e.target.nextSibling;
    contenedorOpciones.style.display == "none" ? $(contenedorOpciones).slideDown(500) : $(contenedorOpciones).slideUp(500);
}

/**
 * Cierra la sesion y recarga la página
 *
 * @param   {Event}  e  Evento que disparó la función
 *
 */
async function desconectarPerfil(e) {
    //Prevengo que redirija
    e.preventDefault();
    //Pedimos que borren del $_SESSION
    const respuesta = await fetch("../php/login.php?desconectar=true", {
        method: "GET",
    });
    const respuestaJSON = await respuesta.json();
    if(Object.hasOwn(respuestaJSON, "exito")) {
        //Borra el sesion storage y recarga la página
        sessionStorage.clear();
        location.assign("../html/index.html");
    }
}
/**
 * Le manda a perfil_usuario.php un json con el que pedirá los datos gracias al email
 * del usuario, recibirá un json con toda la información de vuelta y modificará el dom del perfil del usuario
 *
 * @return  {[type]}  [return description]
 */
async function cargarDatosPerfil() {
    try{
    // email está almacenado en sessionStorage
    const respuesta = await fetch("../php/perfil_usuario.php",{
        method: "POST", 
        headers: {"Content-type": "application/json;charset=UTF-8"},
        body: JSON.stringify({
            "email":sessionStorage.getItem("email") 
        })
    }); // Esto va a devolver un promise
    
    const respuesta_json = await respuesta.json(); // Coge la respuesta y la convierte a objeto de js
    
    /** Con este objeto en js vamos a modificar el DOM
     * Añadiendo cuando sea necesario los atributos necesarios 
     * para su correcta selección 
    **/ 
    // Modificamos la variable nombre y le quitamos el atributo readonly
    document.getElementById("nombre").removeAttribute("readonly");
    // Recuperamos el nombre
    document.getElementById("nombre").value = respuesta_json['nombre'];

    // Modificamos la variable genero y le quitamos el atributo readonly
    document.getElementById("genero_favorito").removeAttribute("disabled");
    // Ahora tenemos que seleccionar (con el atributo selected) la option que nos pasa el objeto
    document.querySelector(`option[value="${respuesta_json['genero_favorito']}"]`).setAttribute("selected","selected");
    
    // Modificamos la variable apellidos y le quitamos el atributo readonly
    document.getElementById("apellidos").removeAttribute("readonly");
    // Recuperamos los apellidos
    document.getElementById("apellidos").value = respuesta_json['apellidos'];

    // Modificamos la variable telefono y le quitamos el atributo readonly
    document.getElementById("telefono").removeAttribute("readonly");
    // Recuperamos el telefono
    document.getElementById("telefono").value = respuesta_json['telefono'];


    // Modificamos la variable dirección y le quitamos el atributo readonly
    document.getElementById("direccion").removeAttribute("readonly");
    // Recuperamos la dirección
    document.getElementById("direccion").value = respuesta_json['direccion'];
}
catch(error){
    console.log(error); // Mensaje para mostrar el error   
}
}