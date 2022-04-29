class LVLGUIController {
    constructor(scene, gameconfig, level) {
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.scene = scene;
        this.lvl = level;
        this.gameconfig = gameconfig;
        //to avoid calling multiple times and overlap guis
        this.showinggui = false;

    }

    deathSound() {
        var sound = this.scene.assets.death
        sound.setVolume(0.3)
        sound.play()
    }

    createGameOverScreen() {
        this.showinggui = true;
        this.deathSound()
        var instance = this
        setTimeout(() => {
            instance.gameoverScreen()
        }, 1500)

    }

    gameoverScreen() {
        var instance = this;
        this.lvlcontroller.dispose();
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        var image = new BABYLON.GUI.Image("gameover", "images/Game Over.png");
        image.width = "700px";
        image.height = "200px";
        image.top = "-150px;"

        var retry = BABYLON.GUI.Button.CreateImageOnlyButton("retrybtn", "images/RetryButton.png");
        retry.width = "200px"
        retry.height = "100px";
        retry.cornerRadius = 10;
        retry.top = "70px;"

        retry.onPointerUpObservable.add(function () {
            let newlvl;
            instance.gameconfig.stats = Object.assign({}, instance.gameconfig.statsprev);
            switch (instance.lvl) {
                case "lvl1":
                    newlvl = new LVL1(instance.gameconfig);
                    break
                case "lvl2":
                    newlvl = new LVL2(instance.gameconfig);
                    break
                case "lvl3":
                    newlvl = new LVL3(instance.gameconfig);
                    break
                case "lvl4":
                    newlvl = new LVL4(instance.gameconfig);
                    break
            }
        });

        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/QuitButton.png");
        quit.width = "150px"
        quit.height = "100px";
        quit.top = "200px";
        quit.cornerRadius = 10;

        quit.onPointerUpObservable.add(function () {
            instance.gameconfig.createNewEngine()
            instance.gameconfig.newStats()
            new MainMenu(instance.gameconfig);
        });

        this.lvlcontroller.addControl(image);
        this.lvlcontroller.addControl(retry);
        this.lvlcontroller.addControl(quit);
    }

    createLevelClearScreen() {
        this.lvlcontroller.dispose();
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        this.showinggui = true;
        var instance = this;
        var image = new BABYLON.GUI.Image("lvlclear", "images/Level Clear.png");
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
            instance.gameconfig.statsprev = Object.assign({}, instance.gameconfig.stats);
            switch (instance.lvl) {
                case "lvl1":
                    //switch to lvl2
                    new LVL2(instance.gameconfig);
                    break
                case "lvl2":
                    //switch to lvl3
                    new LVL3(instance.gameconfig);
                    break
                case "lvl3":
                    //switch to lvl4
                    new LVL4(instance.gameconfig);
                    break
                case "lvl4":
                    //switch to lvl5
                    new LVL4(instance.gameconfig);
                    break
            }
        });

        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/QuitButton.png");
        quit.width = "150px"
        quit.height = "100px";
        quit.top = "200px";
        quit.cornerRadius = 10;

        quit.onPointerUpObservable.add(function () {
            instance.gameconfig.createNewEngine()
            new MainMenu(instance.gameconfig);

        });

        this.lvlcontroller.addControl(image);
        this.lvlcontroller.addControl(next);
        this.lvlcontroller.addControl(quit);
    }

    createTooltip(source, width, height) {
        this.lvlcontroller.dispose();
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        var image = new BABYLON.GUI.Image("tooltip", source);
        var panel = new BABYLON.GUI.StackPanel("panel");
        panel.top = "-350px;"

        this.lvlcontroller.addControl(panel);
        image.width = width;
        image.height = height;

        panel.addControl(image);
        setTimeout(this.removeTool, 8000, panel, image)
    }

    removeTool(panel, image) {
        panel.removeControl(image)
    }
}