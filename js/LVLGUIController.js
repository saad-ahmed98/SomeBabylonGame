class LVLGUIController {
    constructor(scene, gameconfig, level) {
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.scene = scene;
        this.lvl = level;
        this.gameconfig = gameconfig;
        //to avoid calling multiple times and overlap guis
        this.showinggui = false;
        //this.escapeState=false;
        this.isPaused = false;
        this.timerPause = false;
        this.canPause = true;

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

    //on donne la possibilité d'enlever l'écran de pause que quelque secondes après appuye de la touche echappe
    timerPauseActivate() {
        var instance = this
        setTimeout(() => {
            if (instance.showinggui)
                instance.timerPause = true
        }, 500)
    }

    canPauseActivate() {
        var instance = this
        setTimeout(() => {
            instance.canPause = true
        }, 500)
    }

    gameoverScreen() {
        var instance = this;
        this.lvlcontroller.dispose();
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        var image = new BABYLON.GUI.Image("gameover", "images/common/Game Over.png");
        image.width = "800px";
        image.height = "170px";
        image.top = "-150px;"

        var retry = BABYLON.GUI.Button.CreateImageOnlyButton("retrybtn", "images/common/RetryButton.png");
        retry.width = "200px"
        retry.height = "100px";
        retry.cornerRadius = 10;
        retry.top = "70px;"

        retry.onPointerUpObservable.add(function () {
            let newlvl;
            instance.gameconfig.stats = Object.assign({}, instance.gameconfig.statsprev);
            document.getElementById("cyborg").style.display="none";
            switch (instance.lvl) {
                case "lvl1":
                    newlvl = new LVL1(instance.gameconfig, false);
                    break
                case "lvl2":
                    newlvl = new LVL2(instance.gameconfig, false);
                    break
                case "lvl3":
                    newlvl = new LVL3(instance.gameconfig, false);
                    break
                case "lvl4":
                    newlvl = new LVL4(instance.gameconfig, false);
                    break
                case "lvl5":
                    newlvl = new LVL5(instance.gameconfig, false);
                    break
            }
        });

        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/common/QuitButton.png");
        quit.width = "150px"
        quit.height = "80px";
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
        var image = new BABYLON.GUI.Image("lvlclear", "images/common/Level Clear.png");
        image.width = "800px";
        image.height = "170px";
        image.top = "-150px;"

        var next = BABYLON.GUI.Button.CreateImageOnlyButton("nextbtn", "images/common/NextButton.png");
        next.width = "200px"
        next.height = "100px";
        next.cornerRadius = 10;
        next.top = "70px;"

        next.onPointerUpObservable.add(function () {
            instance.gameconfig.createNewEngine()
            instance.gameconfig.statsprev = Object.assign({}, instance.gameconfig.stats);
            document.getElementById("cyborg").style.display="none";

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
                    new LVL5(instance.gameconfig);
                    break
                case "lvl5":
                    //switch to lvl5
                    new EndCredits(instance.gameconfig);
                    break
            }
        });

        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/common/QuitButton.png");
        quit.width = "150px"
        quit.height = "80px";
        quit.top = "200px";
        quit.cornerRadius = 10;

        quit.onPointerUpObservable.add(function () {
            instance.gameconfig.createNewEngine()
            instance.gameconfig.newStats()
            new MainMenu(instance.gameconfig);

        });

        this.lvlcontroller.addControl(image);
        this.lvlcontroller.addControl(next);
        this.lvlcontroller.addControl(quit);
    }
    createPauseScreen() {
        this.isPaused = true;
        this.lvlcontroller.dispose();
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        this.showinggui = true;

        this.timerPauseActivate()

        var instance = this;

        var image = new BABYLON.GUI.Image("lvlclear", "images/common/Paused.png");
        image.width = "600px";
        image.height = "120px";
        image.top = "-130px;"


        var resume = BABYLON.GUI.Button.CreateImageOnlyButton("nextbtn", "images/common/ResumeButton.png");
        resume.width = "300px"
        resume.height = "100px";
        resume.cornerRadius = 10;
        resume.top = "70px;"

        resume.onPointerUpObservable.add(function () {
            instance.removePauseScreen()
            return;

        });

        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/common/QuitButton.png");
        quit.width = "150px"
        quit.height = "80px";
        quit.top = "200px";
        quit.cornerRadius = 10;

        quit.onPointerUpObservable.add(function () {
            instance.gameconfig.createNewEngine()
            instance.gameconfig.newStats()
            instance.gameconfig.inputStates.pause = false;
            new MainMenu(instance.gameconfig);

        });

        this.lvlcontroller.addControl(image);
        this.lvlcontroller.addControl(resume);
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

    removePauseScreen() {
        this.showinggui = false;
        this.timerPause = false;
        this.lvlcontroller.dispose()
        this.canPause = false;
        this.canPauseActivate()
        this.isPaused = false;
    }
}