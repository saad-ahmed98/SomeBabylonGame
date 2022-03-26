
import GameConfig from "./GameConfig.js";
import LVL1 from "./LVL1.js";



window.onload = startGame;


function startGame() {
    Ammo().then(() => {
    let divFps = document.getElementById("fps");
    let canvas = document.querySelector("#myCanvas");
    //engine = new BABYLON.Engine(canvas, true);

    let gameconfig = new GameConfig(canvas,divFps)

    let lvl1 = new LVL1(gameconfig);
    })

}


/*
function swingSword(scene, player) {
    scene.assets.swordSwingSound.setPosition(player.position);
    scene.assets.swordSwingSound.play();

    isattacking = false;
}

*/

