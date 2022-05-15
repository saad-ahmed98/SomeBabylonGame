class LVL4 extends LVLAbstract {
    constructor(gameconfig,animate=true) {
        imageLoading = "images/LVL4/loading.png"
        titleLoading = "images/LVL4/title.png"
        super(gameconfig, "lvl4",animate);
        console.log("lvl4")
       
        this.teleports = []
    }

    createLvl() {
        this.gameconfig.divFps.innerHTML = this.gameconfig.engine.getFps().toFixed() + " fps";
        this.gameconfig.rollingAverage.add(this.scene.getAnimationRatio());
        this.collisionObstacles();
        this.verifyLifeEnemies();
        this.collisionObstaclesEnemies();
        this.collisionPlayerEnemies();
        this.wavePickups();
        this.contactPickups();
        this.contactTeleports();
        this.contactEndLevel();
        this.collisionBullets();
        this.moveEnemies();
        console.log("x:" + this.player.mesh.position.x + ",y:" + this.player.mesh.position.y)
        if (this.player.mesh.position.y < -70) {
            this.scene.activeCamera.lockedTarget = null
            if (!this.gui.showinggui)
                this.gui.createGameOverScreen()
        }
        if(this.cameraAnimation){ 
             if(!this.animate){
                this.scene.activeCamera.position.x=this.player.mesh.position.x
                this.scene.activeCamera.position.y=this.player.mesh.position.y
            }
        
            this.animateCamera(false)
        }
        else{
        if (this.player.hp > 0)
            this.player.move(this.scene.activeCamera, this.enemies);
        }
        if (this.player.hp <= 0) {
            if (!this.gui.showinggui)
                this.gui.createGameOverScreen()
        }
        this.playBGM(0.1);
    }

    loadAssets() {
        this.loadPlayer();
        this.loadEnemies();
        this.loadSounds();
    }

    loadEnemies() {
        var instance = this;
        this.scene.assets.enemy1 = []
        this.scene.assets.animations1 = []

        this.scene.assets.enemy2 = []
        this.scene.assets.animations2 = []

        this.scene.assets.enemy3 = []
        this.scene.assets.animations3 = []

        for (let i = 0; i < 5; i++) {
            let meshTask = this.scene.assetsManager.addMeshTask(
                "enemy1 task" + i,
                "",
                "models/",
                "enemy1.gltf"
            );

            meshTask.onSuccess = function (task) {
                instance.scene.assets.enemy1.push(task.loadedMeshes[1])
                instance.scene.assets.animations1.push(task.loadedAnimationGroups)
            };
        }

        for (let i = 0; i < 3; i++) {
            let meshTask = this.scene.assetsManager.addMeshTask(
                "enemy3 task" + i,
                "",
                "models/",
                "enemy3.gltf"
            );

            meshTask.onSuccess = function (task) {
                instance.scene.assets.enemy3.push(task.loadedMeshes[1])
                instance.scene.assets.animations3.push(task.loadedAnimationGroups)
            };
        }
        for (let i = 0; i < 2; i++) {
            let meshTask = this.scene.assetsManager.addMeshTask(
                "enemy2 task" + i,
                "",
                "models/",
                "enemy2.gltf"
            );

            meshTask.onSuccess = function (task) {
                instance.scene.assets.enemy2.push(task.loadedMeshes[1])
                instance.scene.assets.animations2.push(task.loadedAnimationGroups)
            };
        }
    }

    loadSounds() {
        super.loadSounds()
        var instance = this;
        var assetsManager = instance.scene.assetsManager;
        var binaryTask = assetsManager.addBinaryFileTask(
            "swordSwing",
            "sounds/sword swing.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.swordSwingSound = new BABYLON.Sound(
                "swordSwing",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

        binaryTask = assetsManager.addBinaryFileTask(
            "bgm",
            "sounds/lvl4music.mp3"
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

        binaryTask = assetsManager.addBinaryFileTask(
            "laser",
            "sounds/laser.wav"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.laserSound = new BABYLON.Sound(
                "laser",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

        binaryTask = assetsManager.addBinaryFileTask(
            "teleport",
            "sounds/teleport.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.teleport = new BABYLON.Sound(
                "teleport",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };
        this.loadEnemySound()
        this.loadEnemy2Sound()
    }



    createScene() {
        this.createPlayer(-1000, -42.5);
        this.player.updateWeapon()

        var skyMaterial = new BABYLON.GridMaterial("skyMaterial", this.scene);
        skyMaterial.majorUnitFrequency = 20;
        skyMaterial.minorUnitVisibility = 0.43;
        skyMaterial.gridRatio = 2;
        skyMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
        skyMaterial.lineColor = new BABYLON.Color3(0, 1.0, 1.0);
        skyMaterial.backFaceCulling = false;

        var skySphere = BABYLON.Mesh.CreateSphere("skySphere", 20, 1550, this.scene);
        skySphere.position.z = -200
        skySphere.position.x = -500
        skySphere.material = skyMaterial;

        this.createObstacles();
        this.createPickups();
        this.createTeleports();
        this.createEnemies();

        this.createEndLevel();
        this.scene.activeCamera =new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(this.endlvl.position.x, this.endlvl.position.y, -400), this.scene);

        this.createLights();

        return this.scene;
    }

    contactEndLevel() {
        if (Math.abs(this.endlvl.position.x - this.player.mesh.position.x) <= 10 && Math.abs(this.endlvl.position.y - this.player.mesh.position.y) <= 10) {
            if (!this.gui.showinggui)
                this.gui.createLevelClearScreen()
        }
    }

    contactTeleports() {
        for (let i = 0; i < this.teleports.length; i++) {
            if (Math.abs(this.teleports[i].mesh.position.x - this.player.mesh.position.x) <= 10 && Math.abs(this.teleports[i].mesh.position.y - this.player.mesh.position.y) <= 10) {
                this.teleports[i].teleport(this.player, this.scene.activeCamera)
            }
        }
    }


    createEnemies() {


        //lvl 11 enemies
        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -600, 270, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 10, 0.2, this.player, -700, 270, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)

        //lvl 8 enemies
        enemy = new Enemy(25, 20, 4, 0.2, this.player, -550, 200, 20)
        enemy.createEnemy3(this.scene)
        this.enemies.push(enemy)

        //lvl 5 enemies
        enemy = new Enemy(25, 20, 5, 0.2, this.player, -550, 100, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 5, 0.2, this.player, -600, 100, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 4, 0.2, this.player, -780, 100, 20)
        enemy.createEnemy3(this.scene)
        this.enemies.push(enemy)

        //lvl 2 enemies
        enemy = new Enemy(25, 20, 5, 0.2, this.player, -700, 20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 5, 0.2, this.player, -600, 20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        //lvl 13 enemies
        enemy = new Enemy(25, 20, 10, 0.2, this.player, -550, 350, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)

        var enemy1 = new Enemy(25, 20, 4, 0.2, this.player, -500, 350, 20)
        enemy1.createEnemy3(this.scene)
        this.enemies.push(enemy1)

        var obst = new CheckpointObstacle(80, 50, 7, [enemy,enemy1])
        var obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.x = -350;
        obj.position.y = 350;
        obst.mesh = obj;
        obst.colorMesh(this.scene)
        this.obstacles.push(obst)

    }


    createPickups() {
        var pickup = new Pickup(-225, 55, 2)
        pickup.createSword(this.scene)
        this.pickups.push(pickup);

        pickup = new Pickup(-225, -32, 2)
        pickup.createHPUp(this.scene)
        this.pickups.push(pickup);
    }

    createTeleports() {
        var levels = []
        levels.push({ "x": -1000, "y": -43 })
        levels.push({ "x": -650, "y": -43 })
        levels.push({ "x": -300, "y": -43 })

        levels.push({ "x": -1000, "y": 48 })
        levels.push({ "x": -650, "y": 48 })
        levels.push({ "x": -300, "y": 48 })

        levels.push({ "x": -1000, "y": 138 })
        levels.push({ "x": -650, "y": 138 })
        levels.push({ "x": -300, "y": 138 })

        levels.push({ "x": -1000, "y": 228 })
        levels.push({ "x": -650, "y": 228 })
        levels.push({ "x": -300, "y": 228 })

        levels.push({ "x": -1000, "y": 318 })


        //lvl 1 teleports
        this.createLVLIcon(levels[1 - 1].x, levels[1 - 1].y, 1)

        var teleport = new Teleporter(levels[4 - 1].x, levels[4 - 1].y)
        teleport.createTeleport(levels[1 - 1].x + 75, levels[1 - 1].y)
        this.teleports.push(teleport);

        //lvl 2 teleports
        this.createLVLIcon(levels[2 - 1].x, levels[2 - 1].y, 2)

        teleport = new Teleporter(levels[7 - 1].x, levels[7 - 1].y)
        teleport.createTeleport(levels[2 - 1].x - 200, levels[2 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[8 - 1].x, levels[8 - 1].y)
        teleport.createTeleport(levels[2 - 1].x + 200, levels[2 - 1].y)
        this.teleports.push(teleport);

        //lvl 3 teleports
        this.createLVLIcon(levels[3 - 1].x, levels[3 - 1].y, 3)

        teleport = new Teleporter(levels[1 - 1].x, levels[1 - 1].y)
        teleport.createTeleport(levels[3 - 1].x - 75, levels[3 - 1].y)
        this.teleports.push(teleport);

        //lvl 4 teleports
        this.createLVLIcon(levels[4 - 1].x, levels[4 - 1].y, 4)

        teleport = new Teleporter(levels[1 - 1].x, levels[1 - 1].y)
        teleport.createTeleport(levels[4 - 1].x - 75, levels[4 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[9 - 1].x, levels[9 - 1].y)
        teleport.createTeleport(levels[4 - 1].x + 75, levels[4 - 1].y)
        this.teleports.push(teleport);

        //lvl 5 teleports
        this.createLVLIcon(levels[5 - 1].x, levels[5 - 1].y, 5)

        teleport = new Teleporter(levels[12 - 1].x, levels[12 - 1].y)
        teleport.createTeleport(levels[5 - 1].x - 200, levels[5 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[11 - 1].x, levels[11 - 1].y)
        teleport.createTeleport(levels[5 - 1].x + 200, levels[5 - 1].y)
        this.teleports.push(teleport);

        //lvl 6 teleports
        this.createLVLIcon(levels[6 - 1].x, levels[6 - 1].y, 6)

        teleport = new Teleporter(levels[5 - 1].x, levels[5 - 1].y)
        teleport.createTeleport(levels[6 - 1].x - 75, levels[6 - 1].y)
        this.teleports.push(teleport);


        //lvl 7 teleports
        this.createLVLIcon(levels[7 - 1].x, levels[7 - 1].y, 7)

        teleport = new Teleporter(levels[6 - 1].x, levels[6 - 1].y)
        teleport.createTeleport(levels[7 - 1].x - 75, levels[7 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[10 - 1].x, levels[10 - 1].y)
        teleport.createTeleport(levels[7 - 1].x + 75, levels[7 - 1].y)
        this.teleports.push(teleport);

        //lvl 8 teleports
        this.createLVLIcon(levels[8 - 1].x, levels[8 - 1].y, 8)

        teleport = new Teleporter(levels[10 - 1].x, levels[10 - 1].y)
        teleport.createTeleport(levels[8 - 1].x - 200, levels[8 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[1 - 1].x, levels[1 - 1].y)
        teleport.createTeleport(levels[8 - 1].x + 200, levels[8 - 1].y)
        this.teleports.push(teleport);

        //lvl 9 teleports
        this.createLVLIcon(levels[9 - 1].x, levels[9 - 1].y, 9)

        teleport = new Teleporter(levels[3 - 1].x, levels[3 - 1].y)
        teleport.createTeleport(levels[9 - 1].x - 75, levels[9 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[2 - 1].x, levels[2 - 1].y)
        teleport.createTeleport(levels[9 - 1].x + 75, levels[9 - 1].y)
        this.teleports.push(teleport);

        //lvl 10 teleports
        this.createLVLIcon(levels[10 - 1].x, levels[10 - 1].y, 10)

        teleport = new Teleporter(levels[5 - 1].x, levels[5 - 1].y)
        teleport.createTeleport(levels[10 - 1].x - 75, levels[10 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[1 - 1].x, levels[1 - 1].y)
        teleport.createTeleport(levels[10 - 1].x + 75, levels[10 - 1].y)
        this.teleports.push(teleport);

        //lvl 11 teleports
        this.createLVLIcon(levels[11 - 1].x, levels[11 - 1].y, 11)

        teleport = new Teleporter(levels[6 - 1].x, levels[6 - 1].y)
        teleport.createTeleport(levels[11 - 1].x - 200, levels[11 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[12 - 1].x, levels[12 - 1].y)
        teleport.createTeleport(levels[11 - 1].x + 200, levels[11 - 1].y)
        this.teleports.push(teleport);

        //lvl 12 teleports
        this.createLVLIcon(levels[12 - 1].x, levels[12 - 1].y, 12)

        teleport = new Teleporter(levels[11 - 1].x, levels[11 - 1].y)
        teleport.createTeleport(levels[12 - 1].x - 75, levels[12 - 1].y)
        this.teleports.push(teleport);

        teleport = new Teleporter(levels[13 - 1].x, levels[13 - 1].y)
        teleport.createTeleport(levels[12 - 1].x + 75, levels[12 - 1].y)
        this.teleports.push(teleport);
    }

    createLVLIcon(x, y, lvl) {
        var obj = new BABYLON.Mesh.CreateDisc("", 10, 64, this.scene);
        var objmat = new BABYLON.StandardMaterial("", this.scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/LVL4/" + lvl + ".png", this.scene);

        obj.material = objmat;
        obj.position.x = x;
        obj.position.y = y + 60;
        obj.position.z = 10;

    }

    createObstacles() {

        var defaultGridMaterial = new BABYLON.GridMaterial("default", this.scene);
        defaultGridMaterial.majorUnitFrequency = 20;
        defaultGridMaterial.gridRatio = 1;

        var obstt = []
        var obj;
        var obst = new Obstacle(5, 100, 900)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -50;
        obj.position.x = -650;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = defaultGridMaterial;


        obst = new Obstacle(5, 100, 900)
        var obj2 = obj.clone("")
        obj.position.y = 40;
        obst.mesh = obj2;
        obstt.push(obst)

        obst = new Obstacle(5, 100, 900)
        obj2 = obj.clone("")
        obj.position.y = 130;
        obst.mesh = obj2;
        obstt.push(obst)

        obst = new Obstacle(5, 100, 900)
        obj2 = obj.clone("")
        obj.position.y = 220;
        obst.mesh = obj2;
        obstt.push(obst)

        obst = new Obstacle(5, 100, 900)
        obj2 = obj.clone("")
        obj.position.y = 310;
        obst.mesh = obj2;
        obstt.push(obst)

        obst = new Obstacle(5, 100, 900)
        obj2 = obj.clone("")
        obj.position.y = 400;
        obst.mesh = obj2;
        obstt.push(obst)


        var obst = new Obstacle(455, 100, 5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 175;
        obj.position.x = -1100;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = defaultGridMaterial;

        obst = new Obstacle(360, 100, 5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 130;
        obj.position.x = -900;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = defaultGridMaterial;

        obst = new Obstacle(360, 100, 5)
        obj2 = obj.clone("")
        obj.position.x = -400;
        obst.mesh = obj2;
        obstt.push(obst)

        obst = new Obstacle(455, 100, 5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 175;
        obj.position.x = -200;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = defaultGridMaterial;


        this.obstacles = obstt;


    }

    createEndLevel() {
        var obj = new BABYLON.MeshBuilder.CreateBox("", { height: 30, depth: 5, width: 15 }, this.scene);
        obj.position.y = 325;
        obj.position.x = -250;
        obj.visibility = 0.3;

        var obj2 = new BABYLON.Mesh.CreateDisc("", 10, 64, this.scene);
        var objmat = new BABYLON.StandardMaterial("", this.scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/common/endlvl.png", this.scene);

        obj2.material = objmat;
        obj2.position.y = 355;
        obj2.position.x = -250;


        this.endlvl = obj;

    }

}