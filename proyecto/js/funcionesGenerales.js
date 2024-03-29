/**
 * Clase fecha con la fecha correcta
 */
class Fecha {
  constructor(fecha) {
    this.fecha = new Date(fecha);
    this.formatearFecha();
  }

  getFecha() {
    return this.fecha;
  }

  /**
   * Formatea la fecha le pasan
   * @param {Date}  Fecha a formatear
   */
  formatearFecha() {
    let dia =
      this.fecha.getDate() < 9
        ? "0" + this.fecha.getDate()
        : this.fecha.getDate();
    let mes = this.fecha.getMonth() + 1 > 12 ? 1 : this.fecha.getMonth() + 1;
    this.fecha =
      dia + "-" + (mes < 9 ? "0" + mes : mes) + "-" + this.fecha.getFullYear();
  }

  /**
   * Devuelve la diferencia de fechas en Semanas, dias y horas, si es menos de una hora devuelve hoy
   *
   * @return  {string}  Cadena con la diferencia de la fecha con este momento
   */
  fechaDesdeHoyAnhos() {
    //Constantes para pasar desde milisegundos a las otras unidades
    const horas = 1000 * 60 * 60;
    const dias = horas * 24;
    const semana = dias * 7;
    let diferenciaMiliSegundos = Math.abs(
      Date.now() - new Date(this.fecha).getTime()
    );
    let difSemana = Math.floor(diferenciaMiliSegundos / semana);
    let tiempo =
      difSemana > 0
        ? "Hace " + difSemana + (difSemana > 1 ? " semanas " : " semana ")
        : "Hace ";
    let difDias = Math.floor((diferenciaMiliSegundos % semana) / dias);
    tiempo += difDias > 0 ? difDias + (difDias > 1 ? " días" : " día") : "";
    let difHoras = Math.floor(
      ((diferenciaMiliSegundos % semana) % difDias) / dias
    );
    tiempo +=
      difHoras > 0 ? difHoras + (difHoras > 1 ? " horas" : " hora") : "";
    difSemana > 7 ? (tiempo = this.fecha) : "";
    //Comprobamos que no quedara vacío (que haga menos  de 1 hora)
    return tiempo == "Hace " ? "Hoy" : tiempo;
  }

  /**
   * Devuelve la fecha en formato mes año
   */
  formatearFechaMesAnho() {
    let mes = this.fecha.substring(3, 5);
    let anho = this.fecha.substring(6);
    let fecha = "";
    switch (parseInt(mes)) {
      case 1:
        fecha = "Enero " + anho;
        break;

      case 2:
        fecha = "Febrero " + anho;
        break;

      case 3:
        fecha = "Marzo " + anho;
        break;

      case 4:
        fecha = "Abril " + anho;
        break;

      case 5:
        fecha = "Mayo " + anho;
        break;

      case 6:
        fecha = "Junio " + anho;
        break;

      case 7:
        fecha = "Julio " + anho;
        break;

      case 8:
        fecha = "Agosto " + anho;
        break;

      case 9:
        fecha = "Septiembre " + anho;
        break;

      case 10:
        fecha = "Octubre " + anho;
        break;

      case 11:
        fecha = "Noviembre " + anho;
        break;

      case 12:
        fecha = "Diciembre " + anho;
        break;
    }
    return fecha;
  }
}

/**
 * Crea el mapa a partir de la API de Lefletjs
 *
 */
function crearMapa() {
  //Creamos el mapa, asignandole unas coordenadas [] y un zoom
  let mapa = L.map("map").setView([42.23089017869441, -8.728312405255604], 16);
  //Creamos lo que es la vista del mapa
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      //Máximo Zoom que permitimos, este es el máximo zoom que permite lefletjs
      maxZoom: 18,
      //Id del stilo
      id: "mapbox/streets-v11",
      //Tamaño que tendrán cada una de las celdas, por defecto Mapbox devuelve celdas de 512x512 por eso le damos zoomOffeset -1 (las convierte en 256x256)
      tileSize: 512,
      zoomOffset: -1,
      //Token que creamos en la cuenta de mapbox
      accessToken:
        "pk.eyJ1IjoiaXJlYSIsImEiOiJja3pidXhhMHkxdGp5MnJuOWd0OHJ2dGIwIn0.tbQ-y0uTguMhMomhbFL8lA",
    }
  ).addTo(mapa);
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
  //Creamos el div que contendrá la alerta
  let contenedorAlerta = document.createElement("div", {
    id: "textoUltimasNov",
  });
  //Le añadimos el id
  contenedorAlerta.setAttribute("id", "alerta");
  cargarAlertaUltProducto(contenedorAlerta);
  //Creamos el elemento header
  let cabecera = document.createElement("header");
  //Creamos el nav
  let navegador = crearNav(
    ["./suscripciones.html", "./partidas.html", "#"],
    ["Suscripciones", "Partidas", "Tienda"]
  );
  //Añadimos al header
  cabecera.append(navegador);
  //Comprobamos si existe el rol //Rol 1: Admin 2: Estandar 3: Anónimo
  if (sessionStorage.getItem("rol") !== null) {
    let contenedorPerfil;
    let enlacePerfil;
    let salirPerfil;
    //Creamos el botón del usuario
    switch (parseInt(sessionStorage.getItem("rol"))) {
      //Admin
      case 1:
        //Creamos el botón del usuario
        //Botón para iniciar sesión
        let botonPanelControl = crearBoton(sessionStorage["email"], {
          id: "botonPerfilUsuario",
        });
        //Creamos el div  con el cotenido
        contenedorPerfil = document.createElement("div");
        contenedorPerfil.setAttribute("id", "menuPerfilUser");

        //Creamos los enlaces
        enlacePerfil = crearEnlace(
          "../html/perfilUsuario.html",
          "Perfil de usuario"
        );
        enlacePerfil.addEventListener("click", irPerfilUsuario);
        enlacePanelControl = crearEnlace(
          "../html/panelAdministrador.html",
          "Panel de Control"
        );
        enlacePanelControl.addEventListener("click", irPanelControlAdmin);
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
        cuerpo.insertBefore(contenedorAlerta, cuerpo.firstChild);
        break;

      //Estandar
      default:
        //Creamos el botón del usuario
        //Botón para iniciar sesión
        let botonPerfil = crearBoton(sessionStorage["email"], {
          id: "botonPerfilUsuario",
        });
        //Creamos el div  con el cotenido
        contenedorPerfil = document.createElement("div");
        contenedorPerfil.setAttribute("id", "menuPerfilUser");
        //Creamos los enlaces
        enlacePerfil = crearEnlace(
          "../html/perfilUsuario.html",
          "Perfil de usuario"
        );
        enlacePerfil.addEventListener("click", irPerfilUsuario);
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
        cuerpo.insertBefore(contenedorAlerta, cuerpo.firstChild);
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
    cuerpo.insertBefore(contenedorAlerta, cuerpo.firstChild);
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
  let logo = crearEnlace(
    "index.html",
    crearImg({ src: "../img/logoClickBox.svg", alt: "Logo ClickBox" })
  );
  //Creamos el botón hamburguesa
  let botonHamburguesa = crearBoton("", {
    class: "navbar-toggler",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#listaNav",
    "aria-controls": "listaNav",
    "aria-expanded": "false",
    "aria-label": "Menú hamburguesa",
  });
  //Creamos cada uno de los enlaces
  //crearArrayElem("crearEnlace", 3, [redireccion, elementosNav]), {"id": "listaNav", "class": "collapse navbar-collapse"}
  let enlaceSuscripciones = crearEnlace(
    "../html/suscripciones.html",
    "Suscripciones"
  );
  enlaceSuscripciones.addEventListener("click", irSuscripciones);
  let enlacePartidas = crearEnlace("../html/partidas.html", "Partidas");
  enlacePartidas.addEventListener("click", irPartidas);
  let enlaceTienda = crearEnlace("#", "Tienda");
  // La Tienda estará en desarrollo
  enlaceTienda.classList.add("development");
  //Creamos la lista
  let lista = crearLista(
    "ul",
    [enlaceSuscripciones, enlacePartidas, enlaceTienda],
    { id: "listaNav", class: "collapse navbar-collapse" }
  );
  lista.lastElementChild.setAttribute("class", "navDesactivado");
  //Añadimos todo al contenedor del nav y despues al nav
  contenedorNav.append(logo, botonHamburguesa, lista);
  navegador.append(contenedorNav);
  //Creamos el enlace
  return navegador;
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
  let imagenLogo = crearImg({
    src: "../img/logoClickBoxFooter.svg",
    alt: "Logo ClickBox",
  });
  //Enlaces de la lista
  let enlaceLogo = crearEnlace("../html/index.html", imagenLogo);
  enlaceLogo.addEventListener("click", irPrincipal);
  let enlaceProteccion = crearEnlace("#", "Protección de datos");
  let enlaceSuscripciones = crearEnlace(
    "../html/suscripciones.html",
    "Suscripciones"
  );
  enlaceSuscripciones.addEventListener("click", irSuscripciones);
  let enlacePartidas = crearEnlace("../html/partidas.html", "Partidas");
  enlacePartidas.addEventListener("click", irPartidas);
  let enlaceTienda = crearEnlace("#", "Tienda");
  // La Tienda estará en desarrollo
  enlaceTienda.classList.add("development");
  let lista = crearLista("ul", [
    enlaceLogo,
    enlaceProteccion,
    enlaceSuscripciones,
    enlacePartidas,
    enlaceTienda,
  ]);
  lista.setAttribute("id", "infoPag");

  //Conenedor de redes
  let contenedorRedes = document.createElement("div");
  contenedorRedes.setAttribute("id", "redes");
  //Imagenes de las redes que creamos mediante js
  let imagenesRedes = crearArrayElem("crearImg", 3, [
    { src: "../img/iconos/logoTwitter.svg", alt: "Logo de Twitter" },
    { src: "../img/iconos/logoInstagram.svg", alt: "Logo de Instagram" },
    { src: "../img/iconos/logoTickTock.svg", alt: "Logo de Tick Tock" },
  ]);
  //Enlaces de las redes
  let enlacesRedes = crearArrayElem("crearEnlace", 3, [
    ["#", "#", "#"],
    imagenesRedes,
  ]);
  contenedorRedes.append(...enlacesRedes);

  //Contenedor de localización
  let contenedorLocalizacion = document.createElement("div");
  contenedorLocalizacion.setAttribute("id", "localizacion");
  //Creamos el h4
  let cabeceraLocalizacion = document.createElement("h4");
  cabeceraLocalizacion.textContent = "Localización";
  //Enlace de la localización del local
  let enlaceLocalizacion = crearEnlace(
    "https://www.google.com/maps/place/Paseo+Cronista+Xos%C3%A9+M.+%C3%81lvarez+Bl%C3%A1zquez,+26,+36203+Vigo,+Pontevedra/@42.230894,-8.7304107,17z/data=!3m1!4b1!4m5!3m4!1s0xd2f6212e2ab8fbf:0x3a36a0a129ebbdd9!8m2!3d42.23089!4d-8.728222",
    "Paseo Cronista Xosé M. Álvarez Blázquez, 26, 36203 Vigo, Pontevedra"
  );
  //Contenedor del mapa
  let contenedorMapa = document.createElement("div");
  contenedorMapa.setAttribute("id", "map");
  //Añadimos todo a localización
  contenedorLocalizacion.append(
    cabeceraLocalizacion,
    enlaceLocalizacion,
    contenedorMapa
  );

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
  typeof elemento == "string"
    ? (elemEnlace.innerHTML = elemento)
    : elemEnlace.append(elemento);
  return elemEnlace;
}

/**
 * Crea un elemento imagen de tipo DOM con los atributos que se le pasan por cabecera
 *
 * @param   {Object}  atributos  Object con clave valor con el nombre del atributo: valor del atributo
 *
 * @return  {NodeElement}            Elemento img del DOM
 */
function crearImg(atributos) {
  //Creamos la imagen del logo
  let imagen = document.createElement("img");
  //Le añadimos sus atributos a la imagen diviendolo en array de [clave, valor]
  Object.entries(atributos).forEach((atributo) => {
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
function crearLista(
  tipoLista,
  elementosContiene,
  atributosLista = {},
  atributosElementos = {}
) {
  //Creamos la lista
  let lista =
    tipoLista == "ul"
      ? document.createElement("ul")
      : document.createElement("ol");
  //Le añadimos los atributos diviendolo en array [clave, valor]
  Object.entries(atributosLista).forEach((atributo) =>
    lista.setAttribute(atributo[0], atributo[1])
  );
  //Creamos los elementos añadiendole los atributos y el texto u elemento
  elementosContiene.forEach((elemento) => {
    let elementoLista = document.createElement("li");
    //Comprobamos el tipo del elemento y lo añadimos
    typeof elemento == "string"
      ? (elementoLista.textContent = elemento)
      : elementoLista.append(elemento);
    //Le añadimos los atributos diviendolos en [clave, valor]
    Object.entries(atributosElementos).forEach((atributo) =>
      elementoLista.setAttribute(atributo[0], atributo[1])
    );
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
function crearBoton(texto = "", atributos = {}) {
  //Creamos el boton
  let boton = document.createElement("button");
  //Le asignamos los atributos (si tiene) diviendolo en array de [clave, valor]
  Object.entries(atributos).forEach((atributo) =>
    boton.setAttribute(atributo[0], atributo[1])
  );
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
function crearArrayElem(callback, numElementos, argumentos) {
  let arrayElementos = [];
  //Comprobamos el nombre de la función y la ejecutamos creando tantos de ese tipo como queramos
  switch (callback) {
    case "crearEnlace":
      for (let i = 0; i < numElementos; i++) {
        arrayElementos.push(crearEnlace(argumentos[0][i], argumentos[1][i]));
      }
      break;

    case "crearImg":
      for (let i = 0; i < numElementos; i++) {
        arrayElementos.push(crearImg(argumentos[i]));
      }
      break;

    case "crearLista":
      for (let i = 0; i < numElementos; i++) {
        arrayElementos.push(
          crearLista(
            argumentos[0][i],
            argumentos[1][i],
            argumentos[2][i],
            argumentos[3][i]
          )
        );
      }
      break;

    case "crearBoton":
      for (let i = 0; i < numElementos; i++) {
        arrayElementos.push(crearBoton(argumentos[0][i], argumentos[1][i]));
      }
      break;

    case "crearElemForm":
      for (let i = 0; i < numElementos; i++) {
        argumentos.length < 3
          ? arrayElementos.push(crearElem(argumentos[0][i], argumentos[1][i]))
          : arrayElementos.push(
              crearElem(argumentos[0][i], argumentos[1][i], argumentos[2][i])
            );
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
  document.querySelector("th").textContent =
    boton.children[0].textContent + " " + boton.children[1].textContent;
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
  cabeza.append(
    crearLink({
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css",
      integrity:
        "sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==",
      crossorigin: "",
    })
  );
  //JS Leflet.js
  cabeza.append(
    crearScript({
      src: "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js",
      integrity:
        "sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==",
      crossorigin: "",
    })
  );
  //CSS Bootstrap
  cabeza.append(
    crearLink({
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
      rel: "stylesheet",
      integrity:
        "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3",
      crossorigin: "anonymous",
    })
  );
  //librería jquery
  cabeza.append(
    crearScript({ src: "https://code.jquery.com/jquery-3.6.0.min.js" })
  );
  //CSS general
  cabeza.append(crearLink({ rel: "stylesheet", href: "../css/styles.css" }));
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
  Object.entries(atributos).forEach((atributo) =>
    elementoScript.setAttribute(atributo[0], atributo[1])
  );
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
  Object.entries(atributos).forEach((atributo) =>
    elementoLink.setAttribute(atributo[0], atributo[1])
  );
  return elementoLink;
}

/**
 * Hace aparecer o desaparecer la ventana de login
 *
 */
function aparecerLogin() {
  let contenedorLogin = document.getElementById("login");
  //Compruebamos si el login ya existe
  if (contenedorLogin) {
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
    paragrafo.textContent =
      "Por favor crea una cuenta para poder acceder a más funcionalidades de la web como suscribirte, reservar partidas y mucho más";
    //Parrafo que explica que * son los campos obligatorios
    let parrafoOblig = document.createElement("p");
    parrafoOblig.textContent = "Los campos obligatorios están marcados con :";
    parrafoOblig.setAttribute("class", "campoOblig");
    //Contenedor de los botones
    let contenedorBotones = document.createElement("div");
    //Botones
    let registro = crearBoton("Registrarse", {
      class: "noActivo",
      "data-nombre": "registro",
    });
    let login = crearBoton("Iniciar sesión", { "data-nombre": "login" });
    let botones = [registro, login];
    contenedorBotones.append(...botones);
    //Creamos el formulario (Por defecto se activa con el login)
    let formulario = document.createElement("form");
    //Atributos del formulario
    let atributosForm = {
      action: "../php/registro.php",
      method: "POST",
      enctype: "multipart/form-data",
    };
    //Le asignamos los atributos al formulario
    Object.entries(atributosForm).forEach((atributo) =>
      formulario.setAttribute(atributo[0], atributo[1])
    );
    //Creamos el botón de cierre
    let botonCierre = crearBoton("X");
    //Lo añadimos todo al contenedor login
    contenedorLogin.append(
      encabezado,
      paragrafo,
      parrafoOblig,
      contenedorBotones,
      formulario,
      botonCierre
    );
    //Le añadimos los escuchadores a los botones
    botones.forEach((boton) => boton.addEventListener("click", cambiarForm));
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
  if (boton.classList.contains("noActivo")) {
    //Le quito la clase y se lo paso al otro
    boton.classList.remove("noActivo");
    //Dependiendo de que botón el pulsado le asignamos a su hermano (si es login su hermano es el anterior, si es registro su hermano es el posterior)
    boton.dataset.nombre == "login"
      ? boton.previousSibling.classList.add("noActivo")
      : boton.nextSibling.classList.add("noActivo");
  }
  //Limpio el formulario
  formulario.innerHTML = "";
  //Le creo el formulario que le toque
  boton.dataset.nombre == "login"
    ? crearLogin(formulario)
    : crearRegistro(formulario);
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
function crearElem(tipoElemento, atributos, texto = "") {
  //Creamos el elemento
  let elementoForm = document.createElement(tipoElemento);
  //Le asignamos los atributos conviertiendolos a [clave, valor]
  Object.entries(atributos).forEach((atributo) =>
    elementoForm.setAttribute(atributo[0], atributo[1])
  );
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
  let labelEmail = crearElem("label", { for: "email" }, "Email");
  let labelClave = crearElem("label", { for: "pwd" }, "Contraseña");
  //Input login
  let inputEmail = crearElem("input", {
    type: "email",
    name: "email",
    placeholder: "Correo electrónico",
    id: "email",
  });
  let inputClave = crearElem("input", {
    type: "password",
    name: "pwd",
    placeholder: "Contraseña",
    id: "pwd",
  });
  //Creamos los input y los añadimos al formulario
  formulario.append(labelEmail, inputEmail, labelClave, inputClave);
  //Marcamos los campos Obligatorios
  marcarCamposOblig(["email", "pwd"]);
  //Párrafo para mostrar el mensaje de éxito o error
  let parrafoResult = document.createElement("p");
  parrafoResult.setAttribute("id", "resultadoForm");
  //Botón para móvil para poder salir
  let botonCancelar = crearBoton("Cancelar", { type: "button" });
  botonCancelar.setAttribute("class", "movil");
  //Añadimos el escuchador al botón
  botonCancelar.addEventListener("click", aparecerLogin);
  let botonLogin = crearBoton("Iniciar sesión", { type: "submit" });
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
  marcarCamposOblig([
    "email",
    "pwd",
    "pwd2",
    "imagenPerfil",
    "nombre",
    "apellidos",
    "fecha_nac",
  ]);
  //Párrafo para mostrar el mensaje de éxito o error
  let parrafoResult = document.createElement("p");
  parrafoResult.setAttribute("id", "resultadoForm");
  //Botón de registro
  let botonRegistro = crearElem("input", {
    type: "submit",
    value: "Registrarme",
  });
  //Botón para móvil para poder salir
  let botonCancelar = crearBoton("Cancelar", { type: "button" });
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
  let botonAcordeon1 = crearBoton("Datos cuenta", { type: "button" });
  //Le añadimos los listener a los botones del acordeon
  botonAcordeon1.addEventListener("click", manipularAcordeon);
  //Div que contendrá los input
  let divAcordeon1 = document.createElement("div");

  //Creamos todos los label
  let labelEmail = crearElem("label", { for: "email" }, "Email");
  let labelClave = crearElem("label", { for: "pwd" }, "Contraseña");
  let labelClaveRep = crearElem("label", { for: "pwd2" }, "Repetir contraseña");
  let labelImagen = crearElem(
    "label",
    { for: "imagenPerfil" },
    "Imagen de perfil"
  );
  let labelFavGen = crearElem(
    "label",
    { for: "genero_favorito" },
    "Género favorito"
  );
  //Array con todos los label
  let labels = [
    labelEmail,
    labelClave,
    labelClaveRep,
    labelImagen,
    labelFavGen,
  ];

  //Creamos todos los inputs
  let inputEmail = crearElem("input", {
    type: "text",
    name: "email",
    id: "email",
  });
  let inputClave = crearElem("input", {
    type: "password",
    name: "pwd",
    id: "pwd",
  });
  let inputClaveRep = crearElem("input", {
    type: "password",
    name: "pwd2",
    id: "pwd2",
  });
  let inputImagen = crearElem("input", {
    type: "file",
    name: "imagenPerfil",
    id: "imagenPerfil",
  });
  let selectFavGen = crearElem("select", {
    name: "genero_favorito",
    id: "genero_favorito",
  });

  //Option por defecto
  let opcionDefault = document.createElement("option");
  opcionDefault.setAttribute("value", "");
  opcionDefault.setAttribute("selected", "selected");
  opcionDefault.textContent = "No especificado";
  selectFavGen.append(opcionDefault);

  //Array con todos los inputs
  let inputs = [
    inputEmail,
    inputClave,
    inputClaveRep,
    inputImagen,
    selectFavGen,
  ];

  //Añadimos todo al divAcordeon alternando entre label e input (Como ambos tienen la misma longitud usamos la longitud de los label como referencia)
  for (let i = 0; i < labels.length; i++) {
    divAcordeon1.append(labels[i], inputs[i]);
  }
  //Añadimos el boton y el div al acordeon
  acordeon1.append(botonAcordeon1, divAcordeon1);
  //Creamos todos los option del select
  crearOptionGeneros(selectFavGen);
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
  let botonAcordeon2 = crearBoton("Datos personales", { type: "button" });
  //Le añadimos los listener a los botones del acordeon
  botonAcordeon2.addEventListener("click", manipularAcordeon);
  //Div que contendrá los input
  let divAcordeon2 = document.createElement("div");

  //Todos los labl del acordeon
  let labelNombre = crearElem("label", { for: "nombre" }, "Nombre");
  let labelApellidos = crearElem("label", { for: "apellidos" }, "Apellidos");
  let labelTelf = crearElem("label", { for: "telf" }, "Teléfono");
  let labelFechaNac = crearElem(
    "label",
    { for: "fecha_nac" },
    "Fecha de nacimiento"
  );
  let labelDirc = crearElem("label", { for: "direccion" }, "Dirección");
  //Array con los label
  let labelPersonales = [
    labelNombre,
    labelApellidos,
    labelTelf,
    labelFechaNac,
    labelDirc,
  ];

  //Todos los input
  let inputNombre = crearElem("input", {
    type: "text",
    name: "nombre",
    id: "nombre",
  });
  let inputApellidos = crearElem("input", {
    type: "text",
    name: "apellidos",
    id: "apellidos",
  });
  let inputTelf = crearElem("input", {
    type: "telf",
    name: "telf",
    id: "telf",
  });
  let inputFechaNac = crearElem("input", {
    type: "date",
    name: "fecha_nac",
    id: "fecha_nac",
  });
  let inputDirc = crearElem("input", {
    type: "text",
    name: "direccion",
    id: "direccion",
  });
  //Array con todos los input
  let inputPersonales = [
    inputNombre,
    inputApellidos,
    inputTelf,
    inputFechaNac,
    inputDirc,
  ];

  //Añadimos todo al divAcordeon alternando entre label e input (Como ambos tienen la misma longitud usamos la longitud de los label como referencia)
  for (let i = 0; i < labelPersonales.length; i++) {
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
  contenedor.style.display == "none"
    ? $(contenedor).slideDown(500)
    : $(contenedor).slideUp(500);
}

/**
 * Pone como editable o lo quita de editable el formulario del perfil de ususario
 *
 */
function editarPerfil() {
  //Botón editar perfil
  let botonEditar = document.getElementById("editarCuenta");
  //Compruebo si está ya editando o no
  if (botonEditar.textContent == "Editar perfil") {
    //Buscamos todos los input con readonly y le quito este atributo
    let inputsFormulario = document.querySelectorAll(
      "input[readonly]:not(input[id='suscripcion'], input[id='rol'], input[id='email'])"
    );
    inputsFormulario.forEach((input) => input.removeAttribute("readonly"));
    //Le quitamos también el disabled al select
    let select = document.querySelector("select[disabled='disabled']");
    select != null ? select.removeAttribute("disabled") : "";
    //Pone como visible el input para guardar los cambios
    document.querySelector("input[type='submit']").style.display = "block";
    //Cambiamos el texto de Editar perfil a cancelar
    botonEditar.textContent = "Cancelar";
  } else {
    //Ponemos todos los input con la propiedad readonly
    let inputs = document.querySelectorAll("input");
    inputs.forEach((input) => input.setAttribute("readonly", "readonly"));
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
    if (!comprobarCamposOblig(camposOblig)) {
      throw "Debe rellenar todos los campos obligatorios";
    }
    //Elementos
    let email = document.getElementById("email").value;
    let pwd = document.getElementById("pwd").value;
    //Comprobamos que el email sea válido
    if (!validarEmail(email)) {
      throw "El email no es válido";
    }
    //Enviamos la petición al servidor
    const respuestaJSON = await fetch("../php/login.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ email: email, pwd: pwd }),
    });
    //Cogemos el mensaje y esperamos a que este listo
    const resultadoPeticion = await respuestaJSON.json();
    //Comprobamos que no saltara un error
    if (Object.hasOwn(resultadoPeticion, "error")) {
      throw resultadoPeticion["error"];
    }
    //Guardamos tambien en localStorage el email
    localStorage.setItem("email", email);
    if (resultadoPeticion["exito"] == 1) {
      location.assign("../html/panelAdministrador.html");
    } else {
      location.assign("../html/index.html");
    }
  } catch ($error) {
    //Asignamos al p el mensaje
    resultado.textContent = "Error: " + $error;
    resultado.classList = "error";
  }
}

/**
 * Inicia sesión de forma automática si ya lo hicimso antes y no nos desconectamos
 *
 * @return  {void}  No devuelve nada
 */
async function loginAutomatico() {
  //Comprobamos si tiene en localStorage guardado la cuenta y que no este ya iniciado sesión
  if (
    sessionStorage["email"] == undefined &&
    localStorage["email"] !== undefined
  ) {
    try {
      email = localStorage["email"];
      const respuestaJSON = await fetch("../php/login.php", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ iniciarSesion: email }),
      });
      //Cogemos el mensaje y esperamos a que este listo
      const resultadoPeticion = await respuestaJSON.json();
      //Comprobamos que no saltara un error
      if (Object.hasOwn(resultadoPeticion, "error")) {
        throw resultadoPeticion["error"];
      }
      //Guardamos en sesión el usuario y su rol (Su rol lo guardamos de la petición porque pudo cambiar)
      sessionStorage.setItem("email", localStorage["email"]);
      sessionStorage.setItem("rol", resultadoPeticion["exito"]);
      if (resultadoPeticion["exito"] == 1) {
        location.assign("../html/panelAdministrador.html");
      } else {
        //recargamos la página
        location.reload();
      }
    } catch ($error) {
      //Asignamos al p el mensaje
      console.log("Error: " + $error);
    }
  }
}

/**
 * Procesa el formulario de registro
 *
 * @param   {Event}  evento  Evento que dispara esta función
 *
 */
async function procesarRegistro(evento) {
  //Prevenimos al botón de realizar su tarea normalmente (Enviar la petición al servidor)
  evento.preventDefault();
  //Párrafo donde mostraremos el mensaje
  let resultado = document.getElementById("resultadoForm");
  try {
    //Comprobamos que todos los campos obligatorios estean cubiertos
    let camposOblig = [
      "email",
      "pwd",
      "pwd2",
      "imagenPerfil",
      "nombre",
      "apellidos",
      "fecha_nac",
    ];
    if (!comprobarCamposOblig(camposOblig)) {
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
    if (!validarEmail(email)) {
      throw "El email no es válido";
    }
    //Comprobamos que las contraseñas coincidan
    if (!validarClaves(clave, clave2)) {
      throw "Las contraseñas no coinciden";
    }
    //Comprobamos que la fecha de nacimiento sea válida
    if (!validarFecha(fecha_nac)) {
      throw "La fecha de nacimiento no es válida";
    }
    //Creamos el objeto con los datos
    let datosUsuario = {
      email: email,
      pwd: clave,
      pwd2: clave2,
      nombre: nombre,
      apellidos: apellidos,
      telefono: telefono,
      fecha_nac: fecha_nac,
      direccion: direccion,
      genero_favorito: genero_favorito,
    };
    const mensajeJSON = new FormData();
    mensajeJSON.append("imagenPerfil", imagenPerfil);
    mensajeJSON.append("datosUsuario", JSON.stringify(datosUsuario));
    //Enviamos los datos a php
    const resultadoJSON = await fetch("../php/registro.php", {
      method: "POST",
      body: mensajeJSON,
    });
    const mensaje = await resultadoJSON.json();
    //Cambiamos el mensaje y le añadimos la claseque trae de respuesta del php (Si dio un error el atributo será error y el mensaje de error sino éxito y su mensaje)
    if (Object.hasOwn(mensaje, "error")) {
      throw mensaje["error"];
    }
    resultado.textContent = mensaje["exito"];
    resultado.classList = "exito";
    limpiarCampo(resultado, 2000);
    await limpiarTodosCamposForm(true);
    //Guardamos el email en localStorage e iniciamos sesión
    localStorage.setItem("email", email);
    loginAutomatico();
  } catch ($error) {
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
function marcarCamposOblig(camposOblig) {
  //Pone antes de cada campo un * para marcar que es un campo Obligatorio
  //Recorremos cada uno de los id de los input
  camposOblig.forEach((campo) => {
    //Cogemos el label que tiene el for para ese id y le añadimos la clase campoOblig
    document
      .querySelector(`label[for='${campo}']`)
      .setAttribute("class", "campoOblig");
  });
}

/**
 * Comprueba que todos los campos obligatorios tengan valor
 *
 * @param   {array}  camposOblig  Todos los ide de los campos obligatorios
 *
 * @return  {boolean}               True si todos los campos están cubiertos, False si no
 */
function comprobarCamposOblig(camposOblig) {
  return (
    camposOblig.find((campo) => document.getElementById(campo).value == "") ==
    undefined
  );
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
function validarClaves(clave1, clave2) {
  return clave1 === clave2;
}

/**
 * Comprueba que una fecha sea válida
 *
 * @param   {string}  fecha  Fecha
 *
 * @return  {boolean}         True si es valida, False si no
 */
function validarFecha(fecha) {
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
  setTimeout((archivo) => {
    //Comprobamos si hay algún input de tipo archivo
    if (archivo) {
      //Todos os input menos el de archivo y el de submit
      let inputsFormulario = document.querySelectorAll(
        "input:not(input[type='file'], input[type='submit'])"
      );
      inputsFormulario.forEach((campo) => (campo.value = ""));
      //Limpiamos el select también, ponemos el value "" como seleccionado
      document.querySelector("option[selected]").removeAttribute("selected");
      //Limpiamos el archivo
      document.querySelector("input[type='file']").files = null;
    } else {
      //Todos os input menos el de submit
      let inputsFormulario = document.querySelectorAll(
        "input:not(input[type='submit'])"
      );
      inputsFormulario.forEach((campo) => (campo.value = ""));
    }
  }, 2000);
}

/**
 * Crea cada una de las opciones de los géneros
 *
 * @param   {DOMElement}  selectAnhadir  Select donde irán las opciones
 *
 */
async function crearOptionGeneros(selectAnhadir) {
  try {
    //Nos conectamos con el servidor para pedirle los géneros, como no envíamos datos y no devuelve datos comprometidos sólo especificamos el método
    const respuestaGeneros = await fetch("../php/registro.php", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ cargarGeneros: true }),
    });
    //Es importante poner la espera en la respuesta porque sino lo lee como undefined
    const generos = await respuestaGeneros.json();
    if (Object.hasOwn(generos, "generos")) {
      //Formamos un option con cada género
      generos["generos"].forEach((genero) => {
        let opcion = document.createElement("option");
        opcion.setAttribute("value", genero);
        opcion.textContent = genero;
        selectAnhadir.append(opcion);
      });
    }
  } catch (error) {
    console.log(error);
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
  contenedorOpciones.style.display == "none"
    ? $(contenedorOpciones).slideDown(500)
    : $(contenedorOpciones).slideUp(500);
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
  if (Object.hasOwn(respuestaJSON, "exito")) {
    //Borra el sesion storage, localstorage y recarga la página
    localStorage.clear();
    sessionStorage.clear();
    location.assign("../html/index.html");
  }
}
/**
 * Le manda a perfil_usuario.php un json con el que pedirá los datos gracias al email
 * del usuario, recibirá un json con toda la información de vuelta y modificará el dom del perfil del usuario
 *
 * @return  {void}  No devuelve nada
 */
async function cargarDatosPerfil() {
  //Cargamos los options del genero favorito
  crearOptionGeneros(document.querySelector("select"));
  try {
    let email = sessionStorage.getItem("email");
    // email está almacenado en sessionStorage
    const respuesta = await fetch("../php/perfil_usuario.php", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        email: email,
      }),
    }); // Esto va a devolver un promise

    const respuesta_json = await respuesta.json(); // Coge la respuesta y la convierte a objeto de js
    //Comprobamos que no diera error
    if (Object.hasOwn(respuesta_json, "error")) {
      throw respuesta_json["error"];
    } else if (Object.hasOwn(respuesta_json, "noUser")) {
      location.replace("../html/index.html");
    }
    /** Con este objeto en js vamos a modificar el DOM
     * Añadiendo cuando sea necesario los atributos necesarios
     * para su correcta selección
     **/
    document.getElementById("email").value = email;
    // Recuperamos el nombre
    document.getElementById("nombre").value = respuesta_json["nombre"];

    // Ahora tenemos que seleccionar (con el atributo selected) la option que nos pasa el objeto
    //Comprobamos que no estea vacío
    if (respuesta_json["genero_favorito"] != undefined) {
      let optionSeleccionado = document.querySelector(
        `option[value="${respuesta_json["genero_favorito"]}"]`
      );
      optionSeleccionado.setAttribute("selected", "selected");
      optionSeleccionado.parentElement.setAttribute("disabled", "disabled");
    }
    // Recuperamos los apellidos
    document.getElementById("apellidos").value = respuesta_json["apellidos"];

    // Recuperamos el telefono
    document.getElementById("telefono").value = respuesta_json["telefono"];

    // Recuperamos la direccion
    document.getElementById("direccion").value = respuesta_json["direccion"];

    //Formateamos la ultima modificacion y el ultimo inicio
    let ultMod = new Fecha(
      respuesta_json["fecha_ult_modif"]
    ).fechaDesdeHoyAnhos();
    let ultIni = new Fecha(
      respuesta_json["fecha_ult_acceso"]
    ).fechaDesdeHoyAnhos();
    // Modificamos el campo ult_modif y recuperamos la fecha_ult_modif del json enviado por php
    document.getElementById("ultModif").innerHTML = ultMod;
    document.getElementById("ultInicio").innerHTML = ultIni;

    //Ponemos la imagen de perfil
    document.getElementById("fotoPerfil").src = respuesta_json["imagen_perfil"];

    // Modificamos el campo rol y recuperamos el valor rol del json enviado por php
    if (respuesta_json["rol"] == 1) {
      document.getElementById("rol").value = "Administrador";
    } else if (respuesta_json["rol"] == 2) {
      document.getElementById("rol").value = "Usuario";
    }

    // suscripcion y renovar pueden devolver null, así que: [cuando valor = null en php pasa a json y lo decodeamos OBTENEMOS ]
    if (respuesta_json["suscripcion"] != undefined) {
      document.getElementById("suscripcion").value =
        respuesta_json["suscripcion"] +
        (respuesta_json["suscripcion"] == 1 ? " mes" : " meses");
    } else {
      document.getElementById("suscripcion").value = "Sin suscripción";
    }

    if (respuesta_json["renovar"] == 1) {
      let fechaRenovar = new Fecha(
        respuesta_json["fecha_renovacion"]
      ).getFecha();
      document.getElementById("renovacion").innerHTML += fechaRenovar;
    }
  } catch (error) {
    console.log(error);
  }
  // Modificamos el campo email recuperando del localStorage su valor
  document.getElementById("email").value = sessionStorage.getItem("email");
}

/**
 * Guarda los datos en el perfil
 *
 * @return  {void}  No devuelve nada
 */
async function guardarCambiosPerfil(e) {
  e.preventDefault();
  try {
    //Cogemos el género favorito
    let datosPerfilUsuario = {
      genero_favorito: document.querySelector("select").value,
    };
    //Cogemos todos los datos de los input
    datosPerfilUsuario["nombre"] = document.getElementById("nombre").value;
    datosPerfilUsuario["apellidos"] =
      document.getElementById("apellidos").value;
    datosPerfilUsuario["telefono"] = document.getElementById("telefono").value;
    datosPerfilUsuario["direccion"] =
      document.getElementById("direccion").value;
    //Iniciamos la petición
    const respuesta = await fetch("../php/perfil_usuario.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset= utf-8;" },
      body: JSON.stringify({ guardaCambios: datosPerfilUsuario }),
    });
    //Traducimos
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    } else if (Object.hasOwn(respuestaJSON, "noUser")) {
      location.replace("../html/index.html");
    }
    alert("Datos guardados con éxito");
    setTimeout(function () {
      editarPerfil();
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Carga los tipos de suscripciones
 *
 * @return  {void}  No devuelve nada
 */
async function cargarTiposSuscripciones() {
  try {
    //Nos conectamos a php para pedir todas las duraciones de las suscripciones
    const respuesta = await fetch("../php/suscripciones.php", {
      method: "GET",
    });
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Creamos un button por cada uno de las suscripciones
    let suscripciones = Object.values(respuestaJSON);
    let contenedorSuscripciones = document.getElementById("tiposSusc");
    suscripciones.forEach((suscripcion) => {
      //Creamos el botón
      let boton = crearBoton("", {
        "data-id": suscripcion["duracion"],
        class: "susc",
      });
      //Creamos los p con la duración y mes
      let parrafo = document.createElement("p");
      parrafo.textContent = suscripcion["duracion"];
      let parrafoMes = document.createElement("p");
      parrafoMes.textContent = "Mes";
      //Añado ambos al botón
      boton.append(parrafo, parrafoMes);
      contenedorSuscripciones.append(boton);
      //Lo añado al cuerpo
      //<button type="button" data-id="1" class="susc suscActiva"><p>1</p><p>Mes</p></button>
      //Le añadimos los listeners
      boton.addEventListener("click", cargarSuscripciones, true);
    });
    //Disparamos el evento como si pulsaramos el primer botón para que coja sus características
    document
      .getElementById("tiposSusc")
      .firstElementChild.dispatchEvent(new Event("click"));
    //Le añadimos el escuchador al botón de suscribirse
    document
      .getElementById("recibo")
      .querySelector("button")
      .addEventListener("click", suscribirse);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Manda una petición a php para que cargue la información en la tabla con la suscripción seleccionada (Botón activo)
 *
 * @param   {Event}  e  Evento que se disparó
 *
 */
async function cargarSuscripciones(e) {
  //Botón que lleva el escuchador, usamos currentTarget porque es el elemento que tiene el event listener pegado, pero el que dispara es el hijo (los p) por eso no usamos target
  let botonEvento = e.currentTarget;
  //ID de botón que activó el evento,
  let duracionSus = botonEvento.dataset.id;
  try {
    //Realizamos la petición
    const respuesta = await fetch("../php/suscripciones.php", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=utf-8" },
      body: JSON.stringify({ duracion: duracionSus }),
    });
    //Convertimos la respuesta a js
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error, si dió error lo mostramos por pantalla
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Ponemos los datos en la tabla
    //Le cambiamos la cabecera con el número correcto
    let cabeceraSuscripcion = document.querySelector("th");
    let meses = respuestaJSON["duracion"] == 1 ? "mes" : "meses";
    //Cabecera con X mes
    cabeceraSuscripcion.textContent = respuestaJSON["duracion"] + " " + meses;
    let filasCuerpo = Array.from(document.querySelectorAll("tbody > tr"));
    //Precio
    filasCuerpo[0].lastElementChild.textContent =
      respuestaJSON["precio"] + " €";
    //Ahorras
    filasCuerpo[1].lastElementChild.textContent = respuestaJSON["ahorro"] + "%";
    //Total
    filasCuerpo[2].lastElementChild.textContent =
      respuestaJSON["precio"] * respuestaJSON["duracion"] + " €";
    //Comprobamos si este botón tiene ya la clase activa, usamos el métiodo contains porque es de tipo DOMTokenList
    if (!botonEvento.classList.contains("suscActiva")) {
      //Buscamos al botón que lo tenga
      let botonActivo = document.querySelector(
        "button[class='susc suscActiva']"
      );
      if (botonActivo != null && botonActivo != undefined) {
        botonActivo.classList.remove("suscActiva");
      }
      //Se lo ponemos al botón actual
      botonEvento.classList.add("suscActiva");
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Se suscribe a una suscripción si no tiene una suscripción activa y está registrado
 *
 * @return  {void}  No devuelve nada
 */
async function suscribirse() {
  //Comprobamos que estemos suscritos viendo la cookie de sesion
  if (sessionStorage["email"] == undefined) {
    aparecerLogin();
  } else {
    try {
      //Cogemos la suscripción activa su id para saber el tipo de suscripción a la que nos estamos suscribiendo
      let suscripcionActiva = document.querySelector(".suscActiva").dataset.id;
      //Iniciamos la petición
      const respuesta = await fetch("../php/suscripciones.php", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ suscribirse: suscripcionActiva }),
      });
      //Traducimos la respuesta
      const respuestaJSON = await respuesta.json();
      //Comprobamos que no diera un error
      if (Object.hasOwn(respuestaJSON, "error")) {
        throw respuestaJSON["error"];
      } else if (Object.hasOwn(respuestaJSON, "noSuscrita")) {
        aparecerLogin();
      } else {
        alert("Suscripción realizada con éxito");
      }
    } catch (error) {
      alert(error);
    }
  }
}

/**
 * Cancela la renovación de la suscripción
 *
 * @return  {void}  No devuelve nada
 */
async function cancelarRenovacionSusc() {
  //Comprobamos que tenga una suscripción
  if (document.getElementById) {
    try {
      //Iniciamos la petición
      const respuesta = await fetch("../php/suscripciones.php", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ cancelarSuscripcion: true }),
      });
      //Traducimos la respuesta
      const respuestaJSON = await respuesta.json();
      //Comprobamos que no diera un error
      if (Object.hasOwn(respuestaJSON, "error")) {
        throw respuestaJSON["error"];
      } else {
        alert(respuestaJSON["exito"]);
        cargarDatosPerfil();
      }
    } catch (error) {
      alert(error);
    }
  }
}

/**
 * Lleva a la página de suscripciones
 *
 */
function irSuscripciones(e) {
  e.preventDefault();
  location.assign("../html/suscripciones.html");
}

/**
 * Lleva a la página de perfil de usuario
 *
 */
function irPerfilUsuario(e) {
  e.preventDefault();
  location.assign("../html/perfilUsuario.html");
}

/**
 * Lleva a la página de panel de control
 */
function irPanelControlAdmin(e) {
  e.preventDefault();
  location.assign("../html/panelAdministrador.html");
}

/**
 * Lleva a la página de partidas
 *
 */
function irPartidas(e) {
  e.preventDefault();
  //Comprobamos el rol del usuario (Si no tiene rol es que no esta registrado y no puede acceder a partidas)
  if (sessionStorage["rol"] != null) {
    location.assign("../html/partidas.html");
  } else {
    //Disparamos el evento para que aparezca el login
    aparecerLogin();
  }
}

/**
 * Lleva a la página principal
 *
 */
function irPrincipal(e) {
  e.preventDefault();
  //Comprobamos el rol del usuario (Si no tiene rol es que no esta registrado y no puede acceder a partidas)
  if (sessionStorage["rol"] != null) {
    location.assign("../html/index.html");
  } else {
    //Disparamos el evento para que aparezca el login
    aparecerLogin();
  }
}

/**
 * Carga las partidas según el filtro que se le pase
 *
 * @param   {Object}  filtro  Filtro de tipo {clave: valor}
 *
 */
async function cargarPartidas(filtro = {}, pagina = 0, limite = 7) {
  //Limpiamos el contenedor de las partidas
  let lista = document.querySelector("ul[class='list-group']");
  let paginacion = document.querySelector(".pagination");
  //Buscamos si ya hay una paginación y si la hay la borramos
  if (paginacion != null) {
    paginacion.remove();
  }
  lista.innerHTML = "";
  //LE añado al filtro la página y el limite
  filtro["pagina"] = pagina;
  filtro["limite"] = limite;
  try {
    //Hacemos la petición
    const respuesta = await fetch("../php/partidas.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(filtro),
    });
    //Convertimos la respues ta json
    const respuestaJSON = await respuesta.json();
    //Compruebo si dió error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Limpiamos la lista
    lista.innerHTML = "";
    //Cargo cada uno de los li
    pagina = filtro["pagina"] != 0 ? filtro["pagina"] / 7 : 0;
    paginacion = crearPaginacion(respuestaJSON["numPag"], pagina);
    if (paginacion != "") {
      document
        .querySelector("#result_panel")
        .insertAdjacentElement("afterend", paginacion);
    }
    //Le añadimos los escuchadores
    let elementosLi = document.querySelectorAll(".pagination li");
    if (elementosLi != null) {
      elementosLi.forEach((elemento) =>
        elemento.firstElementChild.addEventListener("click", filtrarPartidas)
      );
    }
    //Cargo los datos de las partidas
    respuestaJSON["tuplas"].forEach((dato) => {
      lista.append(crearContenedorPartida(dato));
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Crea un contenedor para una partida con los datos que le pasamos
 *
 * @param   {Object}  datosPartida  Tipo {"clave": valor}
 *
 * @return  {DOMElement}                Elemento li con los datos de la partida
 */
function crearContenedorPartida(datosPartida) {
  //Creamos un elemento de la lista
  let elemLista = crearContenedor("li", { class: "list-group-item" });
  //Creamos el contenedor de la imagne
  let contenedorImagen = crearContenedor("div", { class: "imagen" });
  //Creamos la imagen
  let imagen = crearImg({ src: datosPartida["imagen_partida"] });
  contenedorImagen.append(imagen);
  //Creamos el contenedor de la información
  let contenedorInfo = crearContenedor("div", { class: "info" });
  //Creamos un span por cada característica
  //Juego
  let juegoPartida = crearContenedor(
    "span",
    {},
    "Juego: " + datosPartida["nombre"]
  );
  //Género
  let generoPartida = crearContenedor(
    "span",
    {},
    "Genero: " + datosPartida["genero"]
  );
  //Le damos formato al día y la hora
  let fecha = new Fecha(datosPartida["fecha"]).getFecha();
  let hora_inicio = datosPartida["hora_inicio"].substring(
    0,
    datosPartida["hora_inicio"].length - 3
  );
  //Día
  let diaPartida = crearContenedor("span", {}, "Fecha: " + fecha);
  //Hora
  let horaPartida = crearContenedor(
    "span",
    {},
    "Hora de inicio: " + hora_inicio
  );
  //Creamos los botones y le añadimos a cada uno un data-id con el id de la partida
  let botonInfo = crearBoton("Información", {
    type: "button",
    class: "btn btn-lg btn-info",
    "data-id": datosPartida["id_partida"],
  });
  let botonReservar = crearBoton("¡Reservar!", {
    type: "button",
    class: "btn btn-lg btn-success",
    "data-id": datosPartida["id_partida"],
  });
  //Añadimos los escuchadores
  botonInfo.addEventListener("click", conseguirInfoPartida);
  botonReservar.addEventListener("click", reservarPartida);
  //Añadimos todo al contenedor de información
  contenedorInfo.append(
    juegoPartida,
    generoPartida,
    diaPartida,
    horaPartida,
    botonInfo,
    botonReservar
  );
  //Añadimos al elemento de la lista
  elemLista.append(contenedorImagen, contenedorInfo);
  return elemLista;
}

/**
 * Carga las partidas con los filtros que le pusimos
 *
 * @param {Event} Evento que lo dispara
 *
 */
function filtrarPartidas(e) {
  e.preventDefault();
  let limite = 7;
  let pagina =
    e.currentTarget.dataset.partida != null
      ? (e.currentTarget.dataset.partida - 1) * limite
      : 0;
  //Cojo los valores de los input
  let genero = document.querySelector("select").value;
  filtros = {};
  if (genero != "") {
    filtros["genero"] = genero;
    //Quitamos el valor vacío
  }
  let fechaIni = document.getElementById("fechaIni").value;
  if (fechaIni != "") {
    filtros["fechaIni"] = fechaIni;
  }
  let fechaFin = document.getElementById("fechaFin").value;
  if (fechaFin != "") {
    filtros["fechaFin"] = fechaFin;
  }
  cargarPartidas(filtros, pagina, limite);
}

/**
 * Crea los Li con cada uno de los números
 *
 * @param   {int}  numero  Número de páginas
 *
 */
function crearPaginacion(numero, pagina) {
  //Comprobamos si existe ya un contenedor de paginación
  let contenedorPaginacion = document.querySelector(".pagination");
  //Comprobamos si no existe
  if (contenedorPaginacion == null) {
    contenedorPaginacion = crearContenedor("div", { class: "pagination" });
  }
  //Si existe lo limpiamos
  else {
    contenedorPaginacion.innerHTML = "";
  }
  //Comprobamos que sea mayor a 1
  if (numero > 0) {
    //Creamos el ul
    let lista = document.createElement("ul");
    for (let i = 1; i <= numero + 1; i++) {
      let contenedorLi = document.createElement("li");
      let enlace = crearElem("a", { href: "#", "data-partida": i }, i);
      contenedorLi.append(enlace);
      //Lo añadimos al ul
      lista.append(contenedorLi);
    }
    //Añadimos la lista a la paginación
    contenedorPaginacion.append(lista);
    //Ponemos la página en la que estamos como activo
    lista.childNodes[pagina].firstElementChild.classList.add("active");
    //Devolvemos el contenedor
    return contenedorPaginacion;
  }
  return "";
}

/**
 * Crea un contenedor del tipo que le pasamos con los atributos y texto que le pasamos
 *
 * @param   {string}  tipoContenedor  Tipo del contenedor (span, div, li, etc..)
 * @param   {Object}  atributos       Atributos del contenedor de tipo {clave: valor} (puede no tener)
 * @param   {string} texto              Texto que contendrá el contenedor (puede estar vacio)
 *
 * @return  {DOMElement}                  Contenedor
 */
function crearContenedor(tipoContenedor, atributos = {}, texto = "") {
  let contenedor = document.createElement(tipoContenedor);
  //Le asignamos los atributos
  Object.entries(atributos).forEach((atributo) =>
    contenedor.setAttribute(atributo[0], atributo[1])
  );
  contenedor.textContent = texto;
  return contenedor;
}

/**
 * Muestra y oculta las diferentes opciones de creación
 *
 * @param   {Event}  e  Evento que lo dispara
 *
 */
function ocultarMostrarOpcionesCreacion(e) {
  e.preventDefault();
  let filtros = document.getElementById("opcionesPanelAdmin");
  console.log(filtros.style.css);
  filtros.style.display == "none"
    ? $(filtros).slideDown(500)
    : $(filtros).slideUp(500);
}

/**
 * Crea una partida en la BD
 * @param {Event}  Evento que dispara
 */
async function crearPartida(e) {
  //Prevenimos que envíe el formulario
  e.preventDefault();
  let resultado = document.getElementById("resultadoOperacion");
  try {
    let camposOblig = [
      "fecha",
      "hora_inicio",
      "duracion",
      "plazas_min",
      "plazas_totales",
      "nombre_juego",
    ];
    //Comprobamos que cubriera todo
    if (!comprobarCamposOblig(camposOblig)) {
      throw "Debe cubrir todos los campos";
    }
    //Comprobamos que la fecha sea válida
    let fecha = document.getElementById("fecha").value;
    if (!validarFecha(fecha)) {
      throw "Debe introducir una fecha válida";
    }
    //Datos
    let juego = document.getElementById("nombre_juego").dataset.id;
    let hora_inicio = document.getElementById("hora_inicio").value;
    let duracion = document.getElementById("duracion").value;
    let plazas_min = document.getElementById("plazas_min").value;
    let plazas_totales = document.getElementById("plazas_totales").value;
    let imagenes = Array.from(document.getElementById("imagen_partida").files);
    let datosPartida = {
      juego_partida: juego,
      fecha: fecha,
      hora_inicio: hora_inicio,
      duracion: duracion,
      plazas_min: plazas_min,
      plazas_totales: plazas_totales,
    };
    //Mensaje que enviaremos
    const mensajeJSON = new FormData();
    //Recorremos las imagenes y las voy añadiendo en el array
    imagenes.forEach((imagen) =>
      mensajeJSON.append("imagenesPartida[]", imagen)
    );
    mensajeJSON.append("datosPartida", JSON.stringify(datosPartida));
    //Lanzamos la petición
    const respuesta = await fetch("../php/panelAdministrador.php", {
      method: "POST",
      body: mensajeJSON,
    });
    const respuestaJSON = await respuesta.json();
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    resultado.textContent = "Se ha creado la partida con éxito";
    resultado.removeAttribute("class", "error");
    resultado.setAttribute("class", "exito");
    //Limpiamos la ventana de éxito
    limpiarCampo(resultado, 2000);
    //Limpiamos el resto de campos del formulario
    let todosInput = Array.from(
      document.querySelectorAll(
        "input:not(input[type='file'], input[type='submit'])"
      )
    );
    limpiarCampoArrayInput(todosInput, 2000);
    //Limpiamos el campo File
    limpiarCampoFile(document.getElementById("imagen_partida"), 2000);
    //Limpiamos el select
    limpiarCampoSelect(document.querySelector("select"), 2000);
  } catch ($error) {
    resultado.textContent = $error;
    resultado.removeAttribute("class", "exito");
    resultado.setAttribute("class", "error");
  }
}

/**
 * Restringe el acceso a los que no son usuarios
 *
 * @return  {boolean}  Devuelve
 */
function restringirAccesoNoRegistrados() {
  //Compruebo el rol que tiene
  $rol = sessionStorage.getItem("rol");
  //Si es undefined (no está registrado)
  if ($rol == undefined || $rol == null) {
    //Lo redirigimos a la página principal
    location.replace("../html/index.html");
  }
}

/**
 * No permite el acceso a ciertas páginas si no eres admin
 *
 */
function restringirAccesoNoAdmin() {
  //Compruebo el rol que tiene
  $rol = sessionStorage.getItem("rol");
  if ($rol != 1) {
    //Lo redirigimos a la página principal
    location.replace("../html/index.html");
  }
}

/**
 * Carga la página de filtrar partidas
 *
 * @param   {Object}  filtros  Filtros a aplicar tipo {clave: valor}
 * @param   {int}        Página en la nos encontramos
 *
 */
function cargarPartidasAdmin() {
  let contenedorAdmin = document.getElementById("panelAdmin");
  //Limpiamos el contenedor
  if (contenedorAdmin.firstElementChild.nextElementSibling != null) {
    contenedorAdmin.removeChild(
      contenedorAdmin.firstElementChild.nextElementSibling
    );
  }
  //Creamos unos botones para cambiar a modo reserva
  let contenedorBotones = crearContenedor("div", { id: "contenedorBotones" });
  let botonPartidas = crearBoton("Partidas", {
    type: "button",
    "data-nombre": "partidas",
  });
  let botonReservas = crearBoton("Reservas", {
    type: "button",
    "data-nombre": "reservas",
    class: "noActivo",
  });
  contenedorBotones.append(botonPartidas, botonReservas);
  //Añadimos los escuchadores
  botonPartidas.addEventListener("click", cargarPartidasAdmin);
  botonReservas.addEventListener("click", cargarReservasAdmin);

  //Creamos el contenedor que almacenará todo
  let contenedor = crearContenedor("div", { id: "contenedorElementos" });
  //Formulario de filtrado
  let formFiltrado = crearContenedor("form", {
    id: "filtradoPartida",
    action: "../php/panelAdministrador.php",
    method: "POST",
  });
  //Le añadimos el escuchador al formulario
  formFiltrado.addEventListener("submit", activarFiltro);
  //Creamos cada uno de los label e inputs de filtrado
  let labelJuego = crearElem("label", { for: "juego_partida" }, "Juego");
  let inputJuego = crearElem("input", {
    type: "text",
    name: "juego_partida",
    id: "juego_partida",
  });
  labelJuego.append(inputJuego);
  let labelFecha = crearElem("label", { for: "fecha" }, "Fecha inicio");
  let inputFecha = crearElem("input", {
    type: "date",
    name: "fecha",
    id: "fecha",
  });
  let labelFechaFin = crearElem("label", { for: "fechaFin" }, "Fecha fin");
  let inputFechaFin = crearElem("input", {
    type: "date",
    name: "fechaFin",
    id: "fechaFin",
  });
  labelFecha.append(inputFecha);
  labelFechaFin.append(inputFechaFin);
  let inputSubmit = crearElem("input", { type: "submit", value: "Filtrar" });
  //Añadimos todos al form
  formFiltrado.append(labelJuego, labelFecha, labelFechaFin, inputSubmit);

  //Creamos la tabla
  let tabla = crearContenedor("table", { id: "listaElementos" });
  //Creamos el thead
  let encabezadoTabla = document.createElement("thead");
  //Creamos la fila del encabezado menos la última fila del botón
  let filaEncabezado = crearFilaTabla("th", [
    "ID",
    "Juego",
    "Fecha",
    "Nº jugadores",
    "Director partida",
  ]);
  //Creo el th del botón
  let encabezadoBoton = crearContenedor("th", { colspan: "2" });
  //Creo el botón
  let botonEncabezado = crearBoton("Nueva partida +");
  //Añadimos el escuchador
  botonEncabezado.addEventListener("click", modoCrearPartidasAdmin);
  //Añadimos todo al encabezado y después a la tabla
  encabezadoBoton.append(botonEncabezado);
  filaEncabezado.append(encabezadoBoton);
  encabezadoTabla.append(filaEncabezado);
  tabla.append(encabezadoTabla);
  //Cuerpo de la tabla
  let cuerpoTabla = document.createElement("tbody");
  tabla.append(cuerpoTabla);
  //Añadimos todo al contenedor
  contenedor.append(contenedorBotones, formFiltrado, tabla);
  //Añadimos todo al cuerpo
  contenedorAdmin.append(contenedor);
  //Ponemos partidas como marcado
  let lista = document.getElementById("opcionesPanelAdmin");
  let elementosActivo = Array.from(
    lista.querySelectorAll("a[class='listaActivo']")
  );
  //Creamos la paginacion
  elementosActivo.forEach((elemento) =>
    elemento.classList.remove("listaActivo")
  );
  document
    .getElementById("pestPartidas")
    .firstElementChild.classList.add("listaActivo");
  filtrarPartidasAdmin();
}

/**
 * Carga la página con las reservas
 */
function cargarReservasAdmin() {
  let contenedorPanelAdmin = document.getElementById("panelAdmin");
  //Limpiamos el contenedor
  if (contenedorPanelAdmin.firstElementChild.nextElementSibling != null) {
    console.log(contenedorPanelAdmin.firstElementChild.nextElementSibling);
    contenedorPanelAdmin.removeChild(
      contenedorPanelAdmin.firstElementChild.nextElementSibling
    );
  }
  //Creamos unos botones para cambiar a modo reserva
  let contenedorBotones = crearContenedor("div", { id: "contenedorBotones" });
  let botonPartidas = crearBoton("Partidas", {
    type: "button",
    "data-nombre": "partidas",
    class: "noActivo",
  });
  let botonReservas = crearBoton("Reservas", {
    type: "button",
    "data-nombre": "reservas",
  });
  contenedorBotones.append(botonPartidas, botonReservas);
  //Añadimos los escuchadores
  botonPartidas.addEventListener("click", cargarPartidasAdmin);
  botonReservas.addEventListener("click", cargarReservasAdmin);

  //Creamos el contenedor que almacenará todo
  let contenedor = crearContenedor("div", { id: "contenedorElementos" });
  //Formulario de filtrado
  let formFiltrado = crearContenedor("form", {
    id: "filtradoPartida",
    action: "../php/panelAdministrador.php",
    method: "POST",
  });
  //Le añadimos el escuchador al formulario
  formFiltrado.addEventListener("submit", activarFiltro);
  //Creamos cada uno de los label e inputs de filtrado
  let labelUsuario = crearElem("label", { for: "usuario" }, "Usuario");
  let inputUsuario = crearElem("input", {
    type: "text",
    name: "usuario",
    id: "usuario",
  });
  labelUsuario.append(inputUsuario);
  let labelFechaIni = crearElem("label", { for: "fechaIni" }, "Fecha inicio");
  let inputFechaIni = crearElem("input", {
    type: "date",
    name: "fechaIni",
    id: "fechaIni",
  });
  labelFechaIni.append(inputFechaIni);
  let labelFechaFin = crearElem("label", { for: "fechaFin" }, "Fecha fin");
  let inputFechaFin = crearElem("input", {
    type: "date",
    name: "fechaFin",
    id: "fechaFin",
  });
  labelFechaFin.append(inputFechaFin);
  let inputFiltrar = crearElem("input", { type: "submit", value: "Filtrar" });
  formFiltrado.append(labelUsuario, labelFechaIni, labelFechaFin, inputFiltrar);

  //Creamos la tabla
  let tabla = crearContenedor("table", { id: "listaElementos" });
  //Creamos el thead
  let encabezadoTabla = document.createElement("thead");
  //Creamos la fila del encabezado menos la última fila del botón
  let filaEncabezado = crearFilaTabla("th", [
    "Usuario",
    "Fecha",
    "Juego",
    "Director partida",
  ]);
  //Creo el th para que ocupe como los botones de aceptar y rechazar
  let encabezadoBoton = crearContenedor("th", { colspan: "2" });
  filaEncabezado.append(encabezadoBoton);
  encabezadoTabla.append(filaEncabezado);
  let cuerpoTabla = document.createElement("tbody");
  tabla.append(encabezadoTabla, cuerpoTabla);

  //Añadimos todo al contenedor
  contenedor.append(contenedorBotones, formFiltrado, tabla);
  panelAdmin.append(contenedor);

  //Cargamos todas las reservas
  filtrarReservasAdmin();
}

/**
 * Crear el contenedor con las partidas para Admin (todas las partidas)
 *
 * @return  {void}  No devuelve nada
 */
function modoCrearPartidasAdmin() {
  let contenedorAdmin = document.getElementById("panelAdmin");
  //Limpiamos el contenedor
  if (contenedorAdmin.firstElementChild.nextElementSibling != null) {
    contenedorAdmin.removeChild(
      contenedorAdmin.firstElementChild.nextElementSibling
    );
  }
  //Creamos el formulario
  let formulario = crearElem("form", {
    id: "formPanelAdmin",
    action: "../php/panelAdministrador.php",
    method: "POST",
  });
  //Creamos cada uno de los label
  let labelJuego = crearElem("label", { for: "juego_partida" }, "Juego");
  //Contenedor para el input para poder mostrar un desplegable
  let contenedorInputNombre = crearContenedor("div", {
    class: "inputDesplegable",
  });
  let inputJuego = crearElem("input", {
    name: "nombre_juego",
    id: "nombre_juego",
    type: "text",
  });
  contenedorInputNombre.append(inputJuego);
  //Añadimos los escuchadores
  inputJuego.addEventListener("keyup", buscarJuegoNombreEscribir);
  inputJuego.addEventListener("focusout", eliminarDesplegable);
  let labelFecha = crearElem("label", { for: "fecha" }, "Fecha");
  let inputFecha = crearElem("input", {
    type: "date",
    name: "fecha",
    id: "fecha",
  });
  let horaInicio = crearElem("label", { for: "hora_inicio" }, "Hora de inicio");
  let inputHoraInicio = crearElem("input", {
    type: "time",
    name: "hora_inicio",
    id: "hora_inicio",
  });
  let labelDuracion = crearElem("label", { for: "duracion" }, "Duración");
  let inputDuracion = crearElem("input", {
    type: "number",
    name: "duracion",
    id: "duracion",
  });
  let labelPlazasMin = crearElem(
    "label",
    { for: "plazas_min" },
    "Plazas mínimas"
  );
  let inputPlazasMin = crearElem("input", {
    type: "number",
    name: "plazas_min",
    id: "plazas_min",
  });
  let labelPlazasTotales = crearElem(
    "label",
    { for: "plazas_totales" },
    "Plazas totales"
  );
  let inputPlazasTotales = crearElem("input", {
    type: "number",
    name: "plazas_totales",
    id: "plazas_totales",
  });
  let labelImagenPartida = crearElem(
    "label",
    { for: "imagen_partida" },
    "Imagen partida"
  );
  let inputImagenPartida = crearElem("input", {
    type: "file",
    name: "imagenes_partida[]",
    id: "imagen_partida",
    multiple: "multiple",
  });
  let resultado = crearElem("p", { id: "resultadoOperacion" });
  let botonSubmit = crearElem("input", {
    type: "submit",
    value: "Crear partida",
  });
  //Añadimos el escuchador
  formulario.addEventListener("submit", crearPartida);
  let botonCancelar = crearBoton("Cancelar", { type: "button" });
  //Añadimos ele scuchado al botón
  botonCancelar.addEventListener("click", cargarPartidasAdmin);
  //Añadimos todo al formulario
  formulario.append(
    labelJuego,
    contenedorInputNombre,
    labelFecha,
    inputFecha,
    horaInicio,
    inputHoraInicio,
    labelDuracion,
    inputDuracion,
    labelPlazasMin,
    inputPlazasMin,
    labelPlazasTotales,
    inputPlazasTotales,
    labelImagenPartida,
    inputImagenPartida,
    resultado,
    botonSubmit,
    botonCancelar
  );
  contenedorAdmin.append(formulario);
}

/**
 * Filtra los usuarios por nombre o rol
 *
 * @param   {[type]}  e  [e description]
 *
 * @return  {[type]}     [return description]
 */
async function recogerDatos(e) {
  e.preventDefault();
  //Seleccionamos el td con el correo del usuario
  let emailUsuario =
    e.currentTarget.parentElement.parentElement.firstElementChild.textContent;
  //Ahora que sabemos el email podemos usarlo para seleccionar el id de igual valor, que será el select con la opción que queremos que tenga
  let rolUsuario = document.getElementById(emailUsuario).value;
  //Le mandamos la información para el cambio de usuario al php
  const respuestaJSON = await fetch("../php/cambiarRol.php", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ email: emailUsuario, rol: rolUsuario }), //mandamos a mayores el email del supuesto admin para comprobar en php
  });
  // Toca recibir la respuesta
  console.log(respuestaJSON); // prueba
  const respuestaJS = await respuestaJSON.json(); // Coge la respuesta y la convierte a objeto de js
  console.log("Prueba"); // prueba
  if (respuestaJS == true) {
    window.alert("Base de datos actualizada");
  } else {
    window.alert("No se ha podido actualizar la base de datos");
  }
}

/**
 * Llama a filtrar las partidas
 *
 * @param   {Event}  e  Evento que lo dispara
 *
 */
function activarFiltro(e) {
  e.preventDefault();
  pagina = e.target.nodeName == "LI" ? e.target.textContent : 0;
  //Cogemos los filtros
  let juego = document.getElementById("juego_partida").value;
  let fecha = document.getElementById("fecha").value;
  let fechaFin = document.getElementById("fechaFin").value;
  filtrarPartidasAdmin(
    { juego_partida: juego, fecha: fecha, fechaFin: fechaFin },
    pagina
  );
}

/**
 * Filtra las partidas según los filtros que le pasemos
 *
 * @param   {Object}  filtros  Filtros a aplicar tipo {clave: valor}
 * @param   {int}        Página en la nos encontramos
 *
 */
async function filtrarPartidasAdmin(filtros = {}, pagina = 0) {
  let contenedor = document.getElementById("contenedorElementos");
  let cuerpoTabla = document.querySelector("tbody");
  //Limpiamos el cuerpo de la tabla
  cuerpoTabla.innerHTML = "";
  //Le añadimos la página y el limite de tuplas por pagina
  filtros["pagina"] = pagina;
  filtros["limite"] = 7;
  try {
    //Crea la petición
    const respuesta = await fetch("../php/panelAdministrador.php", {
      method: "POST",
      header: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ filtrosPartida: filtros }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Creamos cada fila de la tabla
    respuestaJSON["partidas"].forEach((datosPartidas) => {
      //La fecha la formateamos a formato Español
      datosPartidas["fecha"] = new Fecha(datosPartidas["fecha"]).getFecha();
      let fila = crearFilaTabla("td", Object.values(datosPartidas));
      //Creamos los dos botones para editar y eliminar
      let celdaEditar = document.createElement("td");
      let editar = crearBoton("Editar");
      //Le añadimos el escuchador al boton
      editar.addEventListener("click", modoEditarPartida);
      celdaEditar.append(editar);
      let celdaEliminar = document.createElement("td");
      let eliminar = crearBoton("Eliminar");
      //Le añadimos el escuchador
      eliminar.addEventListener("click", eliminarPartidaTabla);
      celdaEliminar.append(eliminar);
      //Añadimos los botones a la fila
      fila.append(celdaEditar, celdaEliminar);
      //Añadimos todo al cuerpo de la tabla
      cuerpoTabla.append(fila);
    });
    //Creamos la paginación
    pagina = filtros["pagina"] != 0 ? filtros["pagina"] / 7 : 0;
    contenedor.append(crearPaginacion(respuestaJSON["numPag"], pagina));
    //Le añadimos el escuchador a cada uno de ellos
    let listaLi = Array.from(document.querySelectorAll(".pagination li"));
    if (listaLi != null) {
      listaLi.forEach((elementoLi) =>
        elementoLi.firstElementChild.addEventListener(
          "click",
          cogerFiltrosPartidasAdmin
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Filtra las partidas según los parámetros
 *
 * @param   {Object}  filtros  Filtros de tipo {clave: valor}
 * @param   {int}  pagina   Número de la página en la que estamos
 *
 * @return  {void}           No devuelve nada
 */
async function filtrarReservasAdmin(filtros = {}, pagina = 0) {
  let contenedor = document.getElementById("contenedorElementos");
  //Añadimos la página y el limite a los filtros
  filtros["pagina"] = pagina;
  filtros["limite"] = 7;
  try {
    //Creamos la petición
    const respuesta = await fetch("../php/panelAdministrador.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8;" },
      body: JSON.stringify({ filtarReservas: filtros }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no hubiese un error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Cargamos cada una de las filas
    let cuerpoTabla = document.querySelector("tbody");
    //Convertimos la fecha a una fecha española
    respuestaJSON["reservas"].forEach((partida) => {
      partida["fecha"] = new Fecha(partida["fecha"]).getFecha();
      //Cogemos el id y lo eliminamos
      let idPartida = partida["id_partida"];
      delete partida["id_partida"];
      //Creamos la fila
      let fila = crearFilaTabla("td", partida);
      //Le añadimos los dos botones para aceptar o eliminar reservas
      //Creamos el td del botón tambien
      let tdAceptar = document.createElement("td");
      let botonAceptar = crearBoton("Aceptar", {
        type: "button",
        "data-id": idPartida,
        "data-accion": "aceptar",
      });
      tdAceptar.append(botonAceptar);
      //Añadimos los escuchadores
      botonAceptar.addEventListener("click", procesarReserva);
      let tdRechazar = document.createElement("td");
      let botonRechazar = crearBoton("Rechazar", {
        type: "button",
        "data-id": idPartida,
        "data-accion": "rechazar",
      });
      tdRechazar.append(botonRechazar);
      //Añadimos los escuchadores
      botonRechazar.addEventListener("click", procesarReserva);
      fila.append(tdAceptar, tdRechazar);
      //La añadimos al cuerpo
      cuerpoTabla.append(fila);
    });
    //Creamos la paginación
    contenedor.append(
      crearPaginacion(respuestaJSON["numPag"], filtros["pagina"])
    );
    //Le añadimos el escuchador a cada uno de ellos
    let listaLi = document.querySelectorAll("li");
    listaLi.forEach((elementoLi) =>
      elementoLi.firstElementChild.addEventListener(
        "click",
        cogerFiltrosPartidasAdmin
      )
    );
  } catch (error) {
    console.log(error);
  }
}

/**
 * Función intermedia para que los enlaces cojan los filtros y se los pase a filtrar paritdas admin
 * @param {Event}   Evento disparado
 */
function cogerFiltrosPartidasAdmin(e) {
  //Cogemos los filtros
  let juego = document.getElementById("juego_partida");
  let datosFiltro = juego.value != "" ? { juego_partida: juego } : {};
  let fechaInicio = document.getElementById("fecha");
  fechaInicio.value != "" ? (datosFiltro["fecha"] = fechaInicio) : "";
  let fechaFin = document.getElementById("fechaFin");
  fechaFin.value != "" ? (datosFiltro["fechaFin"] = fechaFin) : "";
  //Cogemos el número del enlace clicado y le restamos uno (Ya que empieza en 0)
  let pagina = (e.currentTarget.dataset.partida - 1) * 7;
  filtrarPartidasAdmin(datosFiltro, pagina);
}

/**
 * Crea una fila de una tabla
 *
 * @param   {string}       tipoCelda           Tipo de celda td o th
 * @param   {string[]}  textoElementos      Cada uno de los textos de los elementos
 * @param   {Object}       atributosElementos  Atributos que tendrán todas las celdas
 *
 * @return  {DOMElement}                               Fila
 */
function crearFilaTabla(tipoCelda, textoElementos, atributosElementos = []) {
  //Creamos la fila
  let fila = document.createElement("tr");
  //Creamos cada uno de los td
  if (!Array.isArray(textoElementos)) {
    textoElementos = Object.values(textoElementos);
  }
  if (typeof textoElementos[0] == "string") {
    for (let i = 0; i < textoElementos.length; i++) {
      let celda = document.createElement(tipoCelda);
      celda.textContent = textoElementos[i];
      if (atributosElementos[i] != null) {
        Object.entries(atributosElementos[i]).forEach((atributo) =>
          celda.setAttribute(atributo[0], atributo[1])
        );
      }
      //Lo añadimos a la fila
      fila.append(celda);
    }
  } else {
    for (let i = 0; i < textoElementos.length; i++) {
      let celda = document.createElement(tipoCelda);
      celda.append(textoElementos[i]);
      if (atributosElementos[i] != null) {
        Object.entries(atributosElementos[i]).forEach((atributo) =>
          celda.setAttribute(atributo[0], atributo[1])
        );
      }
      //Lo añadimos a la fila
      fila.append(celda);
    }
  }
  return fila;
}

/**
 * Limpia el campo despues del tiempo que le pasamos
 *
 * @param   {DOMElement}  campo  Elemento a limpiar
 * @param   {int}  tiempo  Tiempo que espera antes de limpiarlo
 *
 */
async function limpiarCampo(campo, tiempo = 2000) {
  setTimeout(() => {
    campo.innerHTML = "";
    campo.removeAttribute("class");
  }, tiempo);
}

/**
 * Limpia el campo despues del tiempo que le pasamos
 *
 * @param   {DOMElement}  campo  Elemento a limpiar
 * @param   {int}  tiempo  Tiempo que espera antes de limpiarlo
 *
 */
async function limpiarCampoArrayInput(campos, tiempo) {
  setTimeout(() => {
    campos.forEach((campo) => (campo.value = ""));
  }, tiempo);
}

/**
 * Limpia el campo file despues del tiempo que le pasamos
 *
 * @param   {DOMElement}  campo  Elemento a limpiar
 * @param   {int}  tiempo  Tiempo que espera antes de limpiarlo
 *
 */
async function limpiarCampoFile(campo, tiempo) {
  setTimeout(() => {
    //Para limpiar el tipo file lo clonamos y sustituimos, tenemos que hacer todo esto porque no nos deja cambiar el valor a un elemento activo por seguridad
    let clon = campo.cloneNode();
    clon.value = "";
    campo.replaceWith(clon);
  }, tiempo);
}

/**
 * Limpia el campo select (Poniendo el primer elemento como seleccionado)
 *
 * @param   {DOMElement}  campo  Elemento a limpiar
 * @param   {int}  tiempo  Tiempo que espera antes de limpiarlo
 *
 */
async function limpiarCampoSelect(campo, tiempo) {
  setTimeout(() => {
    //Para limpiar el tipo file lo clonamos y sustituimos, tenemos que hacer todo esto porque no nos deja cambiar el valor a un elemento activo por seguridad
    campo.options[0].setAttribute("selected", "selected");
  }, tiempo);
}

/**
 * Carga el modo editar de la partida
 *
 * @param   {Event}  e  Evento que se dispara
 *
 * @return  {void}     No devuelve nada
 */
async function modoEditarPartida(e) {
  //Cogemos el id de la partida (El texto del primer elementod el padre)
  let idPartida =
    e.currentTarget.parentElement.parentElement.firstElementChild.textContent;

  //Limpiamos el contenedor (Si tiene algún formulario o el contenedor elementos)
  let panelAdmin = document.getElementById("panelAdmin");
  if (panelAdmin.firstElementChild.nextElementSibling != "") {
    panelAdmin.removeChild(panelAdmin.firstElementChild.nextElementSibling);
  }
  //Creamos el formulario con las opciones
  let formEditPartida = crearContenedor("form", {
    id: "formPanelAdmin",
    action: "../php/panelAdministrador.php",
    method: "POST",
  });
  formEditPartida.addEventListener("submit", guardarCambiosEditarPartida);
  //Creamos cada uno de los elementos
  let labelNombre = crearElem("label", { for: "nombre_juego" }, "Nombre juego");
  //Contenedor para el input para poder mostrar un desplegable
  let contenedorInputNombre = crearContenedor("div", {
    class: "inputDesplegable",
  });
  let inputNombre = crearElem("input", {
    type: "text",
    name: "nombre_juego",
    id: "nombre_juego",
  });
  contenedorInputNombre.append(inputNombre);
  //Le asignamos el escuchador
  inputNombre.addEventListener("keyup", buscarJuegoNombreEscribir);
  inputNombre.addEventListener("focusout", eliminarDesplegable);
  let labelFecha = crearElem("label", { for: "fecha" }, "Fecha");
  let inputFecha = crearElem("input", {
    type: "date",
    name: "fecha",
    id: "fecha",
  });
  let labelPlazasMin = crearElem(
    "label",
    { for: "plazas_min" },
    "Plazas mínimas"
  );
  let inputPlazasMin = crearElem("input", {
    type: "number",
    name: "plazas_min",
    id: "plazas_min",
  });
  let labelPlazasTotales = crearElem(
    "label",
    { for: "plazas_totales" },
    "Plazas totales"
  );
  let inputPlazasTotales = crearElem("input", {
    type: "number",
    name: "plazas_totales",
    id: "plazas_totales",
  });
  let labelHoraInicio = crearElem(
    "label",
    { for: "hora_inicio" },
    "Hora de inicio"
  );
  let inputHoraInicio = crearElem("input", {
    type: "time",
    name: "hora_inicio",
    id: "hora_inicio",
  });
  let labelDuracion = crearElem("label", { for: "duracion" }, "Duracion");
  let inputDuracion = crearElem("input", {
    type: "number",
    name: "duracion",
    id: "duracion",
  });
  let labelDirectorPartida = crearElem(
    "label",
    { for: "director_partida" },
    "Director/a partida"
  );
  //Contenedor para el input para poder mostrar un desplegable
  let contenedorInputDirectorPartida = crearContenedor("div", {
    class: "inputDesplegable",
  });
  let inputDirectorPartida = crearElem("input", {
    type: "text",
    name: "director_partida",
    id: "director_partida",
  });
  contenedorInputDirectorPartida.append(inputDirectorPartida);
  //Le asignamos el escuchador
  inputDirectorPartida.addEventListener("keyup", buscarDirectoresEscribir);
  inputDirectorPartida.addEventListener("focusout", eliminarDesplegable);
  let parrafoResultado = crearElem("p", { id: "resultadoOperacion" });
  //Creamos los botones para guardar, cancelar o eliminar partida
  let inputGuardar = crearElem("input", {
    type: "submit",
    value: "Guarda cambios",
    "data-id": idPartida,
  });
  let botonEliminar = crearElem(
    "button",
    { type: "button", id: "eliminarPartida" },
    "Eliminar partida"
  );
  let botonCancelar = crearElem(
    "button",
    { type: "button", id: "cancelarPartida" },
    "Cancelar"
  );
  //Le añadimos el escuchador
  botonCancelar.addEventListener("click", cargarPartidasAdmin);
  botonEliminar.addEventListener("click", eliminarPartidaEdicion);
  //Añadimos todo al formulario
  formEditPartida.append(
    labelNombre,
    contenedorInputNombre,
    labelFecha,
    inputFecha,
    labelPlazasMin,
    inputPlazasMin,
    labelPlazasTotales,
    inputPlazasTotales,
    labelHoraInicio,
    inputHoraInicio,
    labelDuracion,
    inputDuracion,
    labelDirectorPartida,
    contenedorInputDirectorPartida,
    parrafoResultado,
    inputGuardar,
    botonEliminar,
    botonCancelar
  );
  //Añadimos todo al contenedor de elementos
  panelAdmin.append(formEditPartida);

  try {
    //Mandamos una petición para coger todos los datos de la partida
    const respuesta = await fetch("../php/panelAdministrador.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf8;" },
      body: JSON.stringify({ id_partida: idPartida }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn("error")) {
      throw respuestaJSON["error"];
    }
    //Quitamos el id del array de datos devueltos y lo eliminamos
    idPartida = respuestaJSON["juego_partida"];
    delete respuestaJSON["juego_partida"];
    //Ponemos la hora de inicio para que no tenga los segundos
    respuestaJSON["hora_inicio"] = respuestaJSON["hora_inicio"].substring(
      0,
      respuestaJSON["hora_inicio"].length - 3
    );
    //Asignamos el valor a cada uno de los input, dividimos en objeto en array de 0: id 1: valor y se lo asignamos
    Object.entries(respuestaJSON).forEach(
      (input) => (document.getElementById(input[0]).value = input[1])
    );
    //Asignamos al input el atributo data-idPartida
    inputNombre.setAttribute("data-id", idPartida);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Actualiza los datos editados en la BD
 *
 * @param   {Event}  e  Evento que la dispara
 *
 * @return  {void}     No devuelve nada
 */
async function guardarCambiosEditarPartida(e) {
  e.preventDefault();
  let parrafo = document.getElementById("resultadoOperacion");
  try {
    let camposPartida = [
      "nombre_juego",
      "fecha",
      "plazas_min",
      "plazas_totales",
      "hora_inicio",
      "duracion",
      "director_partida",
    ];
    //Comprobamos que tengan valor
    if (!comprobarCamposOblig(camposPartida)) {
      //Si no estñan vacios salimos de la función
      throw "Debe cubrir todos los campos";
    }
    //Cogemos el id del juego de la partida
    let idJuegoPartida = document
      .getElementById("nombre_juego")
      .getAttribute("data-id");
    //Cogemos los datos que hay en los input
    let datosPartida = {};
    //Eliminamos el dato del nombre de juego
    camposPartida.shift();
    camposPartida.forEach(
      (campo) => (datosPartida[campo] = document.getElementById(campo).value)
    );
    datosPartida["juego_partida"] = idJuegoPartida;
    //Enviamos la petición
    const respuesta = await fetch("../php/panelAdministrador.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8;" },
      body: JSON.stringify({ edicion_partida: datosPartida }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos si se dio un error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Si no se dio un error es que se cambiaron con éxito asique mostramos mensaje de éxito
    parrafo.textContent = "Datos actualizados con éxito";
    parrafo.classList.remove("error");
    parrafo.classList.add("exito");
    limpiarCampo(parrafo, 500);
  } catch (error) {
    parrafo.textContent = error;
    parrafo.classList.remove("exito");
    parrafo.classList.add("error");
  }
}

/**
 * Elimina la partida si acepta el administrador
 *
 * @param   {[type]}  idPartida  [idPartida description]
 *
 * @return  {[type]}             [return description]
 */
function eliminarPartidaTabla(e) {
  let idPartida =
    e.currentTarget.parentElement.parentElement.firstChild.textContent;
  if (confirm("Esta seguro que quiere borrar la partida?")) {
    eliminarPartida(idPartida);
  }
}

/**
 * Manda eliminar la partida en la que nos encontramos
 *
 * @param   {Event}  e  Evento que lo dispara
 *
 * @return  {void}     No devuelve nada
 */
function eliminarPartidaEdicion(e) {
  //Cogemos el id del botón de guardar cambios
  let idPartida = e.currentTarget.previousSibling.dataset.id;
  if (confirm("Esta seguro que quiere borrar la partida?")) {
    eliminarPartida(idPartida);
  }
}

/**
 * Elimina la partida de la BD
 *
 * @param   {int}  idPartida  ID de la partida
 *
 * @return  {void}             No devuelve nada
 */
async function eliminarPartida(idPartida) {
  try {
    //Creamos la conexión
    const respuesta = await fetch("../php/panelAdministrador.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ idPartidaEliminar: idPartida }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no hubiese ningún error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Recargamos las partidas
    cargarPartidasAdmin();
  } catch (error) {
    console.log(error);
  }
}

/**
 * Busca los juegos que coincidan con lo que escribe y muestra un desplegable con ellos
 *
 * @return  {void}  No devuelve nada
 */
async function buscarJuegoNombreEscribir() {
  //Cogemos el contenido del input
  let inputJuego = document.getElementById("nombre_juego");
  let nombreJuego = inputJuego.value;
  try {
    //Creamos la petición
    const respuesta = await fetch("../php/busquedasGenerales.php", {
      method: "POST",
      header: { "Content-type": "application/json; charset=utf-8;" },
      body: JSON.stringify({ nombre_juego: nombreJuego }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera un error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Asignamos el valor al input y le añadimos el id como atributo de tipo data-nombre
    crearContenedorDesplegable(inputJuego, respuestaJSON["nombreJuego"]);
    //Añadimos el evento al li para que al clicar se añada el juego como texto al input
    let elementosLi = Array.from(
      inputJuego.parentElement.querySelector(".contenedorDesplegable")
        .childNodes
    );
    elementosLi.forEach((elemento) =>
      elemento.addEventListener("click", asignarTextoInput)
    );
  } catch (error) {
    console.log(error);
  }
}

/**
 * Busca los directores que coincidan con lo que escribe y muestra un desplegable con ellos
 *
 * @return  {void}  No devuelve nada
 */
async function buscarDirectoresEscribir() {
  //Cogemos el contenido del input
  let inputDirectorPartida = document.getElementById("director_partida");
  let nombreDirectorPartida = inputDirectorPartida.value;
  try {
    //Creamos la petición
    const respuesta = await fetch("../php/busquedasGenerales.php", {
      method: "POST",
      header: { "Content-type": "application/json; charset=utf-8;" },
      body: JSON.stringify({ director_partida: nombreDirectorPartida }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera un error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Asignamos el valor al input y le añadimos el id como atributo de tipo data-nombre
    crearContenedorDesplegable(
      inputDirectorPartida,
      respuestaJSON["directorPartida"]
    );
    //Añadimos el evento al li para que al clicar se añada el juego como texto al input
    let elementosLi = Array.from(
      inputDirectorPartida.querySelector(".contenedorDesplegable").childNodes
    );
    elementosLi.forEach((elemento) =>
      elemento.addEventListener("click", asignarTextoInput)
    );
  } catch (error) {
    console.log(error);
  }
}

/**
 * Crea un contenedor desplegable con la información que le pasamos
 *
 * @param   {DOMElement}  inputRef          Input de referencia al que añadir el desplegable
 * @param   {Object}  datosDesplegable  Datos que se almacenarán en el desplegable
 *
 * @return  {void}                    No devuelve nada
 */
function crearContenedorDesplegable(inputRef, datosDesplegable) {
  //Creamos un contenedor para el input (si exite lo eliminamos)
  let contenedorDesplegable = inputRef.parentElement.querySelector(
    ".contenedorDesplegable"
  );
  //Si existe lo eliminamos
  if (contenedorDesplegable != null) {
    inputRef.parentElement.removeChild(contenedorDesplegable);
  }
  contenedorDesplegable = crearElem("ul", { class: "contenedorDesplegable" });
  //Le creamos cada uno de los li
  datosDesplegable.forEach((juego) => {
    let elementoLi = crearElem(
      "li",
      { "data-id": juego["id_producto"] },
      juego["nombre"]
    );
    elementoLi.addEventListener("click", asignarTextoInput);
    //Lo añadimos al ul
    contenedorDesplegable.append(elementoLi);
  });
  //Añadimos el ul al input
  inputRef.parentElement.append(contenedorDesplegable);
}

/**
 * Asigna el valor del li clicado
 *
 * @param   {Event}  e  Evento que se disparó
 *
 * @return  {void}     No devuelve nada
 */
function asignarTextoInput(e) {
  let elementoLi = e.currentTarget;
  //Cogemos el padre del padre de li (li => ul => ContenedorDiv => input)
  let contenedorDesplegable = elementoLi.parentElement.parentElement;
  let inputRef = contenedorDesplegable.firstChild;
  //Le asignamos el valor del li
  inputRef.value = elementoLi.textContent;
  //Asignamos el atributo data-idPartida
  inputRef.setAttribute("data-id", elementoLi.getAttribute("data-id"));
  //Eliminamos el contenedor de opciones
  //contenedorDesplegable.removeChild(elementoLi.parentElement);
}

/**
 * Elimina el desplegable cuando se pierde el focus del input
 *
 *
 * @return  {void}     No devuelve nada
 */
async function eliminarDesplegable() {
  //Esperamos un poco para que dé tiempo a ejecutarse el li si se pulsó
  setTimeout(() => {
    let desplegable = document.querySelector(".contenedorDesplegable");
    desplegable.remove();
  }, 200);
}
/**
 * Reserva la partida (Si puede)
 *
 * @param   {Event}  e  Evento que se disparó
 *
 * @return  {void}     No devuelve nada
 */
async function reservarPartida(e) {
  //Cogemos el id de su atributo
  let idPartida = e.currentTarget.dataset.id;
  try {
    //Creamos la petición
    const respuesta = await fetch("../php/partidas.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8;" },
      body: JSON.stringify({ partidaReservar: idPartida }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera un error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Mostramos el mensaje y volvemos a cargar las partidas
    alert(
      "¡Partida reservada con éxito!, cuando se procese la reserva se te enviará un correo diciendo si fue aceptada o no"
    );
    location.reload();
  } catch (error) {
    alert(error);
    //crearAlertResultado(error);
  }
}

/**
 * Crea un div que bloquea la pantalla con un alert en el medio para la información que necesita
 *
 * @param   {string}  mensaje  Mensaje a mostrar
 *
 * @return  {void}           No devuelve nada
 */
function crearAlertResultado(mensaje) {
  //Creamos un div
  let contenedorBloqueante = crearContenedor("div", {
    id: "divBloqueaPantalla",
  });
  let contenedorResultado = crearContenedor("div");
  let parrafoResultado = document.createElement("p");
  parrafoResultado.textContent = mensaje;
  let botonAceptar = crearBoton("Aceptar");
  contenedorResultado.append(parrafoResultado, botonAceptar);
  contenedorBloqueante.append(contenedorResultado);
  document.querySelector("body").append(contenedorBloqueante);
  contenedorBloqueante.x;
  //Le damos el focus al contenedor resultado
  contenedorResultado.focus();
}

/**
 * Elimina el div bloqueante
 *
 * @param   {Event}  e  Evento que se disparó
 *
 * @return  {void}     No devuelve nada
 */
function eliminarAlertResultado(e) {
  //Eliminamos el div que bloquea
  let contenedorResultado = e.currentTarget.parentElement.parentElement;
  contenedorResultado.remove();
}

/**
 * Procesa la reserva (acepta o rechaza)
 *
 * @param   {Eventq}  e  Evento que se disparó
 *
 * @return  {void}     No devuelve nada
 */
async function procesarReserva(e) {
  //Cogemos del botón si es para aceptar o rechazar
  let idPartida = e.currentTarget.dataset.id;
  let accionRealizar = e.currentTarget.dataset.accion;
  let contenedorFila = e.currentTarget.parentElement.parentElement;
  //Cogemos el usuario del que es la reserva (El primer td su texto)
  let usuario = contenedorFila.firstChild.textContent;
  try {
    //Procesamos la respuesta
    const respuesta = await fetch("../php/panelAdministrador.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8;" },
      body: JSON.stringify({
        procesarReserva: accionRealizar,
        datosReserva: { id_partida: idPartida, usuario: usuario },
      }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    resultado = accionRealizar == "aceptar" ? "Aceptada" : "Rechazada";
    mostrarResultado(contenedorFila, resultado);
  } catch (error) {
    alert(error);
  }
}

/**
 * Muestra el resultado (Si se aceptó o rechazó y vuelve a cargar las reservas)
 *
 * @param   {DOMElement}  fila       Fila a cambiar
 * @param   {string}  resultado  Operación realizada
 *
 * @return  {void}             No devuelve nada
 */
async function mostrarResultado(fila, resultado) {
  //Eliminamos los dos botones (Los últimos td)
  fila.removeChild(fila.lastElementChild);
  fila.removeChild(fila.lastElementChild);
  //Creamos un td con el resultado
  let celda = document.createElement("td");
  celda.textContent = resultado;
  celda.classList.add("exito");
  //Lo añadimos a la fila
  fila.append(celda);
  //Esperamos 1 segundo y cargamos las reservas otra vez
  setTimeout(cargarReservasAdmin, 2000);
}

/**
 * Crea el botony el menu de accesibilidad
 *
 * @return  {void}  No devuelve nada
 */
function crearBotonAccesibilidad() {
  let boton = crearBoton("", { type: "button", id: "botonAccesiblidad" });
  //Creamos el div con las opciones
  let contenedorAcessibilidad = crearContenedor("div", {
    id: "menuAccesibilidad",
  });
  let cabeceraAccesiblidad = crearContenedor("h3", {}, "Modo monocromático");
  let botonAccesibilidad = crearToggleSwitch();
  contenedorAcessibilidad.append(cabeceraAccesiblidad, botonAccesibilidad);
  document.querySelector("body").append(boton, contenedorAcessibilidad);
  //Añadimos el escuchador
  boton.addEventListener("click", ocultarMenuAccesibilidad);
  //Activamos el evento para que oculte el menú
  boton.dispatchEvent(new Event("click"));
  //Activamos o no el modo monocromatico
  let botonModoMonocromatico = document.getElementById("monocromatico");
  localStorage.getItem("modoMonocromatico") == "activado"
    ? (botonModoMonocromatico.checked = true)
    : (botonModoMonocromatico.checked = false);
  botonModoMonocromatico.dispatchEvent(new Event("click"));
}

/**
 * Crea la parte del botón toggle como tal
 *
 * @return  {DOMElement}  El elemento toggle
 */
function crearToggleSwitch() {
  //creamos un label de tipo checked
  let boton = crearElem("label", { class: "switch" });
  let inputCheckbox = crearElem("input", {
    type: "checkbox",
    id: "monocromatico",
  });
  let circuloToggle = crearElem("span", { class: "slider" });
  boton.append(inputCheckbox, circuloToggle);
  //Añadimos el escuchador
  inputCheckbox.addEventListener("click", cambiarModo);
  //Comprobamos si tenemos una cookie con el modo

  return boton;
}

/**
 * Oculta y muestra el botón de accesibilidad
 *
 * @return  {void}  No devuelve nada
 */
function ocultarMenuAccesibilidad() {
  let contenedorAcessibilidad = document.getElementById("menuAccesibilidad");
  //Ocultamos el contenedor de opciones
  $(contenedorAcessibilidad).animate({ width: "toggle" });
}

/**
 * Cambia el modo de monocromatico o estandar
 *
 * @return  {void}  None
 */
function cambiarModo() {
  //Cogemos el botón de monocromatico
  let botonCambio = document.getElementById("monocromatico");
  if (botonCambio.checked) {
    //Buscamos todos los elementos y le ponemosla clase monocromatico
    let body = document.querySelector("body");
    cambiarClaseMonocromaticoRecursivo(body);
    //Guardamos en que modo está
    localStorage.setItem("modoMonocromatico", "activado");
  } else {
    //Buscamos todos los elementos y le ponemosla clase monocromatico
    let body = document.querySelector("body");
    retirarClaseMonocromaticoRecursivo(body);
    localStorage.setItem("modoMonocromatico", "desactivado");
  }
}

/**
 * Cambia el modo a blanco y negro de manera recursiva
 *
 * @param   {DOMElement}  elemento  Elemento DOM
 *
 * @return  {void}            No devuelve nada
 */
function cambiarClaseMonocromaticoRecursivo(elemento) {
  //Comprobamos si ya tiene la clase y se la ponemos si no la tiene
  if (!elemento.classList.contains("monocromatico")) {
    elemento.classList.add("monocromatico");
  }
  //Cogemos sus hijos y los pasamos
  let hijos = Array.from(elemento.children);
  hijos.forEach((hijo) => cambiarClaseMonocromaticoRecursivo(hijo));
}

/**
 * Elimina la clase monocromático de todos los elementos de manera recursiva
 *
 * @param   {DOMElement}  elemento  Elemento DOM
 *
 * @return  {void}            No devuelve nada
 */
function retirarClaseMonocromaticoRecursivo(elemento) {
  //Comprobamos si ya tiene la clase y se la ponemos si no la tiene
  if (elemento.classList.contains("monocromatico")) {
    elemento.classList.remove("monocromatico");
  }
  //Cogemos sus hijos y los pasamos
  let hijos = Array.from(elemento.children);
  hijos.forEach((hijo) => retirarClaseMonocromaticoRecursivo(hijo));
}

/**
 * Crea el contenedor con mas info de partidas
 *
 * @param   {Array}  datos  Array tipo {clave: valor} con los datos por una parte infoPartida y por otra imagenes
 *
 * @return  {void}         No devuelve nada
 */
function crearMasInfoPartida(datos) {
  //Creamos el contenedor
  let contenedorMasInfo = crearContenedor("div", { id: "masInfoPartida" });
  //Creamos el encabezado
  let idPartida = datos["infoPartida"]["id_partida"];
  let encabezado = crearElem("h1", {}, "Partida" + idPartida);
  contenedorMasInfo.append(encabezado);
  //Eliminamos el id del array de datos
  delete datos["infoPartida"]["id_partida"];
  //Ponemos bien en formato la fecha y la hora
  datos["infoPartida"]["fecha"] = new Fecha(
    datos["infoPartida"]["fecha"]
  ).getFecha();
  datos["infoPartida"]["hora inicio"] = datos["infoPartida"]["fecha"].substring(
    0,
    datos["infoPartida"]["fecha"].length - 3
  );
  //Eliminamos la hora de inicio para que tenga el nuevo indice
  delete datos["infoPartida"]["hora_inicio"];
  //Recorremos los datos y vamos creando p
  Object.entries(datos["infoPartida"]).forEach((dato) => {
    let indiceMayuscula =
      dato[0].charAt(0).toUpperCase() + dato[0].substring(1);
    let parrafo = crearElem("p", {}, indiceMayuscula + ": " + dato[1]);
    contenedorMasInfo.append(parrafo);
  });
  //Creamos el carrusel
  //Creamos imagenes con cada uno de los datos
  let imagenes = [];
  Array.from(datos["imagenes"]).forEach((imagen) => {
    let contenedorImagen = crearImg({
      src: imagen["imagen"],
      alt: "Foto partidas organizadas",
    });
    imagenes.push(contenedorImagen);
  });
  let carrusel = crearCarrusel(
    "imagenesPartida",
    "Cajas anteriores",
    imagenes,
    "partida",
    "masInfoTarjeta"
  );
  //Creamos el botón para reservar
  let botonReservar = crearBoton("¡Reservar!", {
    class: "btn btn-lg btn-success",
    type: "button",
    "data-id": idPartida,
  });
  //Le añadimos el escuchador
  botonReservar.addEventListener("click", reservarPartida);
  //Creamos el botón de cierre
  let botonCierre = crearBoton("X");
  //Le añadimos el escuchador
  botonCierre.addEventListener("click", cerrarVentanaFlotante);
  //Añadimos todo al contenedor
  contenedorMasInfo.append(carrusel, botonReservar, botonCierre);
  //Lo ocultamos y lo mostramos
  contenedorMasInfo.style.display = "none";
  //Lo añadimos al body
  document.querySelector("body").append(contenedorMasInfo);
  $(contenedorMasInfo).toggle(1000);
}

/**
 * Cierra la ventana flotante
 *
 * @param   {Event}  e  Evento que se disparó
 *
 * @return  {void}     No devuelve nada
 */
async function cerrarVentanaFlotante(e) {
  let padre = e.currentTarget.parentElement;
  $(padre).toggle(1000);
  //Eliminamos al padre despues del tiempo que tarda en cerrarse
  setTimeout(() => padre.remove(), 1000);
}

/**
 * Consigue la información de la partida
 *
 * @param   {Event}  e  Evento que se dispara
 *
 * @return  {void}     No devuelve nada
 */
async function conseguirInfoPartida(e) {
  try {
    //Cogemos el id del botón
    let idPartida = e.currentTarget.dataset.id;
    //iniciamos la peticion
    const respuesta = await fetch("../php/partidas.php", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ masInfoPartida: idPartida }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Creamos el contenedor
    crearMasInfoPartida(respuestaJSON);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Crea el carrusel según las opciones
 *
 * @param   {string}  idCarrusel          Id del carrusel
 * @param   {string}  titulo              Titulo que tendrá
 * @param   {array}  contenidoElementos  Array con lo que tendrá dentro el elemento item
 * @param   {string}  tipoCarrusel        Tipo carrusel (partidas, suscripciones, etc..)
 *
 * @return  {DOMElement}                      Carrusel
 */
function crearCarrusel(
  idCarrusel,
  titulo,
  contenidoElementos,
  tipoCarrusel,
  classTarjeta = null
) {
  //Creamos el contenedor
  let contenedorCarrusel = crearContenedor("div", {
    id: idCarrusel,
    class: "carousel slide",
    "data-bs-ride": "carousel",
  });
  //Creamos el encabezado
  let encabezado = crearElem("h2", {}, titulo);
  //Creamos los indicadores
  let ariaLabelIndicadores = [...Array(contenidoElementos.length).keys()].map(
    (indice) => tipoCarrusel + indice
  );
  let indicadores = crearIndicadoresCarrusel(idCarrusel, ariaLabelIndicadores);
  let contenedorInterior = crearInteriorCarrusel(
    contenidoElementos,
    classTarjeta
  );
  //Creamos los botones para poder moverlo
  //Prev
  let botonPrev = crearElem("button", {
    class: "carousel-control-prev",
    type: "button",
    "data-bs-target": "#" + idCarrusel,
    "data-bs-slide": "prev",
  });
  let iconoPrev = crearElem("span", {
    class: "carousel-control-prev-icon",
    "aria-hidden": true,
  });
  let lectorPrev = crearElem("span", { class: "visually-hidden" }, "Anterior");
  botonPrev.append(iconoPrev, lectorPrev);
  //Siguiente
  let botonSiguiente = crearElem("button", {
    class: "carousel-control-next",
    type: "button",
    "data-bs-target": "#" + idCarrusel,
    "data-bs-slide": "next",
  });
  let iconoSiguiente = crearElem("span", {
    class: "carousel-control-next-icon",
    "aria-hidden": true,
  });
  let lectorSiguiente = crearElem(
    "span",
    { class: "visually-hidden" },
    "Siguiente"
  );
  botonSiguiente.append(iconoSiguiente, lectorSiguiente);
  //Añadimos todo
  contenedorCarrusel.append(
    encabezado,
    indicadores,
    contenedorInterior,
    botonPrev,
    botonSiguiente
  );
  return contenedorCarrusel;
}

/**
 * Crea los indicadores del carrusel
 *
 * @param   {string}  id      id del elemento
 * @param   {array[string]}  labels  Labels que mostrarán los indicadores
 *
 * @return  {DOMElement}          Contenedor de los indicadores
 */
function crearIndicadoresCarrusel(id, labels) {
  //Creamos su contenedor
  let indicadores = crearContenedor("div", { class: "carousel-indicators" });
  //Creamos cada uno de los botones
  for (let i = 0; i < labels.length; i++) {
    let boton = crearElem("button", {
      type: "button",
      "data-bs-target": "#" + id,
      "data-bs-slide-to": i,
      "aria-label": labels[i],
    });
    indicadores.append(boton);
  }
  //Cogemos al primer elemento y le añadimos que es el activo
  indicadores.firstElementChild.setAttribute("class", "active");
  indicadores.firstElementChild.setAttribute("aria-current", true);
  return indicadores;
}

/**
 * Crea el interior del carrusel
 *
 * @param   {array[DomElement]}  contenidoElemento  Todo lo que tendrá el carrusel
 *
 * @return  {DOMElement}                     Contenedor con el interiore del carrusel
 */
function crearInteriorCarrusel(contenidoElemento, classTarjeta) {
  let contenedorInterior = crearContenedor("div", { class: "carousel-inner" });
  //Creamos cada uno de los elementos
  contenidoElemento.forEach((elemento) => {
    //Creamos su contenedor
    let contenedor = crearContenedor("div", { class: "carousel-item" });
    //Creamos la tarjeta
    let tarjeta = crearContenedor("div", { class: "tarjeta" });
    if (classTarjeta != null) {
      tarjeta.classList.add(classTarjeta);
    }
    //Aañdimos todo
    Array.isArray(elemento)
      ? tarjeta.append(...elemento)
      : tarjeta.append(elemento);
    contenedor.append(tarjeta);
    contenedorInterior.append(contenedor);
  });
  //Ponemos el primer elemento como activo
  contenedorInterior.firstElementChild.classList.add("active");
  return contenedorInterior;
}

/**
 * Carga el modo de los usuarios administradores para roles
 *
 * @return  {void}  No devuelve nada
 */
async function cargarModoUsuariosAdmin() {
  let panelAdmin = document.getElementById("panelAdmin");
  //Comprobamos si tiene ya algo y entonces lo limpiamos y si no no
  if (panelAdmin.firstElementChild.nextElementSibling != null) {
    panelAdmin.lastElementChild.remove();
  }
  //Creamos el formulario
  let formulario = crearContenedor("form", { id: "formPanelAdmin" });
  //Creamos el contenedor que tiene todo
  let contenedorElementos = crearContenedor("div", {
    id: "contenedorElementos",
  });
  //Contenedor de los botones
  let contenedorBotones = document.createElement("div");
  //Botones
  let rol = crearBoton("Cambiar rol", {
    "data-nombre": "cambiarRol",
    type: "button",
  });
  let historial = crearBoton("Historial usuarios", {
    "data-nombre": "historial",
    class: "noActivo",
    type: "button",
  });
  //Añadimos los escuchadores
  rol.addEventListener("click", cargarModoUsuariosAdmin);
  historial.addEventListener("click", cargarModoHistorialAdmin);
  contenedorBotones.append(rol, historial);
  //Creamos su cabecera
  let cabecera = crearElem("h2", {}, "Filtro de usuarios");
  //Creamos la tabla
  let tabla = crearContenedor("table", { id: "filtroUsuarios" });
  //Creamos la fila de la cabecera
  let cabeceraTabla = document.createElement("thead");
  let filaCabecera = crearFilaTabla("th", ["Email del usuario", "Rol"]);
  cabeceraTabla.append(filaCabecera);
  //Creamos el cuerpo
  let cuerpoTabla = document.createElement("tbody");
  //Creamos cada una de las filas
  //Input de las filas
  let filtroEmail = crearElem("input", {
    id: "filtro-email",
    type: "text",
    name: "email",
    placeholder: "Buscar por...",
  });
  let selectRol = crearElem("select", { id: "filtro-rol", name: "rol" });
  //Opciones que tiene
  let optionNull = crearElem("option", { value: "" }, "No seleccionado");
  let option1 = crearElem("option", { value: 2 }, "Estándar");
  let option2 = crearElem("option", { value: 1 }, "Administrador");
  selectRol.append(optionNull, option1, option2);
  //Botón para filtar
  let botonFiltrar = crearBoton("Filtrar", {
    id: "filtrarUsuariosAdmin",
    type: "button",
  });
  //Le añadimos el escuchador
  botonFiltrar.addEventListener("click", cogerFiltrosUsuariosAdmin);
  //Creamos la fila
  let filaCuerpo = crearFilaTabla("td", [filtroEmail, selectRol, botonFiltrar]);
  cuerpoTabla.append(filaCuerpo);
  //Añadimos todo a la tabla
  tabla.append(cabeceraTabla, cuerpoTabla);
  //Segunda cabecera
  let cabeceraUsuarios = crearElem("h2", {}, "Usuarios y roles");
  let tablaUsuarios = crearContenedor("table", { id: "listaElementos" });
  //Creamos la cabecera
  let cabeceraTablaUsuarios = document.createElement("thead");
  //Creamos su fila
  let filaCabeceraUsuarios = crearFilaTabla("th", ["Email", "Rol", ""]);
  cabeceraTablaUsuarios.append(filaCabeceraUsuarios);
  //Creamos el cuerpo
  let cuerpoUsuarios = document.createElement("tbody");
  //Añadimos todo a la tabla
  tablaUsuarios.append(cabeceraTablaUsuarios, cuerpoUsuarios);
  //Añadimos todo al contenedor
  contenedorElementos.append(
    contenedorBotones,
    cabecera,
    tabla,
    cabeceraUsuarios,
    tablaUsuarios
  );
  formulario.append(contenedorElementos);
  //Lo añadimos al contenedor panel Admin
  panelAdmin.append(formulario);
  //Ponemos el modo visible en el usuario
  let lista = document.getElementById("opcionesPanelAdmin");
  let elementosActivo = Array.from(
    lista.querySelectorAll("a[class='listaActivo']")
  );
  elementosActivo.forEach((elemento) =>
    elemento.classList.remove("listaActivo")
  );
  //Se lo ponemos a usuarios
  document
    .getElementById("pestUsuarios")
    .firstElementChild.classList.add("listaActivo");
}

/**
 * Carga los usuarios según el filtro
 *
 * @param   {Object}  filtro  Filtros a aplicar de tipo {clave: valor}
 * @param   {int}  pagina  Página actual en la que nos encontramos
 *
 * @return  {Promise}        No devuelve nada
 */
async function cargarUsuarios(filtro = {}, pagina = 0) {
  //Añadimos al filtro al página en la que nos encontramos
  filtro["pagina"] = pagina;
  filtro["limite"] = 7;
  let tablaUsuarios = document.getElementById("listaElementos");
  let cuerpoTabla = tablaUsuarios.querySelector("tbody");
  //Limpiamos el contenedor
  cuerpoTabla.innerHTML = "";
  try {
    //Iniciamos la petición
    const respuesta = await fetch("../php/cambiarRol.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset = utf-8" },
      body: JSON.stringify({ filtrarUsuarios: filtro }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Recorremos el array
    respuestaJSON["datosUsuarios"].forEach((fila) => {
      //Creamos el td con el email y el select con el option seleccionado
      let email = crearContenedor("td", {}, fila["email"]);
      let selectRol = crearContenedor("select", {
        name: "nuevo_rol",
        id: fila["email"],
      });
      //Creamos sus option
      let optionEstandar = crearElem("option", { value: 2 }, "Estándar");
      let optionAdmin = crearElem("option", { value: 1 }, "Administrador");
      optionAdmin.value == fila["rol"]
        ? optionAdmin.setAttribute("selected", "selected")
        : optionEstandar.setAttribute("selected", "selected");
      //Añadimos todo
      selectRol.append(optionEstandar, optionAdmin);
      //Botón guardarCambio rol
      let botonGuardar = crearBoton("Guardar");
      //Le añadimos el evento
      botonGuardar.addEventListener("click", recogerDatos);
      //Creamos la fila
      let filaTabla = crearFilaTabla("td", [email, selectRol, botonGuardar]);
      cuerpoTabla.append(filaTabla);
    });
    //Creamos la paginación
    let contenedor = document.getElementById("contenedorElementos");
    let pagina = filtro["pagina"] != 0 ? filtro["pagina"] / 7 : 0;
    contenedor.append(crearPaginacion(respuestaJSON["numPag"], pagina));
    //Le añadimos el escuchador a cada uno de ellos
    let listaLi = Array.from(document.querySelectorAll(".pagination li"));
    if (listaLi != null) {
      listaLi.forEach((elementoLi) =>
        elementoLi.firstElementChild.addEventListener(
          "click",
          cogerFiltrosUsuariosAdmin
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Coge los filtros en la pestaña usuarios de admin para cambiar el rol
 *
 * @param   {Event}  e  Evento que lo dispara
 *
 * @return  {void}     No devuelve nada
 */
function cogerFiltrosUsuariosAdmin(e) {
  e.preventDefault();
  let filtros = {};
  //Cogemos el email de usuario
  let email = document.getElementById("filtro-email").value;
  if (email != "") {
    filtros["email"] = email;
  }
  let rol = document.getElementById("filtro-rol").value;
  if (rol != "") {
    filtros["rol"] = rol;
  }
  //Cargamos las partidas
  cargarUsuarios(filtros);
}

/**
 * Muestra una ventana flotante con el historial
 *
 * @return  {void}  No devuelve nada
 */
function mostrarHistorial() {
  //Creamos el contenedor
  let contenedorHistorial = crearContenedor("div", {
    id: "contenedorHistorial",
  });
  //Creamos el botón de cierre
  let botonCierre = crearBoton("X");
  //Le añadimos para que oculte y elimine el contenedor
  botonCierre.addEventListener("click", cerrarVentanaFlotante);
  //Creamos el div de filtrado
  let formFiltrado = crearContenedor("form", {
    id: "formHistorial",
    action: "../php/historial.php",
    method: "POST",
  });
  //Cada uno de los date
  let labelfechaInicio = crearElem(
    "label",
    { for: "fechaIniHistorial" },
    "Fecha inicio"
  );
  let fechaInicio = crearElem("input", {
    type: "date",
    name: "fechaIniHistorial",
    id: "fechaIniHistorial",
  });
  let labelfechaFin = crearElem(
    "label",
    { for: "fechaFinHistorial" },
    "Fecha fin"
  );
  let fechaFin = crearElem("input", {
    type: "date",
    name: "fechaFinHistorial",
    id: "fechaFinHistorial",
  });
  //Botón para filtrar
  let botonFiltrado = crearElem("button", { type: "button" }, "Filtrar");
  //Le añadimos el escuchador
  botonFiltrado.addEventListener("click", cogerFiltradoHistorial);
  formFiltrado.append(
    labelfechaInicio,
    fechaInicio,
    labelfechaFin,
    fechaFin,
    botonFiltrado
  );
  //Creamos la tabla donde se mostrará
  let tablaUsuarios = crearContenedor("table", { id: "listaElementos" });
  let cabeceraTablaUsuarios = document.createElement("thead");
  //Creamos una fila
  let filaCabecera = crearFilaTabla("th", ["Fecha modificación", "Datos"]);
  cabeceraTablaUsuarios.append(filaCabecera);
  let cuerpoTablaUsuarios = document.createElement("tbody");
  tablaUsuarios.append(cabeceraTablaUsuarios, cuerpoTablaUsuarios);
  //Añadimos todo al contenedor
  contenedorHistorial.append(formFiltrado, tablaUsuarios, botonCierre);
  contenedorHistorial.style.display = "none";
  document.querySelector("body").append(contenedorHistorial);
  $(contenedorHistorial).fadeIn(1000);
  cargarHistorialUsuario();
}

/**
 * Carga los datos del usuario en la ventana flotante
 *
 * @return  {void}  No devuelve nada
 */
async function cargarHistorialUsuario(filtro = {}, pagina = 0, limite = 7) {
  filtro["pagina"] = pagina;
  filtro["limite"] = limite;
  let cuerpoTabla = document.querySelector("tbody");
  //Limpiamos el contenedor
  cuerpoTabla.innerHTML = "";
  try {
    //Iniciamos la peticion
    const respuesta = await fetch("../php/historial.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8;" },
      body: JSON.stringify({ usuario: filtro }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Cargamos cada fila
    respuestaJSON["historial"].forEach((dato) => {
      let filaHistorial = crearFilaTabla("td", dato);
      cuerpoTabla.append(filaHistorial);
    });
    //Creamos la paginación
    let contenedor = document.getElementById("contenedorHistorial");
    let pagina = filtro["pagina"] != 0 ? filtro["pagina"] / 7 : 0;
    contenedor.append(crearPaginacion(respuestaJSON["numPag"], pagina));
    //Le añadimos el escuchador a cada uno de ellos
    let listaLi = Array.from(document.querySelectorAll(".pagination li"));
    if (listaLi != null) {
      listaLi.forEach((elementoLi) =>
        elementoLi.firstElementChild.addEventListener(
          "click",
          cogerFiltradoHistorial
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Coge los datos del formulario y carga el historial con ese filtrado
 *
 * @param {Event}   e que se dispara
 *
 * @return  {void}  No devuelve nada
 */
function cogerFiltradoHistorial(e) {
  e.preventDefault();
  let filtro = {};
  let limite = 7;
  let pagina =
    e.currentTarget.dataset.partida != null
      ? (e.currentTarget.dataset.partida - 1) * limite
      : 0;
  //Cogemos los datos de las fechas
  let fechaIni = document.getElementById("fechaIniHistorial").value;
  fechaIni != "" ? (filtro["fechaIni"] = fechaIni) : "";
  let fechaFin = document.getElementById("fechaFinHistorial").value;
  fechaFin != "" ? (filtro["fechaFin"] = fechaFin) : "";
  cargarHistorialUsuario(filtro, pagina, limite);
}

/**
 * Carga el modo historial del administrador
 *
 * @return  {void}  No devuelve nada
 */
function cargarModoHistorialAdmin() {
  let panelAdmin = document.getElementById("panelAdmin");
  //Comprobamos si tiene ya algo y entonces lo limpiamos y si no no
  if (panelAdmin.firstElementChild.nextElementSibling != null) {
    panelAdmin.lastElementChild.remove();
  }
  //Creamos el formulario
  let formulario = crearContenedor("form", { id: "formPanelAdmin" });
  //Creamos el contenedor que tiene todo
  let contenedorElementos = crearContenedor("div", {
    id: "contenedorElementos",
  });
  //Contenedor de los botones
  let contenedorBotones = document.createElement("div");
  //Botones
  let rol = crearBoton("Cambiar rol", {
    "data-nombre": "cambiarRol",
    type: "button",
    class: "noActivo",
  });
  let historial = crearBoton("Historial usuarios", {
    "data-nombre": "historial",
    type: "button",
  });
  contenedorBotones.append(rol, historial);
  rol.addEventListener("click", cargarModoUsuariosAdmin);
  historial.addEventListener("click", cargarModoHistorialAdmin);
  //Creamos su cabecera
  let cabecera = crearElem("h2", {}, "Filtro de usuarios");
  //Creamos la tabla
  let tabla = crearContenedor("table", { id: "filtroUsuarios" });
  //Creamos la fila de la cabecera
  let cabeceraTabla = document.createElement("thead");
  //Cabecera de la tabla de filtrado
  let labelFechaIni = crearElem(
    "label",
    { for: "fechaIniHistorial" },
    "Fecha inicio"
  );
  let filtroFechaIniHistorial = crearElem("input", {
    id: "fechaIniHistorial",
    type: "date",
    name: "email",
  });
  labelFechaIni.append(filtroFechaIniHistorial);
  let labelFechaFinHistorial = crearElem(
    "label",
    { for: "filtroFechaFinHistorial" },
    "Fecha fin"
  );
  let filtroFechaFinHistorial = crearElem("input", {
    id: "filtroFechaFinHistorial",
    type: "date",
    name: "email",
  });
  labelFechaFinHistorial.append(filtroFechaFinHistorial);
  //Botón para filtar
  let botonFiltrar = crearBoton("Filtrar", {
    id: "filtrarUsuariosAdmin",
    type: "button",
  });
  //Le añadimos el escuchador
  botonFiltrar.addEventListener("click", cogerFiltroHistorialAdmin);
  let filaCabecera = crearFilaTabla("th", [
    labelFechaIni,
    labelFechaFinHistorial,
    botonFiltrar,
  ]);
  //Añadimos su evento
  cabeceraTabla.append(filaCabecera);
  //Creamos el cuerpo
  let cuerpoTabla = document.createElement("tbody");
  //Añadimos todo a la tabla
  tabla.append(cabeceraTabla, cuerpoTabla);
  //Segunda cabecera
  let cabeceraUsuarios = crearElem("h2", {}, "Historial de usuarios");
  let tablaUsuarios = crearContenedor("table", { id: "listaElementos" });
  //Creamos la cabecera
  let cabeceraTablaUsuarios = document.createElement("thead");
  //Creamos su fila
  let filaCabeceraUsuarios = crearFilaTabla("th", ["Fecha", "Datos"]);
  cabeceraTablaUsuarios.append(filaCabeceraUsuarios);
  //Creamos el cuerpo
  let cuerpoUsuarios = document.createElement("tbody");
  //Añadimos todo a la tabla
  tablaUsuarios.append(cabeceraTablaUsuarios, cuerpoUsuarios);
  //Añadimos todo al contenedor
  contenedorElementos.append(
    contenedorBotones,
    cabecera,
    tabla,
    cabeceraUsuarios,
    tablaUsuarios
  );
  formulario.append(contenedorElementos);
  //Lo añadimos al contenedor panel Admin
  panelAdmin.append(formulario);
  //Ponemos el modo visible en el usuario
  let lista = document.getElementById("opcionesPanelAdmin");
  let elementosActivo = Array.from(
    lista.querySelectorAll("a[class='listaActivo']")
  );
  elementosActivo.forEach((elemento) =>
    elemento.classList.remove("listaActivo")
  );
  //Se lo ponemos a usuarios
  document
    .getElementById("pestUsuarios")
    .firstElementChild.classList.add("listaActivo");
  filtrarHistorialAdmin();
}

/**
 * Función para filtrar el historial de administrador
 *
 * @param   {Object}  filtro  Filtros a aplicar de tipo {clave: valor}
 * @param   {int}  pagina  Página en la que te encuentras
 *
 * @return  {void}          No devuelve nada
 */
async function filtrarHistorialAdmin(filtro = {}, pagina = 0, limite = 7) {
  filtro["pagina"] = pagina;
  filtro["limite"] = limite;
  let cuerpoTabla = document
    .getElementById("listaElementos")
    .querySelector("tbody");
  //Limpiamos el contenedor
  cuerpoTabla.innerHTML = "";
  try {
    //Iniciamos la peticion
    const respuesta = await fetch("../php/historial.php", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8;" },
      body: JSON.stringify({ admin: filtro }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Cargamos cada fila
    respuestaJSON["historial"].forEach((dato) => {
      let filaHistorial = crearFilaTabla("td", dato, [{}, { colspan: 2 }]);
      cuerpoTabla.append(filaHistorial);
    });
    //Creamos la paginación
    let contenedor = document.getElementById("contenedorElementos");
    let pagina = filtro["pagina"] != 0 ? filtro["pagina"] / 7 : 0;
    contenedor.append(crearPaginacion(respuestaJSON["numPag"], pagina));
    //Le añadimos el escuchador a cada uno de ellos
    let listaLi = Array.from(document.querySelectorAll(".pagination li"));
    if (listaLi != null) {
      listaLi.forEach((elementoLi) =>
        elementoLi.firstElementChild.addEventListener(
          "click",
          cogerFiltroHistorialAdmin
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Coge los filtros a aplicar y se los pasa a filtrarHistorialAdmin
 *
 * @param {Event}   e que se dispara
 *
 * @return  {void}  No devuelve nada
 */
function cogerFiltroHistorialAdmin(e) {
  e.preventDefault();
  let filtro = {};
  let limite = 7;
  let pagina =
    e.currentTarget.dataset.partida != null
      ? (e.currentTarget.dataset.partida - 1) * limite
      : 0;
  //Cogemos los datos de las fechas
  let fechaIni = document.getElementById("fechaIniHistorial").value;
  fechaIni != "" ? (filtro["fechaIni"] = fechaIni) : "";
  let fechaFin = document.getElementById("filtroFechaFinHistorial").value;
  fechaFin != "" ? (filtro["fechaFin"] = fechaFin) : "";
  filtrarHistorialAdmin(filtro, pagina, limite);
}

/**
 * Selecciona aquellos elementos con la clase development y los prepara
 * para funcionar como tooltips
 *
 * @return  {[void]}  No devuelve nada
 */
function asignarTooltips() {
  $(".development").each(function () {
    // Aquellos elementos de la clase development van a tener los atributos para el tooltip
    $(this).attr("data-toggle", "tooltip");
    $(this).attr("data-placement", "top");
    $(this).attr("title", "En desarrollo");
  });
}

/**
 * Activa los tooltips
 *
 * @return  {[void]}  No devuelve nada
 */
function activarTooltips() {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
}

/* Carga las 3 últimas cajas sorpresa (sin contar la de ese mes)
 *
 * @return  {void}  No devuelve nada
 */
async function cargarUltimasCajas() {
  try {
    //Interiore del carrusel
    let intCarrusel = document.getElementsByClassName("carousel-inner")[0];
    let elementoCarrusel = Array.from(intCarrusel.children);
    //Creamos la petición
    const respuesta = await fetch("../php/cajaSorpresa.php", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=utf-8;" },
      body: JSON.stringify({ cajasSorpresa: 3 }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera un error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Recorremos el array
    respuestaJSON["cajas"].forEach((caja) => {
      let contenedorTarjeta = crearContenedor("div", { class: "tarjeta" });
      //Fecha, como todos los elementos tienen el mismo tipo de fecha para la caja cogemos el primer elemento
      let fechaCaja = new Fecha(caja[0]["fecha"]).formatearFechaMesAnho();
      //Creamos un div con la imagen
      let contendorImgCaja = crearContenedor("div", {
        class: "imagenCaja",
        "aria-label": "Caja " + fechaCaja,
      });
      //Le aplicamos la imagen como fondo, como todos los elementos tienen la misma imagen de caja cogemos el priemr elemento
      contendorImgCaja.style.backgroundImage = `url(${caja[0]["img_caja"]})`;
      //Creamos el div con la información
      let contenedorInfo = crearContenedor("div", {
        class: "contenidoTarjeta",
      });
      //Creamos la cabecera
      let cabeceraCaja = crearElem("h2", {}, fechaCaja);
      //Creamos la lista de elementos
      let lista = crearContenedor("ul");
      //Recorremos cada uno de los objetos
      Object.values(caja).forEach((elementoCaja) => {
        //Creamos un li
        let elemento = document.createElement("li");
        //Creamos el span con el nombre
        let spanNombre = crearContenedor("span", {}, elementoCaja["nombre"]);
        //Creamos la imagen
        let imgProducto = crearContenedor("img", {
          src: elementoCaja["imagen_producto"],
          alt: elementoCaja["nombre"],
        });
        elemento.append(spanNombre, imgProducto);
        //Lo añadimos a la lista
        lista.append(elemento);
      });
      //Añadimso todo
      contenedorInfo.append(cabeceraCaja, lista);
      contenedorTarjeta.append(contendorImgCaja, contenedorInfo);
      //Lo añadimos al carrusel
      elementoCarrusel[respuestaJSON["cajas"].indexOf(caja)].append(
        contenedorTarjeta
      );
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Carga el último producto en el alert
 *
 * @return  {void}  No devuelve nada
 */
async function cargarAlertaUltProducto(contenedorAlerta) {
  try {
    //Iniciamos la petición
    const respuesta = await fetch("../php/tienda.php", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=utf-8;" },
      body: JSON.stringify({ ultimoProducto: 4 }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Creamos un div con últimas novedades
    let enlaceTienda = crearContenedor(
      "span",
      { id: "textoUltimasNov" },
      "Últimas novedades:"
    );
    contenedorAlerta.append(enlaceTienda);
    Object.values(respuestaJSON["productos"]).forEach((producto) => {
      //Creamos un enlace
      let enlaceTienda = crearContenedor(
        "a",
        { herf: "#" },
        producto["nombre"] + " " + producto["precio"] + "€"
      );
      contenedorAlerta.append(enlaceTienda);
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Carga los productos de la página principal
 *
 * @return  {void}  No devuelve nada
 */
async function cargarProductosMain() {
  try {
    //Iniciamos la petición
    const respuesta = await fetch("../php/tienda.php", {
      method: "POST",
      headers: { "Content-type": "application/json;charset=utf-8;" },
      body: JSON.stringify({ ultimoProducto: 3 }),
    });
    //Traducimos la respuesta
    const respuestaJSON = await respuesta.json();
    //Comprobamos que no diera error
    if (Object.hasOwn(respuestaJSON, "error")) {
      throw respuestaJSON["error"];
    }
    //Cogemos el contenedor de tienda
    let tienda = document.getElementById("tienda");
    //Limpiamos la tienda
    let elementosTienda = Array.from(
      tienda.querySelectorAll(".elementoTienda")
    );
    elementosTienda.forEach((elemento) => elemento.remove());
    //Creamos cada uno de los elemntos de la tienda
    Object.values(respuestaJSON["productos"]).forEach((producto) => {
      //Creamos el contenedor principal
      let contenedorElementoTienda = crearContenedor("div", {
        class: "elementoTienda",
      });
      //Creamos la tarjeta
      let tarjeta = document.createElement("div");
      //Creamos el contendor el id
      let contenedorID = crearContenedor("div", { class: "id" });
      let id = crearContenedor("div", {}, producto["id_producto"]);
      let triangulo = document.createElement("span");
      contenedorID.append(id, triangulo);
      //Creamos la imagne
      let imagen = crearContenedor("div", {
        class: "imagenTienda",
        "aria-label": producto["nombre"],
      });
      //Le añadimos la imagen
      imagen.style.backgroundImage = `url(${producto["imagen_producto"]})`;
      //Contenedor con el nombre y el precio
      let contenedorDesc = crearContenedor("div", {
        class: "descripcionCorta",
      });
      let parrafo = crearContenedor(
        "p",
        {},
        producto["nombre"] + " " + producto["precio"] + "€"
      );
      //Añadimos todo
      contenedorDesc.append(parrafo);
      tarjeta.append(contenedorID, imagen, contenedorDesc);
      //Creamos el botón
      let botonComprar = crearBoton("Comprar", {
        type: "button",
        class: "botonDesac",
      });
      // Añadimos a los botones la clase development
      botonComprar.classList.add("development");
      contenedorElementoTienda.append(tarjeta, botonComprar);
      tienda.append(contenedorElementoTienda);
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Crea la ventana de carga (Ahora mismo no funciona)
 *
 * @return  {void}  No devuelve nada
 */
function crearVentanaCarga() {
  let svgNamespace = "http://www.w3.org/2000/svg";
  let ventanaCarga = crearContenedor("div", { id: "ventanaCarga" });
  //Creamos el svg
  let svg = crearContenedor("svg");
  //Creamos la máscara
  let definicion = document.createElementNS(svgNamespace, "defs");
  let mascara = document.createElementNS(svgNamespace, "mask");
  mascara.setAttribute("id", "maskLogo");
  let titulo = document.createElementNS(svgNamespace, "title");
  titulo.textContent = "Clip del logo de la página";
  let desc = document.createElementNS(svgNamespace, "desc");
  let imagen = document.createElementNS(svgNamespace, "image");
  let atributosImagen = {
    x: 0,
    y: 0,
    href: "../img/mascaraLogo.svg",
    preserveAspectRatio: "xMidYMax meet",
  };
  asignarAtributos(imagen, atributosImagen);
  //Añadimo todo a la definicion
  mascara.append(titulo, desc, imagen);
  definicion.append(mascara);
  //Creamos el rectángulo
  let rectangulo = document.createElementNS(svgNamespace, "rect");
  let atributosRect = { x: 0, y: 0, mask: "url(#maskLogo)" };
  asignarAtributos(rectangulo, atributosRect);
  //Creamos el texto
  let texto = crearContenedor("text", { x: "30%", y: 280 }, "Cargando");
  svg.append(definicion, rectangulo, texto);
  ventanaCarga.append(svg);
  document.querySelector("body").append(ventanaCarga);
}

/**
 * Asigna los atributos al elemento
 *
 * @param   {DOMElement}  elemento   Elemento del DOM
 * @param   {Object}  atributos  Atributos de tipio {clave: valor}
 *
 * @return  {void}             No devuelve nada
 */
function asignarAtributos(elemento, atributos) {
  Object.entries(atributos).forEach((atributo) =>
    elemento.setAttribute(atributo[0], atributo[1])
  );
}

/**
 * Desactiva el scroll temporalmente
 *
 * @return  {void}  No devuelve nada
 */
function desactivarScroll() {
  //Creamos la pantalla de carga
  let ventanaCarga = document.getElementById("ventanaCarga");
  ventanaCarga.style.display = "block";
  ventanaCarga.style.top = window.scrollY + "px";
  // Para navegadores modernos de  Chrome que requieren { passive: false } al añadir un evento
  let supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}
  let wheelOpt = supportsPassive ? { passive: false } : false;
  let wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
  document.querySelector("body").style.overflow = "hidden";
  window.addEventListener("DOMMouseScroll", desactivarScrollRaton, false); // older FF
  window.addEventListener(wheelEvent, desactivarScrollRaton, wheelOpt); // modern desktop
  window.addEventListener("touchmove", desactivarScrollRaton, wheelOpt); // mobile
  window.addEventListener("keydown", desactivarScrollTeclas, false);
}

/**
 * Vuelve a activar el scroll
 *
 * @return  {void}  No devuelve nada
 */
function activarScroll() {
  //Eliminamos la pantalla de carga
  ventanaCarga.style.display = "none";
  // Para navegadores modernos de  Chrome que requieren { passive: false } al añadir un evento
  let supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}
  let wheelOpt = supportsPassive ? { passive: false } : false;
  let wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
  document.querySelector("body").style.overflowY = "auto";
  window.removeEventListener("DOMMouseScroll", desactivarScrollRaton, false); // older FF
  window.removeEventListener(wheelEvent, desactivarScrollRaton, wheelOpt); // modern desktop
  window.removeEventListener("touchmove", desactivarScrollRaton, wheelOpt); // mobile
  window.removeEventListener("keydown", desactivarScrollTeclas, false);
}

/**
 * Desactiva el scroll con las teclas
 *
 * @return  {mixed}  No devuelve nada o falso
 */
function desactivarScrollTeclas() {
  let teclas = { 37: 1, 38: 1, 39: 1, 40: 1 };
  //Comprovamos si es alguna de flecha arriba, fecha abajo o inicio final.
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

/**
 * Desactiva el scroll con la rueda del ratón
 *
 * @param   {Evento}  e  Evento que se dispara
 *
 * @return  {void}     No devuelve nada
 */
function desactivarScrollRaton(e) {
  e.preventDefault();
}
