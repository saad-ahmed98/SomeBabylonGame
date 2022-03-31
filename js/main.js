window.onload = startGame;

let gameconfig;

function startGame() {
    Ammo().then(() => {
    let divFps = document.getElementById("fps");
    let canvas = document.querySelector("#myCanvas");

    gameconfig = new GameConfig(canvas,divFps)
    new MainMenu(gameconfig);


    })

}


window.addEventListener("resize", () => {
    gameconfig.engine.resize()
});

/*
function swingSword(scene, player) {
    scene.assets.swordSwingSound.setPosition(player.position);
    scene.assets.swordSwingSound.play();

    isattacking = false;
}

*/

