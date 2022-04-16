class LVL3 extends LVLAbstract {
    constructor(gameconfig) {
        super(gameconfig, "lvl3");
        console.log("lvl3")

        this.elevator;

        this.checkpoint = 1
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
        this.moveElevator();
        //console.log("x:" + this.player.mesh.position.x + ",y:" + this.player.mesh.position.y)
        if (this.player.mesh.position.y < -1240) {
            this.scene.activeCamera.lockedTarget = null
            if (!this.gui.showinggui)
                this.gui.createGameOverScreen()
        }
        

        this.player.move(this.scene.activeCamera, this.enemies);

        if (this.player.hp <= 0) {
            if (!this.gui.showinggui)
                this.gui.createGameOverScreen()
        }

        this.scene.render();
    }

    loadAssets() {
        this.loadPlayer();
        this.loadEnemies();
        this.loadSounds();
        this.loadSkybox();
        this.loadDecor()
    }

    loadDecor(){
        var instance = this;
        let meshTask = this.scene.assetsManager.addMeshTask(
            "computer task",
            "",
            "models/",
            "computer.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.computer = task.loadedMeshes[0]
        };
    }

    loadEnemies() {
        var instance = this;
        this.scene.assets.enemy1 = []
        this.scene.assets.animations1 = []

        this.scene.assets.enemy2 = []
        this.scene.assets.animations2 = []

        for (let i = 0; i < 7; i++) {
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

    loadSkybox() {
        var instance = this;
        var assetsManager = instance.scene.assetsManager;

        var textureTask = assetsManager.addTextureTask("image task", "images/elevatorbox.png");
        textureTask.onSuccess = function (task) {
            instance.scene.assets.skybox = task.texture
        }
    }



    createScene() {
        this.createPlayer(-770, 280);

        this.player.updateWeapon()


        let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 1780, depth: 1, width: 454.5 }, this.scene);
        skybox.position.y = -450;
        skybox.position.x = -400;
        let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", this.scene);
        skybox.material = skyboxmat;
        skyboxmat.diffuseTexture = this.scene.assets.skybox
        skybox.position.z = 100

        this.createObstacles();
        this.createEndLevel();

        let followCamera = this.createFollowCamera(150);
        this.scene.activeCamera = followCamera;

        this.createLights();

        return this.scene;
    }

    contactEndLevel() {
        if (Math.abs(this.endlvl.position.x - this.player.mesh.position.x) <= 10 && Math.abs(this.endlvl.position.y - this.player.mesh.position.y) <= 10) {
            if (!this.gui.showinggui)
                this.gui.createLevelClearScreen()
        }
    }

    createWave1() {
        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -500, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -450, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -350, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -300, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

    }

    createWave2() {
        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -500, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -450, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -450, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

        var enemy = new Enemy(40, 15, 10, 0.5, this.player, -300, this.elevator.mesh.position.y+50, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

    }


    createWave3() {

        var enemy = new Enemy(25, 20, 10, 0.2, this.player, -500, this.elevator.mesh.position.y+50, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

        var enemy = new Enemy(40, 15, 10, 0.5, this.player, -300, this.elevator.mesh.position.y+50, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

    }

    createObstacles() {
        var obstt = []
        var obj;

        var colorMaterial = new BABYLON.StandardMaterial("", this.scene);
        colorMaterial.diffuseColor = new BABYLON.Color3(0.63, 0.63, 0.64);


        var obst = new Obstacle(2000, 200, 300)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -770;
        obj.position.x = -775;
        obst.mesh = obj;
        obstt.push(obst)

        obst.mesh.material = colorMaterial


        obst = new Obstacle(1000, 200, 500)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 0;
        obj.position.x = -1100;
        obst.mesh = obj;
        obstt.push(obst)
        obst.mesh.material = colorMaterial


        obst = new Obstacle(2200, 200, 500)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 0;
        obj.position.x = 50;
        obst.mesh = obj;
        obstt.push(obst)
        obst.mesh.material = colorMaterial

        obst = new Obstacle(200, 200, 500)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -1300;
        obj.position.x = 80;
        obst.mesh = obj;
        obstt.push(obst)
        obst.mesh.material = colorMaterial

        var colorMaterial = new BABYLON.StandardMaterial("", this.scene);
        colorMaterial.diffuseColor = new BABYLON.Color3(1, 0.68, 0);

        obst = new Obstacle(200, 200, 5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -1100;
        obj.position.x = 40;
        obst.mesh = obj;
        obstt.push(obst)
        obst.mesh.material = colorMaterial


        obst = new Elevator(10, 100, 300, -1200)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 215;
        obj.position.x = -400;
        obst.mesh = obj;


        var colorMaterial = new BABYLON.StandardMaterial("", this.scene);
        colorMaterial.diffuseColor = new BABYLON.Color3(0.34, 0.34, 0.35);
        obst.mesh.material = colorMaterial
        this.elevator = obst
        obstt.push(obst)

        this.obstacles = obstt;

    }

    createGround() {
        var ground = BABYLON.MeshBuilder.CreateBox("Ground", { depth: 100, width: 2500, height: 50 }, this.scene);
        ground.position.y = -180;
        ground.checkCollisions = true;
        return ground;
    }

    moveElevator(){
        this.elevator.move();
        this.elevator.verifyLifeEnemies();
        
        switch(this.checkpoint){
            case 1 :
                if(this.elevator.mesh.position.y<-200){
                    this.createWave1()
                    this.checkpoint = 2
                }
                    break
            case 2 :
                if(this.elevator.mesh.position.y<-600){
                    this.createWave2()
                    this.checkpoint = 3
                }

            case 3 :
                if(this.elevator.mesh.position.y<-1000){
                    this.createWave3()
                    this.checkpoint = 4
                }
                
        }
        
    }

    createEndLevel() {
        var obj = new BABYLON.MeshBuilder.CreateBox("", { height: 30, depth: 5, width: 15 }, this.scene);
        obj.position.y = -1190;
        obj.position.x = -10;
        obj.visibility = 0.3;

        var obj2 = new BABYLON.Mesh.CreateDisc("", 10, 64, this.scene);
        var objmat = new BABYLON.StandardMaterial("", this.scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/endlvl.png", this.scene);

        obj2.material = objmat;
        obj2.position.y = -1150;
        obj2.position.x = -10;


        this.endlvl = obj;

        var comp = this.scene.assets.computer
        comp.position.x = 20
        comp.position.y = -1200
        comp.scaling.x = 12
        comp.scaling.y = 12
        comp.scaling.z = 12
        comp.position.z = 10


    }

    createLights() {
        // i.e sun light with all light rays parallels, the vector is the direction.
        let light0 = new BABYLON.HemisphericLight("dir0", new BABYLON.Vector3(1, 8, -10), this.scene);
        light0.intensity = 1;


    }

}