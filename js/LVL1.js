class LVL1 extends LVLAbstract {
    constructor(gameconfig) {
        super(gameconfig, "lvl1");
        console.log("lvl1")
        this.gui.createTooltip("images/ControlsTooltip.png", "400px", "200px");
    }

    renderScene() {
        this.gameconfig.divFps.innerHTML = this.gameconfig.engine.getFps().toFixed() + " fps";
        this.gameconfig.rollingAverage.add(this.scene.getAnimationRatio());
        this.waveMovingPlatforms();
        this.collisionObstacles();
        this.wavePickups();
        this.contactPickups();
        this.contactEndLevel();

        if (this.player.mesh.position.y < -30) {
            this.scene.activeCamera.lockedTarget = null
            if (!this.gui.showinggui)
                this.gui.createGameOverScreen()
        }
        if(this.player.hp>0)
        this.player.move(this.scene.activeCamera,this.enemies);
        this.playBGM(0.3);
        this.scene.render();
    }

    loadAssets() {
        this.loadPlayer();
        this.loadSounds();
        this.loadBuildings();
        this.loadSkybox("images/skybox.jpg");
    }

    loadSounds(){
        super.loadSounds()
        var instance = this;
        var assetsManager = instance.scene.assetsManager;

        var binaryTask = assetsManager.addBinaryFileTask(
            "bgm",
            "sounds/lvl1music.mp3"
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

    loadBuildings() {
        var instance = this;
        let meshTask = this.scene.assetsManager.addMeshTask(
            "6story task",
            "",
            "models/",
            "LVL1/6Story_Balcony.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.sixstorybalcony = task.loadedMeshes[1]
        };

        meshTask = instance.scene.assetsManager.addMeshTask(
            "3story task",
            "",
            "models/",
            "LVL1/3Story_Balcony.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.threestorybalcony = task.loadedMeshes[1]
        };

        meshTask = instance.scene.assetsManager.addMeshTask(
            "2story wide task",
            "",
            "models/",
            "LVL1/2Story_Wide.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.twostorywide = task.loadedMeshes[1]
        };

        meshTask = instance.scene.assetsManager.addMeshTask(
            "4story center task",
            "",
            "models/",
            "LVL1/4Story_Center.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.fourstorycenter = task.loadedMeshes[1]
        };

        meshTask = instance.scene.assetsManager.addMeshTask(
            "building2 task",
            "",
            "models/",
            "LVL1/Building2_Large.glb"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.buildingtwolarge = task.loadedMeshes[0]
        };
    }


    createScene() {

        this.createPlayer(-750, 20);

        let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 1687.5, depth: 1, width: 3200 }, this.scene);
        skybox.position.y = 100;
        let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", this.scene);
        skybox.material = skyboxmat;

        skyboxmat.diffuseTexture = this.scene.assets.skybox

        skybox.position.z = 500

        this.createObstacles();
        this.createPickups();
        this.createEndLevel();


        var instance = this
        new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), this.scene);
        setTimeout(function(){
            let followCamera = instance.createFollowCamera(150);
            instance.scene.activeCamera = followCamera;

        },100)

        this.createLights();

        return this.scene;
    }

    contactEndLevel() {
        if (Math.abs(this.endlvl.position.x - this.player.mesh.position.x) <= 10 && Math.abs(this.endlvl.position.y - this.player.mesh.position.y) <= 10) {
            if (!this.gui.showinggui)
                this.gui.createLevelClearScreen()
        }
    }

    createPickups() {
        var pickup = new Pickup(500,12, 2)
        pickup.createWalljump(this.scene)
        this.pickups.push(pickup);

        pickup = new Pickup(-70,10, 2)
        pickup.createHPUp(this.scene)
        this.pickups.push(pickup);

    }


    createObstacles() {
        var obstt = []
        var obj;
        var obst = new Obstacle(100, 100, 300)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -50;
        obj.position.x = -650;
        obst.mesh = obj;
        obj.visibility = 0;
        let building = this.scene.assets.twostorywide.clone("building1");
        building.parent = obj;
        building.scaling.x = 80;
        building.scaling.y = 50;
        building.scaling.z = 80;
        building.rotation = new BABYLON.Vector3(0, 3.15, 0);
        building.position.y = -78;

        obstt.push(obst)

        obst = new Obstacle(180, 100, 200)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -55;
        obj.position.x = -355;
        obst.mesh = obj;
        obj.visibility = 0;

        building = this.scene.assets.twostorywide.clone("building2");
        building.parent = obj;
        building.scaling.x = 55;
        building.scaling.y = 50;
        building.scaling.z = 55;
        building.rotation = new BABYLON.Vector3(0, 3.15, 0);
        building.position.y = -38;
        obstt.push(obst)

        obst = new Obstacle(10, 50, 60)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 65;
        obj.position.x = -250;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new Obstacle(10, 50, 60)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 95;
        obj.position.x = -170;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new MovingPlatform(10, 50, 60, -90, 125, 20, "y",1)
        //obst = new Obstacle(10, 50, 60)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 125;
        obj.position.x = -90;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new Obstacle(80, 100, 200)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -40;
        obj.position.x = -100;
        obst.mesh = obj;
        obj.visibility = 0;

        building = this.scene.assets.fourstorycenter.clone("building3");
        building.parent = obj;
        building.scaling.x = 70;
        building.scaling.y = 60;
        building.scaling.z = 65;
        building.rotation = new BABYLON.Vector3(0, 3.15, 0);
        building.position.y = -255;
        building.position.x = -15;


        obstt.push(obst)

        obst = new Obstacle(320, 100, 130)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -40;
        obj.position.x = 35;
        obst.mesh = obj;
        obj.visibility = 0;

        building = this.scene.assets.fourstorycenter.clone("building4");
        building.parent = obj;
        building.scaling.x = 55;
        building.scaling.y = 45;
        building.scaling.z = 50;
        building.rotation = new BABYLON.Vector3(0, 3.15, 0);
        building.position.y = -62;
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
        obj.visibility = 0;
        building = this.scene.assets.twostorywide.clone("building5");
        building.parent = obj;
        building.scaling.x = 80;
        building.scaling.y = 50;
        building.scaling.z = 80;
        building.rotation = new BABYLON.Vector3(0, 3.15, 0);
        building.position.y = -78;

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

        obj.visibility = 0;
        building = this.scene.assets.buildingtwolarge.clone("building5");
        building.parent = obj;
        building.scaling.x = 52;
        building.scaling.y = 52;
        building.scaling.z = 30;
        building.rotation = new BABYLON.Vector3(0, 3.15, 0);
        building.position.y = -147;

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