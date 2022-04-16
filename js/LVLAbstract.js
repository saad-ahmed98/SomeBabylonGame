class LVLAbstract {
    constructor(gameconfig, lvl) {
        gameconfig.createNewEngine()
        this.scene = new BABYLON.Scene(gameconfig.engine);
        gameconfig.scenes.push(this.scene)
        this.player;
        this.pickups = [];
        this.obstacles;
        this.endlvl;
        this.gameconfig = gameconfig;
        this.enemies = [];
        this.gui = new LVLGUIController(this.scene, gameconfig, lvl);

        this.configureAssetManager();
        this.loadAssets();
        this.scene.assetsManager.load();
    }

    wavePickups() {
        for (let i = 0; i < this.pickups.length; i++) {
            this.pickups[i].move()
        }
    }

    waveMovingPlatforms() {
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i] instanceof MovingPlatform)
                this.obstacles[i].move(this.player)
        }
    }

    moveEnemies() {
        for (let i = 0; i < this.enemies.length; i++)
            this.enemies[i].move()
    }

    collisionObstaclesEnemies() {
        for (let j = 0; j < this.enemies.length; j++) {
            for (let i = 0; i < this.obstacles.length; i++) {
                var val = 4
                if (this.enemies[j].mesh.position.x < this.obstacles[i].xright() + val && this.enemies[j].mesh.position.x > this.obstacles[i].xleft() - val) {
                    let posup = this.enemies[j].mesh.position.y - 5 - this.obstacles[i].yup()
                    let posdown = this.enemies[j].mesh.position.y + 5 - this.obstacles[i].ydown()
                    let posleft = this.enemies[j].mesh.position.x - 3 - this.obstacles[i].xleft()
                    let posright = this.enemies[j].mesh.position.x + 3 - this.obstacles[i].xright()

                    if (posleft < 0 && this.enemies[j].mesh.position.y - 5 < this.obstacles[i].yup() && this.enemies[j].mesh.position.y + 5 > this.obstacles[i].ydown()) {
                        this.enemies[j].mesh.position.x = this.obstacles[i].mesh.position.x - this.obstacles[i].width / 2 - val
                    }
                    else if (posright > 0 && this.enemies[j].mesh.position.y - 5 < this.obstacles[i].yup() && this.enemies[j].mesh.position.y + 5 > this.obstacles[i].ydown()) {
                        this.enemies[j].mesh.position.x = this.obstacles[i].mesh.position.x + this.obstacles[i].width / 2 + val
                    }
                    else if (this.enemies[j].mesh.position.x < this.obstacles[i].xright() && this.enemies[j].mesh.position.x > this.obstacles[i].xleft()) {
                        if (posdown < 0) {
                        }
                        else if (posup < 2) {
                            this.enemies[j].mesh.position.y = 5 + this.obstacles[i].mesh.position.y + this.obstacles[i].height / 2
                        }

                    }
                }
            }
        }
    }

    verifyLifeEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].hp <= 0) {
                this.enemies.splice(i, 1)
                i--
            }
        }

        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i] instanceof CheckpointObstacle) {
                this.obstacles[i].verifyLifeEnemies()
                if (this.obstacles[i].enemies.length == 0) {
                    this.obstacles[i].mesh.dispose()
                    this.obstacles.splice(i, 1)
                    i--
                }
            }
        }
    }

    collisionPlayerEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            var val = this.player.width / 2 - 2
            if (this.player.mesh.position.x < this.enemies[i].xright() + val && this.player.mesh.position.x > this.enemies[i].xleft() - val) {
                let posup = this.player.mesh.position.y - 5 - this.enemies[i].yup()
                let posdown = this.player.mesh.position.y + 5 - this.enemies[i].ydown()
                let posleft = this.player.mesh.position.x - 3 - this.enemies[i].xleft()
                let posright = this.player.mesh.position.x + 3 - this.enemies[i].xright()

                if (posleft < 0 && this.player.mesh.position.y - 5 < this.enemies[i].yup() && this.player.mesh.position.y + 5 > this.enemies[i].ydown()) {
                    this.player.mesh.position.x = this.enemies[i].mesh.position.x - this.enemies[i].width / 2 - val
                }
                else if (posright > 0 && this.player.mesh.position.y - 5 < this.enemies[i].yup() && this.player.mesh.position.y + 5 > this.enemies[i].ydown()) {
                    this.player.mesh.position.x = this.enemies[i].mesh.position.x + this.enemies[i].width / 2 + val
                }
                else if (this.player.mesh.position.x < this.enemies[i].xright() && this.player.mesh.position.x > this.enemies[i].xleft()) {
                    if (posdown < 0) {
                    }
                    else if (posup < 2) {
                        this.player.mesh.position.y = 5 + this.enemies[i].mesh.position.y + this.enemies[i].height / 2
                    }

                }
            }
        }
    }

    collisionObstacles() {
        let found = false
        for (let i = 0; i < this.obstacles.length; i++) {
            var val = 4
            if (this.player.mesh.position.x < this.obstacles[i].xright() + val && this.player.mesh.position.x > this.obstacles[i].xleft() - val) {
                let posup = this.player.mesh.position.y - 5 - this.obstacles[i].yup()
                let posdown = this.player.mesh.position.y + 5 - this.obstacles[i].ydown()
                let posleft = this.player.mesh.position.x - 3 - this.obstacles[i].xleft()
                let posright = this.player.mesh.position.x + 3 - this.obstacles[i].xright()

                if (posleft < 0 && this.player.mesh.position.y - 5 < this.obstacles[i].yup() && this.player.mesh.position.y + 5 > this.obstacles[i].ydown()) {
                    this.player.mesh.position.x = this.obstacles[i].mesh.position.x - this.obstacles[i].width / 2 - val
                    if (!(this.obstacles[i] instanceof MovingPlatform) && !(this.obstacles[i] instanceof CheckpointObstacle)) {
                        this.player.poswalljumping = this.player.mesh.position.y;
                        this.player.walljump = 0;
                        this.player.walljumpingleft = true;
                        this.player.walljumpingright = false;
                    }
                }
                else if (posright > 0 && this.player.mesh.position.y - 5 < this.obstacles[i].yup() && this.player.mesh.position.y + 5 > this.obstacles[i].ydown()) {
                    this.player.mesh.position.x = this.obstacles[i].mesh.position.x + this.obstacles[i].width / 2 + val
                    if (!(this.obstacles[i] instanceof MovingPlatform) && !(this.obstacles[i] instanceof CheckpointObstacle)) {
                        this.player.poswalljumping = this.player.mesh.position.y;
                        this.player.walljump = 0;
                        this.player.walljumpingleft = false;
                        this.player.walljumpingright = true;
                    }
                }
                else if (this.player.mesh.position.x < this.obstacles[i].xright() && this.player.mesh.position.x > this.obstacles[i].xleft()) {
                    if (posdown < 0) {
                        if (posdown > -5) {
                            this.gameconfig.jumpingstarted = 30;
                        }
                    }
                    else if (posup < 2) {
                        found = true;
                        this.player.mesh.position.y = 5 + this.obstacles[i].mesh.position.y + this.obstacles[i].height / 2
                        this.player.walljumpingleft = false;
                        this.player.walljumpingright = false;
                        this.player.jumping = true;
                        this.player.gameconfig.jumpingstarted = 0;
                        this.player.walljump = 30;
                    }

                }
            }
        }
        if (!found)
            this.player.jumping = false
    }


    contactPickups() {
        for (let i = 0; i < this.pickups.length; i++) {
            if (!this.pickups[i].dead) {
                if (Math.abs(this.pickups[i].mesh.position.x - this.player.mesh.position.x) <= 10 && Math.abs(this.pickups[i].mesh.position.y - this.player.mesh.position.y) <= 10) {

                    this.gui.createTooltip(this.pickups[i].tooltipimage, "700px", "200px");
                    this.pickups[i].activateEffect(this.player)
                    //this.player.haswalljump = true;
                    this.pickups[i].mesh.dispose();
                    this.pickups[i].dead = true;
                }
            }

        }
    }

    createFollowCamera(radius) {
        let camera = new BABYLON.FollowCamera("playerFollowCamera", this.player.mesh.position, this.scene, this.player.mesh);

        camera.radius = radius; // how far from the object to follow
        camera.heightOffset = 10; // how high above the object to place the camera
        camera.rotationOffset = 90; // the viewing angle
        camera.cameraAcceleration = .1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit

        return camera;
    }

    createPlayer(x, y) {
        //hitbox
        this.player = new Player(10, 6, 2, this.gameconfig)
        var playerbox = new BABYLON.MeshBuilder.CreateBox("heroplayer", { height: 10, depth: 5, width: 6 }, this.scene);
        playerbox.position.x = x;
        playerbox.position.y = y;
        playerbox.lookAt(new BABYLON.Vector3(1000000000, 0, 0));
        playerbox.visibility = 0;

        playerbox.frontVector = new BABYLON.Vector3(0, 0, 1);

        //actual character
        var mesh = this.scene.assets.player;

        mesh.name = "hero";

        mesh.parent = playerbox;
        mesh.position.x = 0;
        mesh.position.z = 0;
        mesh.position.y = -6;
        mesh.scaling.x = 5;
        mesh.scaling.z = 5;
        mesh.scaling.y = 5;
        mesh.rotation = new BABYLON.Vector3(0, 0, 0);

        this.scene.assets.playeranimations[2].play(true)

        this.player.animationGroups = this.scene.assets.playeranimations
        this.player.mesh = playerbox
        this.player.swordmesh = mesh.getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[0].getChildren()[0]
        this.player.swordmesh.setEnabled(false)

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
                "We are loading the scene.. " +
                remainingCount +
                " out of " +
                totalCount +
                " items still need to be loaded.";
        };
        assetsManager.onFinish = function (tasks) {
            instance.createScene()
            instance.gameconfig.engine.runRenderLoop(function () {
                instance.renderScene();
            });
        };

        this.scene.assetsManager = assetsManager;
    }

    loadPlayer() {
        var instance = this;
        let meshTask = this.scene.assetsManager.addMeshTask(
            "player task",
            "",
            "models/",
            "character.glb"
        );
        meshTask.onSuccess = function (task) {
            instance.scene.assets.player = task.loadedMeshes[0]
            instance.scene.assets.playeranimations = task.loadedAnimationGroups

        };
    }


    loadAssets() {
        throw new Error('You must implement this function');
    }

    createScene() {
        throw new Error('You must implement this function');
    }

    renderScene() {
        throw new Error('You must implement this function');
    }
}