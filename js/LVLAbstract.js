class LVLAbstract {
    constructor(gameconfig, lvl,animate=true) {
        divFps.style.display = "block"
        divBarreJoueur.style.display = "block"
        gameconfig.createNewEngine()
        this.scene = new BABYLON.Scene(gameconfig.engine);
        gameconfig.scenes.push(this.scene)
        this.player;
        this.pickups = [];
        this.obstacles;
        this.endlvl;
        this.gameconfig = gameconfig;
        this.enemies = [];
        this.animate=animate;
        this.gui = new LVLGUIController(this.scene, gameconfig, lvl);
        this.configureAssetManager();
        this.loadAssets();
        this.scene.assetsManager.load();
        this.cameraAnimation = true
        this.cameraStopX = false
    }

    contactEndLevel() {
        if (Math.abs(this.endlvl.position.x - this.player.mesh.position.x) <= 10 && Math.abs(this.endlvl.position.y - this.player.mesh.position.y) <= 10) {
            if (!this.gui.showinggui)
                this.gui.createLevelClearScreen()
        }
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

    animateCamera(tooltip,tooltiplink="",heigth="200px",width = "400px"){
        var diry = -1
        if(this.scene.activeCamera.position.y-this.player.mesh.position.y<0)
            diry = 1
        if(!this.cameraStopX)
        this.scene.activeCamera.position.x-=3
        if(this.scene.activeCamera.position.x<=this.player.mesh.position.x){
            this.cameraStopX = true
            this.scene.activeCamera.position.y+=3*diry
            var checky = this.scene.activeCamera.position.y<=this.player.mesh.position.y
            if(diry==1){
            checky = this.scene.activeCamera.position.y>=this.player.mesh.position.y
            }
            if(checky){
            this.scene.activeCamera = this.createFollowCamera(200)
            this.cameraAnimation = false
            if(tooltip)
                this.gui.createTooltip(tooltiplink, width, heigth);
            }
        }
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
            if (this.enemies[i].hp == -999) {
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

    loadSounds() {
        var instance = this;
        var assetsManager = instance.scene.assetsManager;

        var binaryTask = assetsManager.addBinaryFileTask(
            "attack",
            "sounds/attack.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.attack = new BABYLON.Sound(
                "attack",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

        binaryTask = assetsManager.addBinaryFileTask(
            "death",
            "sounds/death.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.death = new BABYLON.Sound(
                "death",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

        binaryTask = assetsManager.addBinaryFileTask(
            "hurt",
            "sounds/hurt.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.hurt = new BABYLON.Sound(
                "hurt",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

        binaryTask = assetsManager.addBinaryFileTask(
            "jump",
            "sounds/attack.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.jump = new BABYLON.Sound(
                "jump",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

    }

    loadSkybox(url) {
        var instance = this;
        var assetsManager = instance.scene.assetsManager;

        var textureTask = assetsManager.addTextureTask("image task", url);
        textureTask.onSuccess = function (task) {
            instance.scene.assets.skybox = task.texture
        }
    }

    collisionPlayerEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].hp > 0) {
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
                        if (this.obstacles[i] instanceof Elevator) {
                            if (!this.obstacles[i].hasStarted)
                                this.obstacles[i].start()
                        }
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

                    this.gui.createTooltip(this.pickups[i].tooltipimage, this.pickups[i].width, this.pickups[i].height);
                    this.pickups[i].activateEffect(this.player)
                    this.pickups[i].mesh.dispose();
                    this.pickups[i].dead = true;
                }
            }

        }
    }

    collisionBullets() {
        for (let j = 0; j < this.enemies.length; j++) {
            for (let i = 0; i < this.enemies[j].bullets.length; i++) {
                var bullet = this.enemies[j].bullets[i]
                if (!bullet.dead) {
                    if (Math.abs(bullet.mesh.position.x - this.player.mesh.position.x) <= 10 && Math.abs(bullet.mesh.position.y - this.player.mesh.position.y) <= 10) {
                        bullet.dead = true;
                        bullet.mesh.dispose()
                        this.player.receiveDamage(1)
                    }
                }
            }
        }
    }


    createFollowCamera(radius) {
        let camera = new BABYLON.FollowCamera("playerFollowCamera", this.player.mesh.position, this.scene, this.player.mesh);

        camera.radius = radius; // how far from the object to follow
        camera.heightOffset = 10; // how high above the object to place the camera
        camera.rotationOffset = 90; // the viewing angle
        camera.cameraAcceleration = 0.1; // how fast to move
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
        this.scene.assets.playeranimations[0].stop()
        this.scene.assets.playeranimations[0].loopAnimation = false


        this.player.animationGroups = this.scene.assets.playeranimations
        this.player.mesh = playerbox
        this.player.swordmesh = mesh.getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[0].getChildren()[0]
        this.player.swordmesh.setEnabled(false)
        this.player.updateHpBar()

    }

    playBGM(volume) {
        var sound = this.scene.assets.bgm
        sound.setVolume(volume)
        if (!sound.isPlaying)
            sound.play()
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
            '<div id="center"><div id="main" style="width:'+((totalCount-remainingCount)*600/totalCount)+'px"></div></div>'
        };
        assetsManager.onFinish = function (tasks) {
            instance.createScene()
            instance.gameconfig.engine.runRenderLoop(function () {
                instance.renderScene();
            });
        };

        this.scene.assetsManager = assetsManager;
    }

    loadEnemySound(){
        var instance = this;
        var assetsManager = instance.scene.assetsManager;
        var binaryTask = assetsManager.addBinaryFileTask(
            "enemyattack",
            "sounds/enemyattack.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.enemyattack = new BABYLON.Sound(
                "enemyattack",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

        binaryTask = assetsManager.addBinaryFileTask(
            "enemydeath",
            "sounds/enemydeath.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.enemydeath = new BABYLON.Sound(
                "enemydeath",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };
    }

    loadEnemy2Sound(){
        var instance = this;
        var assetsManager = instance.scene.assetsManager;
        var binaryTask = assetsManager.addBinaryFileTask(
            "enemy2attack",
            "sounds/enemy2attack.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.enemy2attack = new BABYLON.Sound(
                "enemy2attack",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

        binaryTask = assetsManager.addBinaryFileTask(
            "enemy2death",
            "sounds/enemy2death.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.enemy2death = new BABYLON.Sound(
                "enemy2death",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };
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

    createLights() {
        // i.e sun light with all light rays parallels, the vector is the direction.
        let light0 = new BABYLON.HemisphericLight("dir0", new BABYLON.Vector3(1, 20, -10), this.scene);
        light0.intensity = 1;
    }

    renderScene() {
        if(this.gameconfig.inputStates.pause){
            if(!this.gui.showinggui && this.gui.canPause){
            this.gui.createPauseScreen();
            }
            else if(this.gui.timerPause)
                this.gui.removePauseScreen();
        }
        if(!this.gui.isPaused)
        this.createLvl();
        this.scene.render();
    }

    loadAssets() {
        throw new Error('You must implement this function');
    }

    createScene() {
        throw new Error('You must implement this function');
    }
    createLvl() {
        throw new Error('You must implement this function');
    }

    
}