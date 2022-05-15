class LVL5 extends LVLAbstract {
    constructor(gameconfig,animate=true) {
        imageLoading = "images/LVL5/loading.png"
        titleLoading = "images/LVL5/title.png"
        super(gameconfig, "lvl5",animate);
        console.log("lvl5")
       
        this.boss;
        this.generators = []
    }

    createLvl() {
        this.gameconfig.divFps.innerHTML = this.gameconfig.engine.getFps().toFixed() + " fps";
        this.gameconfig.rollingAverage.add(this.scene.getAnimationRatio());
        this.waveMovingPlatforms();
        this.collisionObstacles();
        this.verifyLifeEnemies();
        this.collisionObstaclesEnemies();
        this.collisionPlayerEnemies();
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
        
            this.animateCamera(true,"images/LVL5/GeneratorTooltip.png","150px")
            
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

    contactEndLevel(){
        let destroyed = 0
        for(let i = 0;i<this.generators.length;i++){
            if(this.generators[i].hp<=0)
            destroyed++
        }
        if(destroyed>=3){
        if (!this.gui.showinggui)
        this.gui.createLevelClearScreen()
        }
    }

    loadAssets() {
        this.loadPlayer();
        this.loadEnemies();
        this.loadSounds();
        this.loadDecor();
        this.loadSkybox("images/LVL2/skybox.jpg");

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
        /*
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
        */
    }

    loadEnemies() {
        var instance = this;

        this.scene.assets.enemy2 = []
        this.scene.assets.animations2 = []

        this.scene.assets.enemy3 = []
        this.scene.assets.animations3 = []

        this.scene.assets.generators = []

        for (let i = 0; i < 4; i++) {
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
        for (let i = 0; i < 5; i++) {
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

        for (let i = 0; i < 3; i++) {
            let meshTask = this.scene.assetsManager.addMeshTask(
                "gen task" + i,
                "",
                "models/",
                "LVL5/generator.babylon"
            );

            meshTask.onSuccess = function (task) {
                instance.scene.assets.generators.push(task.loadedMeshes[0])
            };
        }

        let meshTask = this.scene.assetsManager.addMeshTask(
            "boss task",
            "",
            "models/",
            "LVL5/boss.gltf"
        );

        meshTask.onSuccess = function (task) {
            instance.scene.assets.boss = task.loadedMeshes[1]
            instance.scene.assets.bossanimation = task.loadedAnimationGroups
        };
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
            "sounds/lvl5music.mp3"
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

        this.scene.clearColor = BABYLON.Color3.Black();

        let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 1687.5, depth: 1, width: 3200 }, this.scene);
        skybox.position.y = 150;
        skybox.position.x = -200;

        let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", this.scene);
        skybox.material = skyboxmat;

        skyboxmat.diffuseTexture = this.scene.assets.skybox

        skybox.position.z = 500

        this.createObstacles();
        this.createEnemies();
        this.createDecor();


        this.scene.activeCamera =new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(-500, 150, -400), this.scene);

        this.createLights();

        return this.scene;
    }

    createDecor(){
        var comp = this.scene.assets.computer
        comp.position.x = -1100
        comp.position.y = -50
        comp.scaling.x = 12
        comp.scaling.y = 12
        comp.scaling.z = 12
        comp.position.z = 10
    }


    createEnemies() {

        this.boss = this.scene.assets.boss;
        this.scene.assets.bossanimation[0].stop()
        this.scene.assets.bossanimation[5].play(true)

        this.boss.scaling.x = 120
        this.boss.scaling.y = 120
        this.boss.scaling.z = 120
        this.boss.position.x = 800
        this.boss.position.z = 120
        this.boss.position.y = -500
        this.boss.rotation = new BABYLON.Vector3(0, 3.15, 0);

        
        var enemy = new Enemy(25, 20, 10, 0.2, this.player, -700, -30, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 10, 0.2, this.player, -750, -30, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 10, 0.2, this.player, -800, -30, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 10, 0.2, this.player, -700, 60, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 10, 0.2, this.player, -750, 60, 20)
        enemy.createEnemy2(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 4, 0.2, this.player, -800, 60, 20)
        enemy.createEnemy3(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 4, 0.2, this.player, -750, 280, 5)
        enemy.createEnemy3(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 4, 0.2, this.player, -600, 280, 10)
        enemy.createEnemy3(this.scene)
        this.enemies.push(enemy)

        enemy = new Enemy(25, 20, 4, 0.2, this.player, -850, 230, 10)
        enemy.createEnemy3(this.scene)
        this.enemies.push(enemy)

        //generators
        var gen  = new Enemy(27, 20, 6, 0.2, this.player, -650, -30, 20)
        gen.createGenerator(this.scene)
        this.enemies.push(gen)
        this.generators.push(gen)

        gen  = new Enemy(27, 20, 6, 0.2, this.player, -930, 80, 20)
        gen.createGenerator(this.scene)
        this.enemies.push(gen)
        this.generators.push(gen)

        gen  = new Enemy(27, 20, 6, 0.2, this.player, -580, 290, 20)
        gen.createGenerator(this.scene)
        this.enemies.push(gen)
        this.generators.push(gen)


    }
    
    createObstacles() {

        var colorMaterial = new BABYLON.StandardMaterial("", this.scene);
        colorMaterial.diffuseTexture = new BABYLON.Texture("images/LVL3/metal2.jpg", this.scene);

        var obstt = []
        var obj;
        var obst = new Obstacle(300, 100, 800)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = -200;
        obj.position.x = -905;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = colorMaterial;

        var obj;
        var obst = new Obstacle(20, 100, 350)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 50;
        obj.position.x = -800;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = colorMaterial;

        obst = new Obstacle(100, 100, 20)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 0;
        obj.position.x = -1070;
        obj.visibility = 0
        obst.mesh = obj;
        obstt.push(obst)
        obst.mesh.material = colorMaterial

        var comp = this.scene.assets.door
        comp.parent = obj
        comp.scaling.x = 30
        comp.scaling.y = 30
        comp.scaling.z = 30
        comp.position.x = -10
        comp.position.y = -50
        comp.rotation.y  =   Math.PI/2;


        var obj;
        var obst = new Obstacle(15, 100, 100)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 260;
        obj.position.x = -600;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = colorMaterial;



        var obst = new Obstacle(255, 100, 100)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 165;
        obj.position.x = -1100;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = colorMaterial;


        obst = new Obstacle(455, 100, 100)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 100;
        obj.position.x = -510;
        obj.position.z = 0.1;
        obst.mesh = obj;
        obstt.push(obst)
        obj.material = colorMaterial;


        obst = new MovingPlatform(10, 50, 60, -1020, 150, 100, "y", 1.2)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 130;
        obj.position.x = -1020;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new MovingPlatform(10, 50, 60, -850, 220, 30, "y", 1.5)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 220;
        obj.position.x = -850;
        obst.mesh = obj;
        obstt.push(obst)

        obst = new MovingPlatform(10, 50, 60, -850, 250, 30, "y", 1.2)
        obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, this.scene);
        obj.position.y = 250;
        obj.position.x = -750;
        obst.mesh = obj;
        obstt.push(obst)


        this.obstacles = obstt;


    }

}