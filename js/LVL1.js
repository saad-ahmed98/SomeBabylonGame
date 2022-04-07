class LVL1 extends LVLAbstract {
    constructor(gameconfig) {
        super(gameconfig,"lvl1");
        this.gui.createTooltip("images/ControlsTooltip.png","400px","200px");
    }

    renderScene() {
        this.gameconfig.divFps.innerHTML = this.gameconfig.engine.getFps().toFixed() + " fps";
        this.gameconfig.rollingAverage.add(this.scene.getAnimationRatio());
        this.player.move();
        this.scene.render();
    }

    loadAssets() {
        this.loadPlayer();
        this.loadSounds();
        this.loadBuildings();
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
        var instance = this;
        /*
        let ground = this.createGround(this.scene);
        const groundMaterial = new BABYLON.GridMaterial("groundMaterial", this.scene);
        ground.material = groundMaterial;
        */
        this.createPlayer(-750, 20);

        let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 1687.5, depth: 1, width: 3200 }, this.scene);
        skybox.position.y = 100;
        let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", this.scene);
        skybox.material = skyboxmat;

        skyboxmat.diffuseTexture = new BABYLON.Texture("images/skybox.jpg", this.scene);

        skybox.position.z = 500

        this.createObstacles();
        this.createPickups();
        this.createEndLevel();


        let followCamera = this.createFollowCamera(150);
        this.scene.activeCamera = followCamera;

        this.createLights();


        this.player.move = () => {
            if (this.player.position.y < -20) {
                this.scene.activeCamera.lockedTarget = null
                if(!instance.gui.showinggui)
                this.gui.createGameOverScreen()

            }

            if (this.player.animationGroups != undefined) {

                let idle = true;
                this.waveMovingPlatforms();
                this.collisionMovingPlatforms();
                this.wavePickups();
                this.contactPickups();
                this.contactEndLevel();
                if(!this.jumping){
                    this.player.position.y = this.player.position.y-2.2
                    this.player.animationGroups[1].play()
                }

                if (this.player.animationGroups[5]._isStarted == false)
                    this.isattacking = false;

                if (this.gameconfig.inputStates.space) {
                    idle = false
                    if (this.walljumpingleft && this.walljump < 25 && this.haswalljump) {
                        if (this.walljump < 15)
                            this.gameconfig.inputStates.right = false;
                        this.player.moveWithCollisions(new BABYLON.Vector3(-0.7 * this.gameconfig.rollingAverage.average * this.player.speed, 0, 0));
                        this.player.moveWithCollisions(new BABYLON.Vector3(0, 2 * this.gameconfig.rollingAverage.average * this.player.speed, 0));
                        this.player.lookAt(new BABYLON.Vector3(-10000000, 0, 0));
                        followCamera.rotationOffset = -90
                        this.lookAt = -1
                        this.walljump++;

                    }
                    else {
                        if (this.walljumpingright && this.walljump < 25 && this.haswalljump) {
                            if (this.walljump < 15)
                                this.gameconfig.inputStates.left = false;
                            this.player.moveWithCollisions(new BABYLON.Vector3(0.7 * this.gameconfig.rollingAverage.average * this.player.speed, 0, 0));
                            this.player.moveWithCollisions(new BABYLON.Vector3(0, 2 * this.gameconfig.rollingAverage.average * this.player.speed, 0));
                            this.player.lookAt(new BABYLON.Vector3(10000000, 0, 0));
                            followCamera.rotationOffset = 90
                            this.lookAt = 1
                            this.walljump++;
                        }
                        else {
                            if (this.jumping || this.gameconfig.jumpingstarted < 30) {
                                this.player.moveWithCollisions(new BABYLON.Vector3(0, 2 * this.gameconfig.rollingAverage.average * this.player.speed, 0));
                                this.player.lookAt(new BABYLON.Vector3(this.lookAt * 10000000, 0, 0));
                                this.gameconfig.updateJump()
                                this.jumping = false;
                            }
                        }
                    }
                    this.player.animationGroups[1].play()
                }
                if (this.gameconfig.inputStates.up) {
                }
                if (this.gameconfig.inputStates.down) {

                }
                if (this.gameconfig.inputStates.left) {
                    idle = false

                    this.player.moveWithCollisions(new BABYLON.Vector3(-1 * this.gameconfig.rollingAverage.average * this.player.speed, 0, 0));
                    this.player.lookAt(new BABYLON.Vector3(-10000000, 0, 0));
                    followCamera.rotationOffset = -90
                    this.lookAt = -1
                    if (this.jumping && !this.isattacking)
                        this.player.animationGroups[4].play()
                }
                if (this.gameconfig.inputStates.right) {
                    idle = false

                    this.player.moveWithCollisions(new BABYLON.Vector3(1 * this.gameconfig.rollingAverage.average * this.player.speed, 0, 0));
                    this.player.lookAt(new BABYLON.Vector3(10000000, 0, 0));
                    followCamera.rotationOffset = 90
                    this.lookAt = 1
                    if (this.jumping && !this.isattacking)
                        this.player.animationGroups[4].play()

                }

                if (this.gameconfig.inputStates.attack) {
                    idle = false
                    if (!this.isattacking) {
                        this.isattacking = true;
                        this.player.animationGroups[5].play()
                        //swingSword(this.scene,this.player)
                    }
                }

                if (idle && this.walljump && this.jumping) {
                    for (let i = 0; i < this.player.animationGroups; i++) {
                        this.player.animationGroups[i].stop()
                    }
                    this.player.animationGroups[2].play(true)
                }
            }
        }
        return this.scene;
    }

    contactEndLevel() {
        if (Math.abs(this.endlvl.position.x -this.player.position.x) <= 10 && Math.abs(this.endlvl.position.y -this.player.position.y) <= 10) {
            if(!this.gui.showinggui)
            this.gui.createLevelClearScreen()
        }
    }

    createPickups() {
        this.pickups = [];

        var obj = new BABYLON.Mesh.CreateDisc("", 5, 64, this.scene);
        var objmat = new BABYLON.StandardMaterial("", this.scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/walljump.png", this.scene);
        obj.material = objmat;
        obj.position.y = 12;
        obj.position.x = 500;

        var pickup = new Pickup(obj.position.y, 2, obj)
        this.pickups.push(pickup);

        /*var particleSystem = new BABYLON.ParticleSystem("particles", 10, this.scene);
        particleSystem.maxScaleX = 2;
        particleSystem.maxScaleY = 2;
    
    
        var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, this.scene);
        noiseTexture.animationSpeedFactor = 5;
        noiseTexture.persistence = 2;
        noiseTexture.brightness = 0.5;
        noiseTexture.octaves = 2;
        particleSystem.noiseTexture = noiseTexture;
        particleSystem.noiseStrength = new BABYLON.Vector3(100, 100, 100);
        particleSystem.particleTexture = new BABYLON.Texture("images/flare.png");
        particleSystem.emitter = pickup.mesh;
        particleSystem.start();
        */

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

        obst = new MovingPlatform(10,50,60,-90, 125, 20, "y")
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