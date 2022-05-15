window.onload = startGame;

let gameconfig;
let imageLoading="";
let titleLoading="";
let divFps;
let divBarreJoueur;
let cyborg;

function startGame() {
    let canvas = document.querySelector("#myCanvas");
    divFps= document.getElementById("fps");
    divBarreJoueur= document.getElementById("progressbarWrapper");
    cyborg= document.getElementById("cyborg");

    gameconfig = new GameConfig(canvas,divFps)
    gameconfig.newStats()
    new MainMenu(gameconfig);

}


window.addEventListener("resize", () => {
    gameconfig.engine.resize()
});


