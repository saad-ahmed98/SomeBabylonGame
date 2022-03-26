import LVL1 from "./LVL1.js";

export default class LVLGUIController {
    constructor(scene, gameconfig, level) {
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.lvl = level;
        this.gameconfig = gameconfig;
        //to avoid calling multiple times and overlap guis
        this.showinggui = false;

    }

    createGameOverScreen() {
        this.showinggui = true;
        var instance = this;
        var image = new BABYLON.GUI.Image("gameover", "/images/Game Over.png");
        image.width = "700px";
        image.height = "200px";
        image.top = "-150px;"

        var retry = BABYLON.GUI.Button.CreateImageOnlyButton("retrybtn", "images/RetryButton.png");
        retry.width = "200px"
        retry.height = "100px";
        retry.cornerRadius = 10;
        retry.top = "70px;"

        retry.onPointerUpObservable.add(function () {
            instance.gameconfig.createNewEngine()
            let newlvl;
            switch(instance.lvl){
                case "lvl1":
                    newlvl = new LVL1(instance.gameconfig);
            }
        });

        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/QuitButton.png");
        quit.width = "150px"
        quit.height = "100px";
        quit.top = "200px";
        quit.cornerRadius = 10;

        quit.onPointerUpObservable.add(function () {
            alert("nothing happens yet")
        });

        this.lvlcontroller.addControl(image);
        this.lvlcontroller.addControl(retry);
        this.lvlcontroller.addControl(quit);
    }

    createLevelClearScreen() {
        this.showinggui = true;
        var instance = this;
        var image = new BABYLON.GUI.Image("lvlclear", "/images/Level Clear.png");
        image.width = "700px";
        image.height = "200px";
        image.top = "-150px;"

        var next = BABYLON.GUI.Button.CreateImageOnlyButton("nextbtn", "images/NextButton.png");
        next.width = "200px"
        next.height = "100px";
        next.cornerRadius = 10;
        next.top = "70px;"

        next.onPointerUpObservable.add(function () {
            instance.gameconfig.createNewEngine()
            let newlvl;
            switch(instance.lvl){
                case "lvl1":
                    //switch to lvl2, still unimplemented
                    newlvl = new LVL1(instance.gameconfig);
            }
        });

        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/QuitButton.png");
        quit.width = "150px"
        quit.height = "100px";
        quit.top = "200px";
        quit.cornerRadius = 10;

        quit.onPointerUpObservable.add(function () {
            alert("nothing happens yet")
        });

        this.lvlcontroller.addControl(image);
        this.lvlcontroller.addControl(next);
        this.lvlcontroller.addControl(quit);
    }
    
}