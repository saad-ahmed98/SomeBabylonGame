class MainMenu {
    constructor(gameconfig) {
        imageLoading = "";
        titleLoading = "";
        divFps.style.display = "none";
        divBarreJoueur.style.display="none"
        cyborg.style.display="none"
        this.gameconfig = gameconfig;
        this.scene = new BABYLON.Scene(gameconfig.engine);
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);

        this.createSkybox()

        this.gameconfig.scenes.push(this.scene)

        this.configureAssetManager();
        this.loadAssets();
        this.scene.assetsManager.load();

    }

    loadAssets() {
        var instance = this;
        var assetsManager = instance.scene.assetsManager;
        var binaryTask = assetsManager.addBinaryFileTask(
            "bgm",
            "sounds/menumusic.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.bgm = new BABYLON.Sound(
                "bgm",
                task.data,
                this.scene,
                null,
                {
                    loop: true,
                }
            );
        };
    }

    configureAssetManager() {
        // useful for storing references to assets as properties. i.ethis.scene.assets.cannonsound, etc.
        this.scene.assets = {};
        var instance = this;

        let assetsManager = new BABYLON.AssetsManager(this.scene);

        assetsManager.onProgress = function (
            remainingCount,
            totalCount
        ) {
            instance.gameconfig.engine.loadingUIText =
                '<div id="center"><div id="main" style="width:' + ((totalCount - remainingCount) * 600 / totalCount) + 'px"></div></div>'
        };
        assetsManager.onFinish = function (tasks) {
            instance.createScene()
            instance.gameconfig.engine.runRenderLoop(function () {
                instance.renderScene()
            });
        };

        this.scene.assetsManager = assetsManager;
    }

    renderScene() {
        var sound = this.scene.assets.bgm
        sound.setVolume(0.3)
        if (!sound.isPlaying)
            sound.play()
        this.scene.render();
    }

    createScene() {
        var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-30, 80, -100), this.scene);
        this.createMainMenu()
        this.createSkybox()
    }


    createSkybox() {
        // Skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/menu/skybox", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }

    createMainMenu() {
        this.lvlcontroller.dispose()
        var instance = this;
        var image = new BABYLON.GUI.Image("gameTitle", "images/menu/gametitle.png");
        image.width = "900px";
        image.height = "70px";
        image.top = "-250px;"

        var newGame = BABYLON.GUI.Button.CreateImageOnlyButton("newGame", "images/menu/NewGameButton.png");
        newGame.width = "300px"
        newGame.height = "100px";
        newGame.cornerRadius = 10;
        newGame.top = "3px;"

        newGame.onPointerUpObservable.add(function () {
            instance.newLVL(1)
        });


        var select = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/menu/SelectButton.png");
        select.width = "250px"
        select.height = "70px";
        select.top = "150px";
        select.cornerRadius = 10;

        select.onPointerUpObservable.add(function () {
            instance.createLVLSelect()
        });
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        this.lvlcontroller.addControl(image);
        this.lvlcontroller.addControl(newGame);
        this.lvlcontroller.addControl(select);
    }

    createLVLSelect() {
        this.lvlcontroller.dispose()
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);

        var instance = this;
        var image = new BABYLON.GUI.Image("gameTitle", "images/menu/gametitle.png");
        image.width = "900px";
        image.height = "70px";
        image.top = "-250px;"
        this.lvlcontroller.addControl(image);


        for (let i = 1; i < 6; i++) {
            var lvl = BABYLON.GUI.Button.CreateImageOnlyButton("lvl"+i, "images/menu/lvl" + i + ".png");
            lvl.width = "250px"
            lvl.height = "52px";
            lvl.color = "transparent"
            lvl.top = (-200 + 80 * i) + "px;"
           lvl.onPointerUpObservable.add(function () {
                if(i!=0)
                instance.gameconfig.newStats(true)
                instance.newLVL(i)
            });
            this.lvlcontroller.addControl(lvl)
        }

        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/common/QuitButton.png");
        quit.width = "150px"
        quit.height = "80px";
        quit.top = "300px";
        quit.cornerRadius = 10;

        quit.onPointerUpObservable.add(function () {
            instance.createMainMenu()
        });

        this.lvlcontroller.addControl(quit);
    }

    newLVL(i) {
        this.gameconfig.createNewEngine()

        switch (i) {
            case 1:
                new LVL1(this.gameconfig)
                break;
            case 2:
                new LVL2(this.gameconfig)
                break;
            case 3:
                new LVL3(this.gameconfig)
                break;
            case 4:
                new LVL4(this.gameconfig)
                break;
            case 5:
                new LVL5(this.gameconfig)
                break;
        }
    }
}