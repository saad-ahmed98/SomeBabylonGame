class LVL3 extends LVLAbstract {
    constructor(gameconfig,animate=true) {
        imageLoading = "images/LVL3/loading.png"
        titleLoading = "images/LVL3/title.png"
        super(gameconfig, "lvl3",animate);
        console.log("lvl3")
        

        this.elevator;

        this.checkpoint = 1
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
        this.contactEndLevel();
        this.moveEnemies();
        this.moveElevator();
        console.log("x:" + this.player.mesh.position.x + ",y:" + this.player.mesh.position.y)
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
    }

    loadAssets() {
        this.loadPlayer();
        this.loadEnemies();
        this.loadSounds();
        this.loadSkybox("images/LVL3/skybox.jpg");
        this.loadDecor()
    }

    loadDecor(){
        var instance = this;
        let meshTask = this.scene.assetsManager.addMeshTask(
            "computer task",
            "",
            "models/",
            "LVL3/computer.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.computer = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "door task",
            "",
            "models/",
            "LVL3/door.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.door = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "torch task",
            "",
            "models/",
            "LVL3/torch.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.torch = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "pod task",
            "",
            "models/",
            "LVL3/pod.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.pod = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "switch task",
            "",
            "models/",
            "LVL3/switch.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.switch = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "tile task",
            "",
            "models/",
            "LVL3/tile.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.tile = task.loadedMeshes[0]
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
        super.loadSounds()
        this.loadEnemySound()
        this.loadEnemy2Sound()
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
            "elevator",
            "sounds/elevator.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.elevator = new BABYLON.Sound(
                "elevator",
                task.data,
                this.scene,
                null,
                {
                    loop: false,
                }
            );
        };

        binaryTask = assetsManager.addBinaryFileTask(
            "alert",
            "sounds/alert.mp3"
        );
        binaryTask.onSuccess = function (task) {
            instance.scene.assets.alert = new BABYLON.Sound(
                "alert",
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
            "sounds/lvl3music.mp3"
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

    createDecor(){

        //torches
        var obj = this.scene.assets.torch
        obj.position.x = -625
        obj.position.y = 200
        obj.scaling.x = 10
        obj.scaling.y = 10
        obj.scaling.z = 10

        for(let i = 0;i<7;i++){
            var obj2 = obj.clone()
            obj2.position.y = obj.position.y-(200*(i+1))
        }

        var obj = obj.clone()
        obj.position.x = -199.5
        obj.rotation.y  =   Math.PI;

        for(let i = 0;i<6;i++){
            var obj2 = obj.clone()
            obj2.position.y = obj.position.y-(200*(i+1))
        }
        
        var obj = this.scene.assets.pod
        obj.position.x = -60
        obj.position.y = -1199
        obj.position.z = 30
        obj.scaling.x = 12
        obj.scaling.y = 12
        obj.scaling.z = 12

        var obj2 = obj.clone()
        obj2.position.x = -100

        var obj2 = obj.clone()
        obj2.position.x = -20

    }

    createScene() {
        this.createPlayer(-770, 235);
        this.scene.clearColor = BABYLON.Color3.Black();

        this.player.updateWeapon()
        let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 6700.8, depth: 1, width: 3200 }, this.scene);
        skybox.position.y = 100;
        let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", this.scene);
        skybox.material = skyboxmat;

        skyboxmat.diffuseTexture = this.scene.assets.skybox

        skybox.position.z = 500


        this.createObstacles();
        this.createEndLevel();
        this.createDecor();


        var instance = this
        new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), this.scene);
        setTimeout(function(){
            let followCamera = instance.createFollowCamera(150);
            instance.scene.activeCamera = followCamera;

        },100)

        this.createLights();

        return this.scene;
    }

    createWave1() {
        this.elevator.alertSound(this.scene)
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
        this.elevator.alertSound(this.scene)

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

        var enemy = new Enemy(40, 15, 10, 0.5, this.player, -300, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

    }


    createWave3() {
        this.elevator.alertSound(this.scene)
        var enemy = new Enemy(25, 20, 10, 0.2, this.player, -500, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

        var enemy = new Enemy(40, 15, 10, 0.5, this.player, -300, this.elevator.mesh.position.y+20, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)
        this.elevator.enemies.push(enemy)

    }

    createObstacles() {
        var obstt = []
        var obj;

        var colorMaterial = new BABYLON.StandardMaterial("", this.scene);
        colorMaterial.diffuseTexture = new BABYLON.Texture("images/LVL3/metal.jpg", this.scene);


        var obst = new Obstacle(2000, 200, 300)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -770;
        obj.position.x = -775;
        obj.position.z = -1;

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

        var colorMaterial = new BABYLON.StandardMaterial("", this.scene);
        colorMaterial.diffuseTexture = new BABYLON.Texture("images/LVL3/metal2.jpg", this.scene);


        obst = new Obstacle(200, 200, 500)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -1300;
        obj.position.x = 80;
        obst.mesh = obj;
        obstt.push(obst)
        obst.mesh.material = colorMaterial


        obst = new Obstacle(100, 100, 5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -1150;
        obj.position.x = 40;
        obj.visibility = 0
        obst.mesh = obj;
        obstt.push(obst)
        obst.mesh.material = colorMaterial

        var comp = this.scene.assets.door
        comp.parent = obj
        comp.scaling.x = 30
        comp.scaling.y = 30
        comp.scaling.z = 30
        comp.position.y = -50
        comp.rotation.y  =   Math.PI/2;


        obst = new Elevator(10, 100, 300, -1200)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 215;
        obj.position.x = -400;
        obst.mesh = obj;

        obst.addDetails(this.scene)


        this.elevator = obst
        obstt.push(obst)

        this.obstacles = obstt;

    }

    moveElevator(){
        if(this.elevator.hasStarted)
            this.playBGM(0.3);
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
        obj.position.x = 20;
        obj.visibility = 0;

        var obj2 = new BABYLON.Mesh.CreateDisc("", 10, 64, this.scene);
        var objmat = new BABYLON.StandardMaterial("", this.scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/common/endlvl.png", this.scene);

        obj2.material = objmat;
        obj2.position.y = -1150;
        obj2.position.x = 20;


        this.endlvl = obj;

        var comp = this.scene.assets.computer
        comp.position.x = 20
        comp.position.y = -1200
        comp.scaling.x = 12
        comp.scaling.y = 12
        comp.scaling.z = 12
        comp.position.z = 10


    }

}