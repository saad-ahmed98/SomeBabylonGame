class MainMenu  {
    constructor(gameconfig) {
        this.gameconfig=gameconfig;
        this.scene = new BABYLON.Scene(gameconfig.engine); 
        this.gameconfig.scenes.push(this.scene)
        var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), this.scene);
        let menu=this;
        gameconfig.engine.runRenderLoop(() => {
            menu.scene.render();
        });
        this.createMainMenu();
        
    }


createMainMenu() {
    this.showinggui = true;
    var instance = this;
    var image = new BABYLON.GUI.Image("gameTitle", "images/gametitle.png");
    image.width = "700px";
    image.height = "200px";
    image.top = "-150px;"

    var newGame = BABYLON.GUI.Button.CreateImageOnlyButton("newGame", "images/NewGameButton.png");
    newGame.width = "300px"
    newGame.height = "100px";
    newGame.cornerRadius = 10;
    newGame.top = "70px;"

    newGame.onPointerUpObservable.add(function () {
        instance.gameconfig.createNewEngine()
        new LVL1(instance.gameconfig);
    });
    

    var quit = BABYLON.GUI.Button.CreateImageOnlyButton("quitbtn", "images/QuitButton.png");
    quit.width = "150px"
    quit.height = "100px";
    quit.top = "200px";
    quit.cornerRadius = 10;

    quit.onPointerUpObservable.add(function () {
        alert("nothing happens yet")
    });
    this.lvlcontroller = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
    this.lvlcontroller.addControl(image);
    this.lvlcontroller.addControl(newGame);
    this.lvlcontroller.addControl(quit);
}
}