//Namespace para que no entre en conflicto la creación de los elementos de svg con javascript y los cree bien, por ello cada elemento se crea con createElementNS
let svgNamespace ="http://www.w3.org/2000/svg";

/**
 * Crea cada uno de los elementos del svg para la página principal
 */
function crearDetallesSvg() {
    //Cojo el svg
    let svg = document.getElementById("designPantalla");
    //getBoundingClientRect me devuelve un objeto rect que es el rectángulo más pequeño que contenga tanto padding como bordes del div suscripciones, de ahí saco su heigh y posición (x,y)
    let recuadroSusc = document.getElementById("suscripciones").getBoundingClientRect();
    let ySusc = (recuadroSusc.y - (recuadroSusc.height / 2) + 1);
    let xFinSusc = (recuadroSusc.width / 0.8) / 3;
    //Creamos cada uno de los elementos del svg
    //Creamos 3 circulos que se ponen encima del recuadro de suscripciones
    crearDisenho(0, recuadroSusc, svg);
    //Creamos 3 circulos
    let circulos = [ ["0", ySusc - 30, "60"],  [xFinSusc - 80, ySusc - 80, "40"],  [xFinSusc * 1.7, "150", "30"], [xFinSusc * 2, ySusc - 40, "60"]];
    circulos.forEach(valores => svg.append(crearCirculo(valores)));

    //Creamos los valores para la parte de abajo que será lo contrario al anterior
    crearDisenho(1, recuadroSusc, svg);
    //Rectángulo que contendrá el div de las suscripciones
    svg.append(crearRect(["0", (recuadroSusc.y - (recuadroSusc.height / 2))], recuadroSusc.height + "px"));


    //getBoundingClientRect me devuelve un objeto rect que es el rectángulo más pequeño que contenga tanto padding como bordes del div tienda, de ahí saco su heigh y posición (x,y)
    let recuadroTienda = document.getElementById("tienda").getBoundingClientRect();
    //Recuadro del main
    let mainRect = document.querySelector("main").getBoundingClientRect();
    //Rectángulo que contendrá el div de la tienda
    svg.append(crearRect(["0", recuadroTienda.y], (mainRect.height - mainRect.y) + "px"));
    //Le añado mas a la y de la tienda para que se acople al rectágulo
    recuadroTienda.y +=  recuadroTienda.height / 2;
    //Creo el diseño para la tienda
    crearDisenho(0, recuadroTienda, svg);
}

/**
 * Crea un circulo de svg con las propiedades que le creamos por cabecera y lo devuelve
 *
 * @param   {array}  valoresCirculo  Cada uno de los valores del circulo (cx, cy, r) cx -> Posición en x cy -> Posición en y r -> Radio
 *
 * @return  {NodeElement}                  Nodo del elemento circle creado
 */
function crearCirculo(valoresCirculo) {
    //Creo el elemento con NS ya que tengo que pasarle el namespace para que no entre en conflicto
    let circulo = document.createElementNS(svgNamespace, "circle");
    //Array con las propiedades del circulo
    let propCirculo = ["cx", "cy", "r"];
    for(let i = 0; i < propCirculo.length; i++){
        circulo.setAttribute(propCirculo[i], valoresCirculo[i]);
    }
    return circulo;
}

function crearPath(valorD, clase = null) {
    //Creo el elemento con NS ya que tengo que pasarle el namespace para que no entre en conflicto
    let recorrido = document.createElementNS(svgNamespace, "path");
    //Le asigno la propiedad para el recorrido
    recorrido.setAttribute("d", valorD);
    if(clase != null ) {
        recorrido.setAttribute("class", clase);
    }
    
    return recorrido;
}

function crearDisenho(direccion, elementoRef, svg) {
    let banderas = !direccion ? [1, 0] : [0, 1];
    let xSusc = 0;
    //Calculo su Y mediante la altura del heigh del recuadro de suscr
    let ySusc = !direccion ? (elementoRef.y - (elementoRef.height / 2) + 1) : elementoRef.y + elementoRef.height/2;
    let xFinSusc = (elementoRef.width / 0.8) / 3;
    curvatura = !direccion ? xFinSusc : xFinSusc - (130 * 2);
    let restaCurvatura = 80;
    let desplazamiento = 95;
    //Diferencia que le quitaremos para hacer el recuadro que restaremos más pequeño
    //A la vez que creamos los rectámngulos creamos también los que los "restarán" con la clase restar
    for(let i = 0; i < 3; i++){
        let lineaPath = `M${xSusc}, ${ySusc} a${curvatura}, ${curvatura} 0 0, ${banderas[0]} ${xFinSusc}, 0 Z`;
        svg.append(crearPath(lineaPath));
        //Diferencia que le quitaremos para hacer el recuadro que restaremos más pequeño
        let curvaturaResta = `M${xSusc + restaCurvatura}, ${ySusc} a${curvatura - restaCurvatura}, ${curvatura - restaCurvatura} 0 0, ${banderas[0]} ${xFinSusc - restaCurvatura * 2}, 0 l-${desplazamiento}, 0 a${curvatura - desplazamiento - restaCurvatura}, ${curvatura - desplazamiento - restaCurvatura} 0 0, ${banderas[1]} -${(xFinSusc - desplazamiento)/2}, -0 z`;
        svg.append(crearPath(curvaturaResta, "restar"));
        !direccion ? curvatura -= 130 : curvatura += 130;
        restaCurvatura -= 10;
        desplazamiento += 30;
        xSusc += xFinSusc;
        xFinSusc += i % 2 != 0 ? 10 : 30;
    }
}

/**
 * Crear un elemento rectángulo y lo devuelve para añadirlo al svg
 *
 * @param   {array}  $valorProp  Array con cada uno de los valores de las propiedades (x, y)
 *
 * @return  {NodeElement}              Devuelve el nodo del DOM creado con el rectángulo
 */
function crearRect(valorProp, height) {
    //Creo el elemento con NS ya que tengo que pasarle el namespace para que no entre en conflicto
    let rectangulo = document.createElementNS(svgNamespace, "rect");
    //Array con las propiedades del rectángulo
    let propRect = ["x", "y"];
    //Recorro el array de propiedades para asignarle cada propeidad con su valor
    propRect.forEach(elemento => {
        rectangulo.setAttribute(elemento, valorProp[propRect.indexOf(elemento)]);
    });
    //Le asigno el valor del height tanto como alto es el div suscripciones
    rectangulo.style.height = height;
    return rectangulo;
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


window.onload = function () {
    crearDetallesSvg();
    crearMapa();
};