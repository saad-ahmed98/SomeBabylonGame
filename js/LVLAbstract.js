class LVLAbstract {
    constructor(gameconfig, lvl) {
        this.scene = new BABYLON.Scene(gameconfig.engine);
        this.player;
        this.pickups;
        this.obstacles;
        this.endlvl;
        this.gameconfig = gameconfig;
        this.gui = new LVLGUIController(this.scene, gameconfig, lvl);


        //variables d'état, à changer
        this.jumping = false;
        this.lookAt = 1;
        this.walljumpingleft = false;
        this.walljumpingright = false;
        this.walljump = 0;
        this.haswalljump = false;
        this.isattacking = false;
        this.poswalljumping = 0;

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
                this.obstacles[i].move()
        }
    }

    collisionMovingPlatforms() {
        let found = false
        for (let i = 0; i < this.obstacles.length; i++) {
            var val = 4
            if (this.player.position.x < this.obstacles[i].xright()+val && this.player.position.x > this.obstacles[i].xleft()-val) {
                let posup = this.player.position.y - 5 - this.obstacles[i].yup()
                let posdown = this.player.position.y + 5 - this.obstacles[i].ydown()
                let posleft = this.player.position.x - 3 - this.obstacles[i].xleft()
                let posright = this.player.position.x + 3 - this.obstacles[i].xright()

                if (posleft < 0 && this.player.position.y -5 < this.obstacles[i].yup() && this.player.position.y +5 > this.obstacles[i].ydown()) {
                    this.player.position.x = this.obstacles[i].mesh.position.x - this.obstacles[i].width / 2 - val
                    this.poswalljumping = this.player.position.y;
                    this.walljump = 0;
                    this.walljumpingleft = true;
                    this.walljumpingright = false;
                }
                else if (posright > 0 && this.player.position.y -5 < this.obstacles[i].yup() && this.player.position.y +5 > this.obstacles[i].ydown()) {
                    this.player.position.x = this.obstacles[i].mesh.position.x + this.obstacles[i].width / 2 + val
                    this.poswalljumping = this.player.position.y;
                    this.walljump = 0;
                    this.walljumpingleft = false;
                    this.walljumpingright = true;
                }
                else if (this.player.position.x < this.obstacles[i].xright() && this.player.position.x > this.obstacles[i].xleft()) {
                    if (posdown < 0) {
                        if (posdown > -5) {
                            this.gameconfig.jumpingstarted = 30;
                        }
                    }
                    else if (posup < 2) {
                        found = true;
                        this.player.position.y = 5 + this.obstacles[i].mesh.position.y + this.obstacles[i].height / 2
                        this.walljumpingleft = false;
                        this.walljumpingright = false;
                        this.jumping = true;
                        this.gameconfig.jumpingstarted = 0;
                        this.walljump = 30;
                    }

                }
            }
        }
        if (!found)
            this.jumping = false
    }


    contactPickups() {
        for (let i = 0; i < this.pickups.length; i++) {
            if (!this.pickups[i].dead) {
                if (Math.abs(this.pickups[i].mesh.position.x - this.player.position.x) <= 10 && Math.abs(this.pickups[i].mesh.position.y - this.player.position.y) <= 10) {
                    this.gui.createTooltip("images/WallJumpTooltip.png", "700px", "200px");
                    this.haswalljump = true;
                    this.pickups[i].mesh.dispose();
                    this.pickups[i].dead = true;
                }
            }

        }
    }

    createFollowCamera(radius) {
        let camera = new BABYLON.FollowCamera("playerFollowCamera", this.player.position, this.scene, this.player);

        camera.radius = radius; // how far from the object to follow
        camera.heightOffset = 10; // how high above the object to place the camera
        camera.rotationOffset = 90; // the viewing angle
        camera.cameraAcceleration = .1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit

        return camera;
    }

    createPlayer(x, y) {
        //hitbox
        this.player = new BABYLON.MeshBuilder.CreateBox("heroplayer", { height: 10, depth: 5, width: 6 }, this.scene);
        this.player.position.x = x;
        this.player.position.y = y;
        this.player.lookAt(new BABYLON.Vector3(10, 0, 0));
        this.player.visibility = 0;

        this.player.speed = 2;
        this.player.frontVector = new BABYLON.Vector3(0, 0, 1);

        //actual character
        var mesh = this.scene.assets.player;
        mesh.name = "hero";

        mesh.parent = this.player;
        mesh.position.x = 0;
        mesh.position.z = 0;
        mesh.position.y = -5;
        mesh.scaling.x = 5;
        mesh.scaling.z = 5;
        mesh.scaling.y = 5;
        mesh.rotation = new BABYLON.Vector3(0, 0, 0);

        mesh._scene.animationGroups[2].play(true)

        this.player.animationGroups = mesh._scene.animationGroups

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