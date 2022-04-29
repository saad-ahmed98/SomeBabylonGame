window.onload = startGame;

let gameconfig;

function startGame() {
    let divFps = document.getElementById("fps");
    let canvas = document.querySelector("#myCanvas");
    gameconfig = new GameConfig(canvas,divFps)
    gameconfig.newStats()
    new MainMenu(gameconfig);

}


window.addEventListener("resize", () => {
    gameconfig.engine.resize()
});


