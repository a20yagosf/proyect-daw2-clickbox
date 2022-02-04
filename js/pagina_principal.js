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
    //Creo cada uno de los elementos del svg
    //Creo 3 circulos que se ponen encima del recuadro de suscripciones
    let xSusc = 0;
    //Calculo su Y mediante la altura del heigh del recuadro de suscr
    let ySusc = (recuadroSusc.y - (recuadroSusc.height / 2) + 1);
    let xFinSusc = (recuadroSusc.width / 0.8) / 3;
    //A la vez que creamos los rectámngulos creamos también los que los "restarán" con la clase restar
    for(let i = 0; i < 3; i++){
        let curvatura = i % 2 != 0 ? xFinSusc - 200 : xFinSusc;
        let lineaPath = `M${xSusc}, ${ySusc} a${curvatura}, ${curvatura} 0 0, 1 ${xFinSusc}, 0 Z`;
        svg.append(crearPath(lineaPath));
        //Diferencia que le quitaremos para hacer el recuadro que restaremos más pequeño
        let restaCurvatura = 130;
        let curvaturaResta = `M${xSusc + restaCurvatura}, ${ySusc} a${curvatura - restaCurvatura}, ${curvatura - restaCurvatura} 0 0, 1 ${xFinSusc - restaCurvatura * 2}, 0 Z l50, 0 a${(xFinSusc - restaCurvatura / 2 + 250)}, ${(xFinSusc + restaCurvatura / 2 - 50)} 0 0, 0, -${xFinSusc + restaCurvatura}, -0 z`;
        svg.append(crearPath(curvaturaResta, "restar"));
        xSusc += xFinSusc;
    }
    
    //Rectángulo que contendrá el div de las suscripciones
    svg.append(crearRect(["0", (recuadroSusc.y - (recuadroSusc.height / 2))], recuadroSusc.height + "px"));


    //getBoundingClientRect me devuelve un objeto rect que es el rectángulo más pequeño que contenga tanto padding como bordes del div tienda, de ahí saco su heigh y posición (x,y)
    let recuadroTienda = document.getElementById("tienda").getBoundingClientRect();
    //Recuadro del main
    let mainRect = document.querySelector("main").getBoundingClientRect();
    //Rectángulo que contendrá el div de la tienda
    svg.append(crearRect(["0", recuadroTienda.y], (mainRect.height - mainRect.y) + "px"));
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
        propCirculo.setAttribute(propCirculo, valoresCirculo);
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
        recorrido.setAttribute("stroke", "red");
        recorrido.setAttribute("stroke-width", "3");
    }
    
    return recorrido;
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


window.onload = crearDetallesSvg;