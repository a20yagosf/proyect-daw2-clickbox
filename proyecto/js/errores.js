//Carga los script
cargarScripts();

window.onload = function () {
    //Añadimos el js de Bootstrap al final de body, lo hacemos aquí ya que necesitamos que esté la página cargada
    document.querySelector("body").append(crearScript({"src": "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js", "integrity": "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p", "crossorigin": "anonymous"}));
    //Le añadimos los eventos a los botones
    let botones = document.querySelectorAll("button");
    botones[0].addEventListener("click", () => history.back());
    botones[1].addEventListener("click", () => location.replace("../html/index.html"));
};