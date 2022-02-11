//Namespace para que no entre en conflicto la creación de los elementos de svg con javascript y los cree bien, por ello cada elemento se crea con createElementNS
let svgNamespace ="http://www.w3.org/2000/svg";

/**
 * Crea cada uno de los elementos del svg para la página principal
 */
function crearDetallesSvg() {
    //Creamos cada uno de los elementos del svg
    //Creamos 3 circulos que se ponen encima del recuadro de suscripciones
    crearDisenhoSuscripciones();

    //getBoundingClientRect me devuelve un objeto rect que es el rectángulo más pequeño que contenga tanto padding como bordes del div tienda, de ahí saco su heigh y posición (x,y)
   /* let recuadroTienda = document.getElementById("tienda").getBoundingClientRect();
    //Recuadro del main
    let mainRect = document.querySelector("main").getBoundingClientRect();
    //Rectángulo que contendrá el div de la tienda
    svg.append(crearRect(["0", recuadroTienda.y], (mainRect.height - mainRect.y) + "px"));
    //Le añado mas a la y de la tienda para que se acople al rectágulo
    recuadroTienda.y +=  recuadroTienda.height / 2;
    //Creo el diseño para la tienda
    crearDisenho(0, recuadroTienda, svg);*/
}


/**
 * Crea un diseño de X número de arcos con circulos flotanto al rededor
 *
 * @param   {int}  numArcos  Número de arcos que queremos tener
 * @param   {float}  width     Cuanto ancho tenemos para ocupar (Suele ser el mismo que el width del elemento de referencia)
 * @param   {float}  posY      Posición en Y (Suele ser el y del objeto o su y + height)
 * @param   {int}  gordura   Cuanto de ancho es la diferencia de un arco a otro
 * @param   {int}  curv      Curvatura que tendrá
 * @param   {int}  difCurv   Diferencia entre la curvatura de X e Y (dividiremos cur/difCurv para ver cuanto de alto tiene la curva si es 1 el arco será perfecto como la mitad de un circulo)
 * @param   {int}  aumento   Cuanto vamos a ir aumentando de un arco a otro a la curvatura para que se vea más grande (si queremos que vaya de mayor a menor debemos ponerlo en negativo)
 * @param   {bool}  arriba    Si la dirección es superior o inferior
 */
 function crearPatron(numArcos, width, posY, gordura, curv, aumento, arriba) {
    //Busco el svg
    let svg = document.querySelector("svg");
    /**
     * Sirve para marcar en que sentido se crean los arcos
     * De izquierda a derecha --> 0 abajo  -    1 arriba
     * De derecha a izquierda <--- 0 arriba  -   1 abajo
     */ 
    let banderas = arriba ? [1, 0] : [0, 1];
    //Calculo cada una de sus propiedades
    //Distancia máxima (Al principio del circulo) para ello cojo cuanto ocupa el rectángulo de referencia
    let x2 = width/ 3;
    //Posición inicial de x
    let mX = 0;
    //Posición en y del arco, le sumo el scroll para que me dé su posición global en toda la pantalla, si no hago esto sólo afectará al viewport y si la página ocupa más el diseño se romperá
    let mY = posY + window.scrollY;
    //Para cada circulo
    for(let i = 0; i < numArcos; i++){
        //Calculo donde esta el x2 del arco interior (punto más alejado)
        let x2Int = x2 - gordura * 2;
        //Curvatura del arco interior
        let curvInt = (curv * x2Int)/ x2;
        //Creo su atributo "d"
        let d = `M${mX}, ${mY} a1, ${curv} 0 0, ${banderas[0]} ${x2}, 0 Z`;
        //Creo todo con los atributos que quiero
        svg.append(crearPath({"d": d, "fill": "orange"}));
        let d2 = `M${mX + gordura}, ${mY} a1, ${curv} 0 0, ${banderas[0]} ${x2 - gordura * 2}, 0 l-${gordura}, 0 a1, ${curvInt} 0 0, ${banderas[1]} -${x2Int - gordura * 2}, 0  Z`;
        svg.append(crearPath({"d": d2, "fill": "white"}));
        //Miramos que no sea el primero y creamos circulos en las uniones
        if(i != 0){
            svg.append(crearCirculo([mX, mY - curv, 30]));
        }
        //Muevo el punto de inicio al final del anterior
        mX += x2;
        curv += aumento;
    }
}

/**
 * Crea un patron de manera NO procimental (arco a arco) para el recuadro de suscripciones
 *
 */
function crearDisenhoSuscripciones() {
    //Buscamo el recuadro de suscripciones y le cogemos los puntos de referencia
    let recuadroSusc = document.getElementById("suscripciones").getBoundingClientRect();
    //Creamos los circulos
    crearCirculo([10, recuadroSusc.y - recuadroSusc.height/1.5, 60]);
    crearCirculo([recuadroSusc.width/2.2, recuadroSusc.y - recuadroSusc.height/1.2, 30]);
    crearCirculo([recuadroSusc.width/1.13, recuadroSusc.y - recuadroSusc.height/1.2, 70]);
    crearCirculo([recuadroSusc.width/1.25, recuadroSusc.y/4, 15]);
    //Creamos su diseño
    crearDisenhoPath(recuadroSusc.width/2, 0, recuadroSusc.y - recuadroSusc.height/3, 60, 30, 0.4, true);
    crearDisenhoPath(recuadroSusc.width/2.2, recuadroSusc.width/2.3, recuadroSusc.y - recuadroSusc.height/2, 75, 75, 0.5, true);
    crearDisenhoPath(recuadroSusc.width/2, recuadroSusc.width/1.2, recuadroSusc.y, 50, 25, 1, true);
    //Creamos la parte inferior
    crearDisenhoPath(recuadroSusc.width/2, -recuadroSusc.width/5, recuadroSusc.y + recuadroSusc.height - 1, 120, 50, 0.8, false);
    crearDisenhoPath(recuadroSusc.width/2.3, recuadroSusc.width/2.3 - recuadroSusc.width/5, recuadroSusc.y + recuadroSusc.height/2 - 1, 75, 50, 0.7, false);
    crearDisenhoPath(recuadroSusc.width/2.7, recuadroSusc.width/2.3 - recuadroSusc.width/5 + recuadroSusc.width/2.3, recuadroSusc.y/2 + recuadroSusc.height - 1, 90, 90, 0.5, false);
    //Creamos el rectángulo
    crearRect([0, recuadroSusc.y/1.8], recuadroSusc.height);
    //Creamos los circulos
    /*crearCirculo([recuadroSus.width/2.35 - recuadroSus.width/5, recuadroSus.y + recuadroSus.height - 1, 80]);
    crearCirculo([recuadroSus.width/2.3 - recuadroSus.width/5 + recuadroSus.width/2.25, recuadroSus.y + recuadroSus.height/1.3, 80]);
    crearCirculo([recuadroSus.width/2.3 - recuadroSus.width/5 + recuadroSus.width/2.25, recuadroSus.y + recuadroSus.height + 100, 30]);
    crearRect([0, recuadroSus.y], 200, recuadroSus.width);*/
}


/**
 * Crea un arco con un arco interior que lo "resta" gracias a las medidas que le mandamos
 *
 * @param   {float}  width       Ancho del arco
 * @param   {float}  mX          Punto de inicio del arco en la coordenada X
 * @param   {float}  posY        Punto de inicio del arco en la coordenada Y
 * @param   {float}  gordura     Cuanta distancia hay entre el arco exterior e interior
 * @param   {float}  gorduraInt  Cuanta distancia hay en el el arco interior y el interiore a ese
 * @param   {float}  curv        Curvatura que tendrá el arco (Va de 0.1 a 1 donde 1 es curvatura perfecta)
 * @param   {bool}  arriba      Si la dirección del arco debe ser superior o inferior (true superior false inferior)
 *
 */
function crearDisenhoPath(width, mX, posY, gordura, gorduraInt, curv, arriba) {
    //Busco el svg
    let svg = document.querySelector("svg");
    /**
     * Sirve para marcar en que sentido se crean los arcos
     * De izquierda a derecha --> 0 abajo  -    1 arriba
     * De derecha a izquierda <--- 0 arriba  -   1 abajo
     */ 
     let banderas = arriba ? [1, 0] : [0, 1];
    //Calculo cada una de sus propiedades
    //Distancia máxima (Al principio del circulo) para ello cojo cuanto ocupa el rectángulo de referencia
    let x2 = width;
    //Posición en y del arco, le sumo el scroll para que me dé su posición global en toda la pantalla, si no hago esto sólo afectará al viewport y si la página ocupa más el diseño se romperá
    let mY = posY + window.scrollY;
    //Calculo donde esta el x2 del arco interior (punto más alejado)
    let x2Int = x2 - gordura * 2;
    //Curvatura del arco interior
    let curvInt = (curv * x2Int)/ x2;
     //Creo su atributo "d"
     let d = `M${mX}, ${mY} a1, ${curv} 0 0, ${banderas[0]} ${x2}, 0 Z`;
     //Creo todo con los atributos que quiero
     svg.append(crearPath({"d": d}));
     //Creo el segúndo arco que restará al primero
     let d2 = `M${mX + gordura}, ${mY} a1, ${curv} 0 0, ${banderas[0]} ${x2 - gordura * 2}, 0 l-${gorduraInt}, 0 a1, ${curvInt} 0 0, ${banderas[1]} -${x2Int - gorduraInt * 2}, 0  Z`;
    svg.append(crearPath({"d": d2, "class": "restar"}));
}


/**
 * Crea un elemento path de acuerdo a los atributos pasados el array mínimo debe contener el atributo d
 *
 * @param   {aray}  atributos  Array con cada uno de los atributos que queremos asignarle (mínimo el atributo d)
 *
 * @return  {DOMElement}             Elemento path creado
 */
function crearPath(atributos) {
    //Creo el path
    let path = document.createElementNS(svgNamespace, "path");
    Object.entries(atributos).forEach(elemento => path.setAttribute(elemento[0], elemento[1]));
    return path;
}

/**
 * Crea un circulo de svg con las propiedades que le creamos por cabecera y lo devuelve
 *
 * @param   {array}  valoresCirculo  Cada uno de los valores del circulo (cx, cy, r) cx -> Posición en x cy -> Posición en y r -> Radio
 */
 function crearCirculo(valoresCirculo) {
    //Busco el svg
   let svg = document.querySelector("svg");
   //Creo el elemento con NS ya que tengo que pasarle el namespace para que no entre en conflicto
   let circulo = document.createElementNS(svgNamespace, "circle");
   //Al atributo y le sumo el scroll para que sea de foma global en toda la página
   valoresCirculo[1] +=  window.scrollY;
   //Array con las propiedades del circulo
   let propCirculo = ["cx", "cy", "r"];
   for(let i = 0; i < propCirculo.length; i++){
       circulo.setAttribute(propCirculo[i], valoresCirculo[i]);
   }
   //Le pongo el color
   svg.append(circulo);
}


/**
 * Crear un elemento rectángulo y lo devuelve para añadirlo al svg
 *
 * @param   {array}  $valorProp  Array con cada uno de los valores de las propiedades (x, y)
 *
 * @return  {NodeElement}              Devuelve el nodo del DOM creado con el rectángulo
 */
 function crearRect(valorProp, height) {
    //Busco el svg
   let svg = document.querySelector("svg");
   //Creo el elemento con NS ya que tengo que pasarle el namespace para que no entre en conflicto
   let rectangulo = document.createElementNS(svgNamespace, "rect");
   //A la y le sumo el scroll para que sea de manera global
   valorProp[1] = valorProp[1] + window.scrollY;
   //Array con las propiedades del rectángulo
   let propRect = ["x", "y"];
   //Recorro el array de propiedades para asignarle cada propeidad con su valor
   propRect.forEach(elemento => {
       rectangulo.setAttribute(elemento, valorProp[propRect.indexOf(elemento)]);
   });
   //Le asigno el valor del height tanto como alto es el div suscripciones
   rectangulo.style.height = height + "px";
   svg.append(rectangulo);
}

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
 * Crea la cabecera de la página mediante el DOM
 *
 */
function crearCabecera() {
    //Creamos el header
    let cabecera = document.createElement("header");
    //Creamos el div para la alert
    let alerta = document.createElement("div");
    //Creamos su id y texto
    alerta.setAttribute("id", "alerta");
    alerta.textContent = "Último artículo añadido a la BD";
    let logo = crearImg({"src": "../img/Recuadro.png", "alt": "Logo de clickBox"});
    //Creamos el nav
    let navegador = crearNav(["index.html", "suscripciones.html", "#", "#", "login.html"],[logo, "Suscripciones", "Partidas", "Tienda", "Registrarse/Loguearse"]);
    //Añadimos la alerta y el nav a la cabecera
    cabecera.append(alerta, navegador);
    //Añadimos la cabecera al inicio del body
    let cuerpo = document.querySelector("body");
    cuerpo.insertBefore(cabecera, cuerpo.firstChild);
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
    console.log(elementosNav);
    //Creamos el nav
    let navegador = document.createElement("nav");
    //Creamos el ul
    let lista = document.createElement("ul");
    //Convertimos el objeto a un array de arrays con clave y valor, para cada uno de los elementos del Nav creamos un enlace y un li
    elementosNav.forEach(elemento => {
        //Creamos el li
        let elementoLista = document.createElement("li");
        //Creamos el enlace
        let enlace = document.createElement("a");
        //Añadimos el elemento al enlace
        enlace.append(elemento);
        //Le añadimos el href
        enlace.setAttribute("href", redireccion[elementosNav.indexOf(elemento)]);
        //Añadimos el a al elemento listo y este a la lista
        elementoLista.append(enlace);
        lista.append(elementoLista);
    });
    //Añadimos la lista al navegador
    navegador.append(lista);
    return navegador;
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
    //Le añadimos sus atributos a la imagen
    Object.entries(atributos).forEach(atributo => {
        imagen.setAttribute(atributo[0], atributo[1]);
    });
    return imagen;
}

/**
 * <header>
        <div id="alerta">Último artículo añadido a la BD</div>
        <nav>
            <ul>
                <li><a href="#"><img src="../img/Recuadro.png" alt="Logo página"></a></li>
                <li><a href="#">Suscripciones</a></li>
                <li><a href="#">Partidas</a></li>
                <li><a href="#">Tienda</a></li>
                <li><a href="#">Registrarse/Loguearse</a></li>
            </ul>
        </nav>
        <!-- <div id="localizacionPag">
            <ul>
                <li><a href="#">Página principal</a> <</li>
                <li><a href="#">Partida nº 255</a></li>
            </ul>
        </div>-->
    </header>
 */


window.onload = function () {
    //crearDetallesSvg();
    crearCabecera();
    crearMapa();
};