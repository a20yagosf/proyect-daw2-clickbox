let svgNamespace ="http://www.w3.org/2000/svg";


function pintarArco() {
    let svg = document.querySelector("svg");
    //Cojo el div de referencia
    let ref = document.getElementById("prueba").getBoundingClientRect();
    //Distancia máxima (Al principio del circulo) para ello cojo cuanto ocupa el rectángulo de referencia
    let x2 = ref.width/ 3;
    //Posición inicial de x
    let mX = 0;
    //Máximo que puede tener de curvatura
    let maxC = 20;
    //Distancia que habrá entre cada circulo
    let distanciaCirculos =  x2;
    //Cuanto de diferencia dejo entre un arco y el otro
    let gordura = 50;
    //Cuanto va aumentando cada circulo
    let aumento = 100;
    //Bucle para hacer 3 diseños
    for(let i = 0; i < 3; i++){
        //Posición en y del arco, le sumo el scroll para que me dé su posición global en toda la pantalla, si no hago esto sólo afectará al viewport y si la página ocupa más el diseño se romperá
        let mY = ref.y + window.scrollY + ref.height;
        //Curvatura que tendrá el circulo para ser un arco perfecto
        //let curvatura = x2 / 2;
        let curvatura = maxC;
        //Altura a la que empezará, calculo si se pasa de la altura máxima, si se pasa le bajo la diferencia
        //mY += (mY + x2 / 2 <= maxC) ? 0 :  (x2/2 - maxC);
        //Creo su atributo "d"
        let d = `M${mX}, ${mY} a${curvatura}, ${curvatura / 2} 0 0, 1 ${x2}, 0 Z`;
        //Creo todo con los atributos que quiero
        svg.append(crearPath({"d": d, "stroke": "red", "stroke-width": "3", "fill": "none"}));
        //Final curva interior
        let x2Int = x2 - gordura * 2;
        //Curvatura del arco interior
        let curvatura2 = (x2 - x2Int)/ 2;
        curvatura2 = (curvatura * x2Int) / x2;
        //Creo el path interior, la bandera (El 1 despues de 0, significa la dirección hacia donde irá el arco si vamos de izquierda a derecha 1 significa arriba y 0 abajo, si vamos de derecha a izquierda es al contrario)
        let d2 =  `M${mX + gordura}, ${mY} a${curvatura2}, ${curvatura2 / 2} 0 0, 1 ${x2Int}, 0 l${-gordura}, 0 a${(curvatura2 *(x2Int - gordura * 2))/curvatura}, ${((curvatura2 * (x2Int - gordura * 2))/curvatura)/2} 0 0, 0 -${x2Int - gordura * 2}, 0 Z`;
        //Creo el segundo arco con sus atributos
        svg.append(crearPath({"d": d2, "stroke": "red", "stroke-width": "3", "fill": "lightyellow"}));
        //Sumo el x2 para que sean todos un poco más grande
        x2 +=aumento;
        mX += distanciaCirculos - aumento;
        maxC += 50;
    }
}

function pruebaDesign() {
    //Busco el recuadro donde quiero crearlo
    let recuadroSus = document.getElementById("prueba").getBoundingClientRect();
    //Creo su diseño
    crearDesignPath(recuadroSus.width/2.8, 0, recuadroSus.y, 90, 90, 0.2, true);
    crearDesignPath(recuadroSus.width/3, recuadroSus.width/2.8 - 15, recuadroSus.y, 75, 75, 0.35, true);
    crearDesignPath(recuadroSus.width/3, recuadroSus.width/2.8 - 15 + recuadroSus.width/3, recuadroSus.y, 50, 50, 0.5, true);
    //Creo los circulos
    crearCirculo([0, recuadroSus.y - 30, 60]);
    crearCirculo([recuadroSus.width/3.1, recuadroSus.y - 100, 25]);
    crearCirculo([recuadroSus.width/2.8 - 10 + recuadroSus.width/3, recuadroSus.y - 40, 45]);
    crearCirculo([recuadroSus.width/3.2 + recuadroSus.width/3, recuadroSus.y - 120, 15]);
    //Creo la parte inferior
    crearDesignPath(recuadroSus.width/2.5, -recuadroSus.width/5, recuadroSus.y + recuadroSus.height - 1, 120, 50, 0.8, false);
    crearDesignPath(recuadroSus.width/2.3, recuadroSus.width/2.3 - recuadroSus.width/5, recuadroSus.y + recuadroSus.height/2 - 1, 75, 50, 0.7, false);
    crearDesignPath(recuadroSus.width/2.7, recuadroSus.width/2.3 - recuadroSus.width/5 + recuadroSus.width/2.3, recuadroSus.y/2 + recuadroSus.height - 1, 90, 90, 0.5, false);
    //Creo los circulos
    crearCirculo([recuadroSus.width/2.35 - recuadroSus.width/5, recuadroSus.y + recuadroSus.height - 1, 80]);
    crearCirculo([recuadroSus.width/2.3 - recuadroSus.width/5 + recuadroSus.width/2.25, recuadroSus.y + recuadroSus.height/1.3, 80]);
    crearCirculo([recuadroSus.width/2.3 - recuadroSus.width/5 + recuadroSus.width/2.25, recuadroSus.y + recuadroSus.height + 100, 30]);
    crearRect([0, recuadroSus.y], 200, recuadroSus.width);
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
function crearDesign(numArcos, width, posY, gordura, curv, aumento, arriba) {
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

function crearDesignPath(width, mX, posY, gordura, gorduraInt, curv, arriba) {
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
     svg.append(crearPath({"d": d, "fill": "orange"}));
     //Creo el segúndo arco que restará al primero
     let d2 = `M${mX + gordura}, ${mY} a1, ${curv} 0 0, ${banderas[0]} ${x2 - gordura * 2}, 0 l-${gorduraInt}, 0 a1, ${curvInt} 0 0, ${banderas[1]} -${x2Int - gorduraInt * 2}, 0  Z`;
    svg.append(crearPath({"d": d2, "fill": "white"}));
}

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
    circulo.setAttribute("fill", "orange");
    svg.append(circulo);
}

/**
 * Crear un elemento rectángulo y lo devuelve para añadirlo al svg
 *
 * @param   {array}  $valorProp  Array con cada uno de los valores de las propiedades (x, y)
 *
 * @return  {NodeElement}              Devuelve el nodo del DOM creado con el rectángulo
 */
 function crearRect(valorProp, height, width) {
     //Busco el svg
    let svg = document.querySelector("svg");
    //Creo el elemento con NS ya que tengo que pasarle el namespace para que no entre en conflicto
    let rectangulo = document.createElementNS(svgNamespace, "rect");
    //A la y le sumo el scroll para que sea de manera global
    valorProp[1] += window.scrollY;
    //Array con las propiedades del rectángulo
    let propRect = ["x", "y"];
    //Recorro el array de propiedades para asignarle cada propeidad con su valor
    propRect.forEach(elemento => {
        rectangulo.setAttribute(elemento, valorProp[propRect.indexOf(elemento)]);
    });
    //Le asigno el valor del height tanto como alto es el div suscripciones
    rectangulo.style.height = height;
    rectangulo.style.width = width;
    rectangulo.setAttribute("fill", "orange");
    svg.append(rectangulo);
}

window.onload= pruebaDesign;