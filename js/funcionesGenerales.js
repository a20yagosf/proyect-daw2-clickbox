
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
    let navegador = crearNav(["suscripciones.html", "#", "#"], ["Suscripciones", "Partidas", "Tienda"]);
    //Añadimos al header
    cabecera.append(navegador);
    //Añadimos al body al inicio de todo
    let cuerpo = document.querySelector("body");
    //Los añadimos el que queremos de último primero para que se coloquen en el orden correcto ya que los ponemos de primer hijo
    cuerpo.insertBefore(cabecera, cuerpo.firstChild);
    cuerpo.insertBefore(alerta, cuerpo.firstChild);
}

/**
 * Crea el navegador con javascript
 *
 * @param   {array}  redireccion   A donde llevarán los enlaces
 * @param   {array}  elementosNav  Cada uno de los nombres de los enlaces que pondremos
 *
 * @return  {DOMElement}                Navegador hecho con javascript
 */
function crearNav(redireccion, elementosNav) {
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
   //Botón para iniciar sesión
   let botonInicioSesion = crearBoton("Iniciar sesión");
   botonInicioSesion.setAttribute("id", "inicioSesion")
   //Añadimos todo al contenedor del nav y despues al nav
   contenedorNav.append(logo, botonHamburguesa, lista, botonInicioSesion);
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
    let imagenesRedes = crearArrayElem("crearImg", 3, [{"src": "../img/logoTwitter.svg", "alt": "Logo de Twitter"}, {"src": "../img/logoInstagram.svg", "alt": "Logo de Instagram"}, {"src": "../img/logoTickTock.svg", "alt": "Logo de Tick Tock"}]);
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
        //Le asigno el id
        contenedorLogin.setAttribute("id", "login");
        //Creo los componentes del interior
        let encabezado = document.createElement("h2");
        encabezado.textContent = "Registrate o inicia sesión";
        let paragrafo = document.createElement("p");
        paragrafo.textContent = "Por favor crea una cuenta para poder acceder a más funcionalidades de la web como suscribirte, reservar partidas y mucho más";
        //Contenedor de los botones
        let contenedorBotones = document.createElement("div");
        //Botones
        let botones = crearArrayElem("crearBoton", 2, [["Registrarse", "Iniciar sesión"], [{"class": "noActivo", "data-nombre": "registro"}, {"data-nombre": "login"}]]);
        contenedorBotones.append(...botones);
        //Creamos el formulario (Por defecto se activa con el login)
        let formulario = document.createElement("form");
        crearLogin(formulario);
        //Creo el botón de cierre
        let botonCierre = crearBoton("X");
        //Lo añado todo al contenedor login
        contenedorLogin.append(encabezado, paragrafo, contenedorBotones, formulario, botonCierre);
        //Le añado los escuchadores a los botones
        botones.forEach(boton => boton.addEventListener("click", cambiarForm));
        botonCierre.addEventListener("click", aparecerLogin);
        //Pomos o elemento como display none para mostralo cunha animación
        contenedorLogin.style.display = "none";
        //Añado el contenedor al body
        document.querySelector("body").append(contenedorLogin);
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
    //Creamos los input y los añadimos al formulario
    formulario.append(...crearArrayElem("crearElemForm", 2, [["input", "input"],[{"type": "email", "name": "email", "placeholder": "Correo electrónico", "id": "email"}, {"type": "password", "name": "pwd", "placeholder": "Contraseña", "id": "pwd"}]]));
    //Botón para móvil para poder salir
    let botonCancelar = crearBoton("Cancelar", {"type": "button"});
    botonCancelar.setAttribute("class", "movil");
    //Añadimos el escuchador al botón
    botonCancelar.addEventListener("click", aparecerLogin);
    //Creo el botón de iniciar sesión
    formulario.append(crearBoton("Iniciar sesión", {"type": "submit"}), botonCancelar);
}

/**
 * Crea los elementos del registro del login
 *
 * @param   {DOMElement}  formulario  Formulario del login
 *
 */
function crearRegistro(formulario) {
    //Acordeon 1
    //Creamos el acordeon
    let acordeon1 = document.createElement("div");
    //Le asignamos la clase
    acordeon1.setAttribute("class", "acordeon");
    //Creamos el botón
    let botonAcordeon1 = crearBoton("Datos cuenta", {"type": "button"});
    //Div que contendrá los input
    let divAcordeon1 = document.createElement("div");
    //Todos los input que contendrá
    let inputAcordeon1 = crearArrayElem("crearElemForm", 3, [["input", "input", "input"],[{"type": "text", "name": "email", "id": "email", "placeholder": "Correo electrónico"}, {"type": "password", "name": "pwd", "id": "pwd", "placeholder": "Contraseña"}, {"type": "password", "name": "pwd2", "id": "pwd2", "placeholder": "Repetir contraseña"}]]);
    //Añadimos todo al divAcordeon
    divAcordeon1.append(...inputAcordeon1);
    //Añadimos el boton y el div al acordeon
    acordeon1.append(botonAcordeon1, divAcordeon1);

    //Acordeon2
    //Creamos el segundo acordeon
    let acordeon2 = document.createElement("div");
    acordeon2.setAttribute("class", "acordeon");
    //Creamos el botón
    let botonAcordeon2 = crearBoton("Datos personales", {"type": "button"});
    //Div que contendrá los input
    let divAcordeon2 = document.createElement("div");
    //Todos los elementos del formulario que contendrá
    let elemFormAcordeon2 = crearArrayElem("crearElemForm", 10, [["label", "input", "label", "input", "label", "input", "label", "input", "label", "input"], [{"for": "nombre"}, {"type": "text", "name": "nombre", "id": "nombre"}, {"for": "apellidos"}, {"type": "text", "name": "apellidos", "id": "apellidos"}, {"for": "telf"}, {"type": "telf", "name": "telf", "id": "telf"}, {"for": "fecha_nac"}, {"type": "date", "name": "fecha_nac", "id": "fecha_nac"}, {"for": "direccion"}, {"type": "text", "name": "direccion", "id": "direccion"}], ["Nombre", "", "Apellidos", "", "Teléfono", "", "Fecha de nacimiento", "", "Dirección"]]);
    //Añadimos los elementos al acordeon
    divAcordeon2.append(...elemFormAcordeon2);
    //Ocultamos el divAcordeon2
    divAcordeon2.style.display = "none";
    //Añadimos el boton y el div al acordeon
    acordeon2.append(botonAcordeon2, divAcordeon2);

    //Botón de registro
    let botonRegistro = crearElemForm("input", {"type": "submit", "value": "Registrarme"});
    //Le añadimos los listener a los botones del acordeon
    botonAcordeon1.addEventListener("click", manipularAcordeon);
    botonAcordeon2.addEventListener("click", manipularAcordeon);
    
     //Botón para móvil para poder salir
     let botonCancelar = crearBoton("Cancelar", {"type": "button"});
     botonCancelar.setAttribute("class", "movil");
     //Añadimos el escuchador al botón
    botonCancelar.addEventListener("click", aparecerLogin);

    //Añadimos todo al formulario
    formulario.append(acordeon1, acordeon2, botonRegistro, botonCancelar);
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