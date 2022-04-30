window.onload = startGame;

let gameconfig;
let imageLoading="";
let titleLoading="";
let divFps;

function startGame() {
    let canvas = document.querySelector("#myCanvas");
    divFps= document.getElementById("fps");
    divFps.style.display = "none"
    gameconfig = new GameConfig(canvas,divFps)
    gameconfig.newStats()
    new MainMenu(gameconfig);

}


window.addEventListener("resize", () => {
    gameconfig.engine.resize()
});


