class EndCredits {
    constructor(gameconfig) {
        imageLoading = "";
        titleLoading = "";
        divFps.style.display = "none";
        divBarreJoueur.style.display="none"
        cyborg.style.display="none"
        this.gameconfig = gameconfig;
        this.scene = new BABYLON.Scene(gameconfig.engine);
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);

        this.gameconfig.scenes.push(this.scene)

        this.configureAssetManager();
        this.scene.assetsManager.load();

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
        this.scene.render();
    }

    createScene() {
        var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-30, 80, -100), this.scene);
        this.scene.clearColor = BABYLON.Color3.Black();
        this.createCredits()
        
    }


    createCredits() {
        this.lvlcontroller.dispose()
        this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);

        var instance = this;
        var image = new BABYLON.GUI.Image("credits", "images/menu/credits.png");
        image.width = "1400px";
        image.height = "440px";
        image.top = "-100px;"
        this.lvlcontroller.addControl(image);


        var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/common/QuitButton.png");
        quit.width = "150px"
        quit.height = "80px";
        quit.top = "300px";
        quit.cornerRadius = 10;

        quit.onPointerUpObservable.add(function () {
            instance.gameconfig.createNewEngine()
            instance.gameconfig.newStats()
            new MainMenu(instance.gameconfig);
        });

        this.lvlcontroller.addControl(quit);
    }
}