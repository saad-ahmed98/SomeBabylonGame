class LVL2 extends LVLAbstract {
    constructor(gameconfig,animate=true) {
        imageLoading = "images/LVL2/loading.png"
        titleLoading = "images/LVL2/title.png"
        super(gameconfig, "lvl2",animate);
        console.log("lvl2")
        
    }

    createLvl() {
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
        console.log("x:"+this.player.mesh.position.x+",y:"+this.player.mesh.position.y)
        if (this.player.mesh.position.y < -70) {
            this.scene.activeCamera.lockedTarget = null
            if (!this.gui.showinggui)
                this.gui.createGameOverScreen()
        }
        if(this.cameraAnimation)
            {  if(!this.animate){
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

        this.playBGM(0.3);
    }

    loadAssets() {
        this.loadPlayer();
        this.loadEnemies();
        this.loadSounds();
        this.loadSkybox("images/LVL2/skybox.jpg");
        this.loadDecor();
    }

    loadSounds(){
        super.loadSounds()
        this.loadEnemySound()

        var instance = this
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

        var binaryTask = assetsManager.addBinaryFileTask(
            "bgm",
            "sounds/lvl2music.mp3"
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

    loadEnemies() {
        var instance = this;
        this.scene.assets.enemy1 = []
        this.scene.assets.animations1 = []
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
    }
    loadDecor() {
        var instance = this;
        let meshTask = this.scene.assetsManager.addMeshTask(
            "door task",
            "",
            "models/",
            "LVL2/door.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.door = task.loadedMeshes[0]

        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "carpet task",
            "",
            "models/",
            "LVL2/carpet.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.carpet = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "candel task",
            "",
            "models/",
            "LVL2/candel.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.candel = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "chest task",
            "",
            "models/",
            "LVL2/chest.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.chest = task.loadedMeshes[0]
            instance.scene.assets.chesttop = task.loadedMeshes[1]
            //task.loadedMeshes[1].dispose()
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "c task",
            "",
            "models/",
            "LVL2/column.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.column = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "cb1 task",
            "",
            "models/",
            "LVL2/columnB1.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.columnB1 = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "cb2 task",
            "",
            "models/",
            "LVL2/columnB2.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.columnB2 = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "entrance task",
            "",
            "models/",
            "LVL2/entrancedg.babylon"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.entrancedg = task.loadedMeshes[0]
        };

        meshTask = this.scene.assetsManager.addMeshTask(
            "bookcase task",
            "",
            "models/",
            "LVL2/bookcase.babylon"
        );

        meshTask.onSuccess = function (task) {
            
            instance.scene.assets.bookcase = task.loadedMeshes[0]
            var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("environmentSpecular.env", instance.scene);
            instance.scene.environmentTexture = hdrTexture;
            
        };
    }

    createDecor(){

        //candels

        var obj = this.scene.assets.candel
        obj.position.x = -600
        obj.position.y = 225
        obj.scaling.x = 12
        obj.scaling.y = 12
        obj.scaling.z = 12
        obj.position.z = 30

        var obj2 = obj.clone()
        obj2.position.x = -650

        obj2 = obj.clone()
        obj2.position.x = -700

        obj2 = obj.clone()
        obj2.position.x = -500

        obj2 = obj.clone()
        obj2.position.x = -550

        obj2 = obj.clone()
        obj2.position.x = -550

        obj2 = obj.clone()
        obj2.position.x = -650

        obj2 = obj.clone()
        obj2.position.x = -780
        obj2.position.y = 0

        obj2 = obj.clone()
        obj2.position.x = -760
        obj2.position.y = 0

        obj2 = obj.clone()
        obj2.position.x = 440
        obj2.position.y = 310
        obj2.position.z = 10

        obj2 = obj.clone()
        obj2.position.x = 390
        obj2.position.y = 310
        obj2.position.z = 10

        var obj = this.scene.assets.chest
        obj.position.x = -770
        obj.position.y = 5
        obj.position.z = 10
        obj.scaling.x = 10
        obj.scaling.y = 10
        obj.scaling.z = 10
        obj.rotation.y  =   Math.PI/2;

        var obj = this.scene.assets.chesttop
        obj.position.x = -770
        obj.position.y = 5
        obj.position.z = 13
        obj.scaling.x = 10
        obj.scaling.y = 10
        obj.scaling.z = 10
        obj.rotation.y  =   Math.PI/2;


        var obj = this.scene.assets.column
        obj.position.x = -550
        obj.position.y = 0
        obj.position.z = 30
        obj.scaling.x = 10
        obj.scaling.y = 10
        obj.scaling.z = 10

        obj2 = obj.clone()
        obj2.position.x = -580

        var obj = this.scene.assets.columnB1
        obj.position.x = -610
        obj.position.y = 0
        obj.position.z = 30
        obj.scaling.x = 10
        obj.scaling.y = 10
        obj.scaling.z = 10

        var obj = this.scene.assets.columnB2
        obj.position.x = -650
        obj.position.y = 0
        obj.position.z = 30
        obj.scaling.x = 10
        obj.scaling.y = 10
        obj.scaling.z = 10

        var obj = this.scene.assets.entrancedg
        obj.position.x = -490
        obj.position.y = 0
        obj.position.z = 0
        obj.scaling.x = 16
        obj.scaling.y = 16
        obj.scaling.z = 16


        //carpets
        var obj = this.scene.assets.carpet
        obj.position.x = -480
        obj.position.y = 224
        obj.scaling.x = 10
        obj.scaling.y = 10
        obj.scaling.z = 10
        obj.rotation.y  =   Math.PI/2;

        var obj2 = obj.clone()
        obj2.position.x = -680

        obj2 = obj.clone()
        obj2.position.x = -580

        //leap icon
        var obj2 = new BABYLON.Mesh.CreateDisc("", 8, 64, this.scene);
        var objmat = new BABYLON.StandardMaterial("", this.scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/LVL2/leap.png", this.scene);

        obj2.material = objmat;
        obj2.position.x = -400;
        obj2.position.y = 250;
        obj2.position.z = 20;

        //bookcase
        var comp = this.scene.assets.bookcase
        comp.position.x = 470
        comp.position.y = 310
        comp.position.z = 30
        comp.scaling.x = 30
        comp.scaling.y = 30
        comp.scaling.z = 30
        comp.rotation.y  =   Math.PI/2;

        var comp2 = comp.clone()
        comp2.position.x = 370
       

    }
    createScene() {
        this.createPlayer(-770, 400);
        this.scene.clearColor = BABYLON.Color3.Black();

        let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 1687.5, depth: 1, width: 3200 }, this.scene);
        skybox.position.y = 100;
        let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", this.scene);
        skybox.material = skyboxmat;

        skyboxmat.diffuseTexture = this.scene.assets.skybox

        skybox.position.z = 500

        this.createObstacles();
        this.createPickups();
        this.createEnemies();
        this.createDecor();

        this.createEndLevel();

        this.scene.activeCamera =new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(this.endlvl.position.x, this.endlvl.position.y, -500), this.scene);

        this.createLights();

        return this.scene;
    }

    createEnemies() {

        var enemy = new Enemy(25, 20, 5, 0.2, this.player, -550, 200, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        var obst = new CheckpointObstacle(45, 50, 7, [enemy])
        var obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.x = -460;
        obj.position.y = 243;
        obst.mesh = obj;
        obst.createDoor(this.scene)
        this.obstacles.push(obst)

        enemy = new Enemy(25, 20, 5, 0.2, this.player, -700, 20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 5, 0.2, this.player, -600, 20, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)


        enemy = new Enemy(25, 20, 5, 0.2, this.player, 200, 200, 20)
        enemy.createEnemy1(this.scene)
        this.enemies.push(enemy)

        var enemy1 = new Enemy(25, 20, 5, 0.2, this.player, 230, 200, 20)
        enemy1.createEnemy1(this.scene)
        this.enemies.push(enemy1)

        var obst = new CheckpointObstacle(100, 50, 7, [enemy, enemy1])
        var obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.x = 335;
        obj.position.y = 330;

        obst.mesh = obj;
        obst.createDoor(this.scene)
        this.obstacles.push(obst)


    }




    createPickups() {
        var pickup = new Pickup(-770, 10, 2)
        pickup.createSword(this.scene)
        this.pickups.push(pickup);

        pickup = new Pickup(-630, 480, 2)
        pickup.createHPUp(this.scene)
        this.pickups.push(pickup);
    }


    createObstacles() {
        var mat1 = new BABYLON.StandardMaterial("mat1", this.scene);
        mat1.diffuseTexture = new BABYLON.Texture("images/LVL2/bricks2.png", this.scene);

        var mat2 = new BABYLON.StandardMaterial("mat2", this.scene);
        mat2.diffuseTexture = new BABYLON.Texture("images/LVL2/bricks.jpg", this.scene);

        var obstt = []
        var obj;
        var obst = new Obstacle(100, 100, 350)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -50;
        obj.position.x = -650;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = mat2


        var obst = new Obstacle(150, 100, 250)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 150;
        obj.position.x = -760;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = mat1

        var obst = new Obstacle(150, 100, 250)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 150;
        obj.position.x = -760+obst.width;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = mat1


        var obst = new Obstacle(200, 100, 300)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 370;
        obj.position.x = -600;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = mat1


        obst = new Obstacle(170, 99, 100)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 310+obst.height;
        obj.position.x = -835;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = mat1

        obst = new Obstacle(170, 99, 100)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 310;
        obj.position.x = -835;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = mat1



        obst = new MovingPlatform(10, 50, 60, -300, 130, 130, "y", 1.2)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 130;
        obj.position.x = -300;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new MovingPlatform(10, 50, 60, -300, 150, 110, "x", 1.5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 0;
        obj.position.x = -400;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new MovingPlatform(10, 50, 60, -200, 100, 70, "x", 1.5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 100;
        obj.position.x = -200;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new MovingPlatform(10, 50, 60, -10, 30, 90, "x", 0.7)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 30;
        obj.position.x = -10;
        obst.mesh = obj;
        obstt.push(obst)



        obstt.push(obst)

        obst = new Obstacle(350, 100, 7)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 250;
        obj.position.x = 70;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = mat1


        obst = new Obstacle(300, 100, 400)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 160;
        obj.position.x = 310;
        obst.mesh = obj;
        obj.material = mat1


        obstt.push(obst)

        this.obstacles = obstt;
    }


    createEndLevel() {
        var obj = new BABYLON.MeshBuilder.CreateBox("", { height: 30, depth: 5, width: 15 }, this.scene);
        obj.position.y = 320;
        obj.position.x = 420;
        obj.visibility = 0;

        var comp = this.scene.assets.door
        comp.parent = obj
        comp.scaling.x = 14
        comp.scaling.y = 14
        comp.scaling.z = 14
        comp.position.z = 20
        comp.position.x = -20
        comp.position.y = 10


        var obj2 = new BABYLON.Mesh.CreateDisc("", 10, 64, this.scene);
        var objmat = new BABYLON.StandardMaterial("", this.scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/common/endlvl.png", this.scene);

        obj2.material = objmat;
        obj2.position.y = 360;
        obj2.position.x = 420;


        this.endlvl = obj;

    }

}