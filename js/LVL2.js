class LVL2 extends LVLAbstract {
    constructor(gameconfig) {
        super(gameconfig,"lvl2");
        console.log("lvl2")
    }

    renderScene() {
        this.gameconfig.divFps.innerHTML = this.gameconfig.engine.getFps().toFixed() + " fps";
        this.gameconfig.rollingAverage.add(this.scene.getAnimationRatio());
        this.waveMovingPlatforms();
        this.collisionObstacles();
        this.verifyLifeEnemies();
        this.collisionObstaclesEnemies();
        this.collisionPlayerEnemies();
        this.wavePickups();
        this.contactPickups();
        this.contactEndLevel();
        this.moveEnemies();
        if (this.player.mesh.position.y < -70) {
            this.scene.activeCamera.lockedTarget = null
            if (!this.gui.showinggui)
                this.gui.createGameOverScreen()
        }

        this.player.move(this.scene.activeCamera,this.enemies);

        if(this.player.hp<=0){
            if (!this.gui.showinggui)
                this.gui.createGameOverScreen()
        }

        this.scene.render();
    }

    loadAssets() {
        this.loadPlayer();
        this.loadEnemies();
        this.loadSounds();
        //this.loadBuildings();
    }

    loadEnemies(){
        var instance = this;
        this.scene.assets.enemy1 = []
        this.scene.assets.animations1 =[]
        for(let i = 0;i<3;i++){
        let meshTask = this.scene.assetsManager.addMeshTask(
            "enemy1 task"+i,
            "",
            "models/",
            "enemy1.gltf"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.enemy1.push(task.loadedMeshes[1])
            instance.scene.assets.animations1.push(task.loadedAnimationGroups)
        };
    }
    }

    loadBuildings() {
        var instance = this;
        let meshTask = this.scene.assetsManager.addMeshTask(
            "6story task",
            "",
            "models/",
            "6Story_Balcony.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.sixstorybalcony = task.loadedMeshes[1]
        };

        meshTask = instance.scene.assetsManager.addMeshTask(
            "3story task",
            "",
            "models/",
            "3Story_Balcony.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.threestorybalcony = task.loadedMeshes[1]
        };

        meshTask = instance.scene.assetsManager.addMeshTask(
            "2story wide task",
            "",
            "models/",
            "2Story_Wide.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.twostorywide = task.loadedMeshes[1]
        };

        meshTask = instance.scene.assetsManager.addMeshTask(
            "4story center task",
            "",
            "models/",
            "4Story_Center.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.fourstorycenter = task.loadedMeshes[1]
        };

        meshTask = instance.scene.assetsManager.addMeshTask(
            "building2 task",
            "",
            "models/",
            "Building2_Large.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.buildingtwolarge = task.loadedMeshes[0]
        };
    }

    loadSounds() {
        var instance = this;
        var assetsManager = instance.scene.assetsManager;
        var binaryTask = assetsManager.addBinaryFileTask(
            "swordSwing",
            "sounds/sword swing.wav"
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
    }


    createScene() {
        this.createPlayer(-770, 400);
        this.player.powers["walljump"] = true

        /*let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 1687.5, depth: 1, width: 3200 }, this.scene);
        skybox.position.y = 100;
        let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", this.scene);
        skybox.material = skyboxmat;

        skyboxmat.diffuseTexture = new BABYLON.Texture("images/skybox.jpg", this.scene);

        skybox.position.z = 500
        */

        this.createObstacles();
        this.createPickups();
        this.createEnemies();

        this.createEndLevel();


        let followCamera = this.createFollowCamera(150);
        this.scene.activeCamera = followCamera;
        console.log(this.scene.activeCamera)

        this.createLights();

        return this.scene;
    }

    contactEndLevel() {
        if (Math.abs(this.endlvl.position.x - this.player.mesh.position.x) <= 10 && Math.abs(this.endlvl.position.y - this.player.mesh.position.y) <= 10) {
            if (!this.gui.showinggui)
                this.gui.createLevelClearScreen()
        }
    }

    createEnemies(){

        //hitbox
        var enemy = new Enemy(25,20,5,0.2,this.player,-700,20,20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25,20,5,0.2,this.player,-600,20,20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)
    }


    createPickups() {
        this.pickups = [];
        var pickup = new Pickup(-770, 10, 2)
        pickup.createSword(this.scene)
        this.pickups.push(pickup);
    }


    createObstacles() {
        var obstt = []
        var obj;
        var obst = new Obstacle(100, 100, 350)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -50;
        obj.position.x = -650;
        obst.mesh = obj;
        obstt.push(obst)

        var obst = new Obstacle(150, 100, 500)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 150;
        obj.position.x = -650;
        obst.mesh = obj;
        obstt.push(obst)

        var obst = new Obstacle(200, 100, 300)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 370;
        obj.position.x = -600;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new Obstacle(1000, 100, 600)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -55;
        obj.position.x = -1100;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new MovingPlatform(10, 50, 60, -300, 130, 130, "y",1.2)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 130;
        obj.position.x = -300;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new MovingPlatform(10, 50, 60, -300, 150, 110, "x",1.5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 0;
        obj.position.x = -400;
        obst.mesh = obj;
        obstt.push(obst)
        


        obst = new Obstacle(320, 100, 130)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -40;
        obj.position.x = 35;
        obst.mesh = obj;

        obstt.push(obst)

        obst = new Obstacle(10, 70, 100)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 65;
        obj.position.x = 250;
        obst.mesh = obj;
        obstt.push(obst)



        var obst = new Obstacle(100, 100, 300)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -50;
        obj.position.x = 500;
        obst.mesh = obj;

        obstt.push(obst)

        var obst = new Obstacle(100, 100, 7)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 80;
        obj.position.x = 640;
        obst.mesh = obj;
        obstt.push(obst)

        var obst = new Obstacle(300, 100, 300)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -65;
        obj.position.x = 830;
        obst.mesh = obj;


        obstt.push(obst)

        this.obstacles = obstt;
    }

    createGround() {
        var ground = BABYLON.MeshBuilder.CreateBox("Ground", { depth: 100, width: 2500, height: 50 }, this.scene);
        ground.position.y = -180;
        ground.checkCollisions = true;
        return ground;
    }

    createEndLevel() {
        var obj = new BABYLON.MeshBuilder.CreateBox("", { height: 30, depth: 5, width: 15 }, this.scene);
        obj.position.y = 90;
        obj.position.x = 850;
        obj.visibility = 0.3;

        var obj2 = new BABYLON.Mesh.CreateDisc("", 10, 64, this.scene);
        var objmat = new BABYLON.StandardMaterial("", this.scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/endlvl.png", this.scene);

        obj2.material = objmat;
        obj2.position.y = 130;
        obj2.position.x = 850;


        this.endlvl = obj;

    }

    createLights() {
        // i.e sun light with all light rays parallels, the vector is the direction.
        let light0 = new BABYLON.HemisphericLight("dir0", new BABYLON.Vector3(1, 8, -10), this.scene);
        light0.intensity = 1;


    }

}