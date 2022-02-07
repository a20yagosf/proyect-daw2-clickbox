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
    let maxC = 30;
    //Distancia que habrá entre cada circulo
    let distanciaCirculos =  x2;
    //Cuanto de diferencia dejo entre un arco y el otro
    let gordura = 50;
    //Cuanto va aumentando cada circulo
    let aumento = 100;
    //Bucle para hacer 3 diseños
    for(let i = 0; i < 3; i++){
        //Posición en y del arco, le sumo el scroll para que me dé su posición global en toda la pantalla, si no hago esto sólo afectará al viewport y si la página ocupa más el diseño se romperá
        let mY = ref.y + window.scrollY;
        //Altura a la que empezará, calculo si se pasa de la altura máxima, si se pasa le bajo la diferencia
        mY += (mY + x2 / 2 <= maxC) ? 0 :  (x2/2 - maxC);
        //Curvatura que tendrá el circulo para ser un arco perfecto
        let curvatura = x2 / 2;
        //Creo su atributo "d"
        let d = `M${mX}, ${mY} a${curvatura}, ${curvatura} 0 0, 1 ${x2}, 0 Z`;
        //Creo todo con los atributos que quiero
        svg.append(crearPath({"d": d, "stroke": "red", "stroke-width": "3", "fill": "none"}));
        //Final curva interior
        let x2Int = x2 - gordura * 2;
        //Curvatura del arco interior
        let curvatura2 = (x2 - x2Int)/ 2;
        //Creo el path interior, la bandera (El 1 despues de 0, significa la dirección hacia donde irá el arco si vamos de izquierda a derecha 1 significa arriba y 0 abajo, si vamos de derecha a izquierda es al contrario)
        let d2 =  `M${mX + gordura}, ${mY} a${curvatura2}, ${curvatura2} 0 0, 1 ${x2Int}, 0 l${-gordura}, 0 a${(x2Int - gordura * 2)/2}, ${(x2Int - gordura * 2)/2} 0 0, 0 -${x2Int - gordura * 2}, 0 Z`;
        //Creo el segundo arco con sus atributos
        svg.append(crearPath({"d": d2, "stroke": "red", "stroke-width": "3", "fill": "lightyellow"}));
        //Sumo el x2 para que sean todos un poco más grande
        x2 +=aumento;
        mX += distanciaCirculos - aumento;
        maxC += 100;
    }


}

function crearPath(atributos) {
    //Creo el path
    let path = document.createElementNS(svgNamespace, "path");
    Object.entries(atributos).forEach(elemento => path.setAttribute(elemento[0], elemento[1]));
    return path;
}

window.onload= pintarArco;