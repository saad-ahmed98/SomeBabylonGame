
export default class LVLAbstract {
    constructor(gameconfig) {
        this.scene = new BABYLON.Scene(gameconfig.engine);
        this.player;
        this.pickups;
        this.obstacles;
        this.endlvl;
        this.gameconfig = gameconfig;

        //variables d'état, à changer
        this.jumping = true;
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
        for (let i = 0; i <this.pickups.length; i++) {
           this.pickups[i].mesh.position.y =this.pickups[i].mesh.position.y + (0.2 *this.pickups[i].direction);
            if (this.pickups[i].mesh.position.y >this.pickups[i].originaly +this.pickups[i].offset)
               this.pickups[i].direction = -1;

            if (this.pickups[i].mesh.position.y <this.pickups[i].originaly -this.pickups[i].offset)
               this.pickups[i].direction = 1;
        }
    }

    contactPickups() {

        for (let i = 0; i <this.pickups.length; i++) {
            if (!this.pickups[i].dead) {
                if (Math.abs(this.pickups[i].mesh.position.x -this.player.position.x) <= 10 && Math.abs(this.pickups[i].mesh.position.y -this.player.position.y) <= 10) {
                    console.log("WALL JUMP OBTAINED");
                    console.log("Keep mantained space bar while jumping on walls to be sent to the other direction!");

                   this.haswalljump = true;
                   this.pickups[i].mesh.dispose();
                   this.pickups[i].dead = true;
                }
            }

        }
    }

    addObstaclesPhysics() {
        var instance = this;
        for (let i = 0; i <this.obstacles.length; i++) {
           this.obstacles[i].mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.obstacles[i].mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 },this.scene);
           this.obstacles[i].mesh.physicsImpostor.registerOnPhysicsCollide(this.player.physicsImpostor, function (obj, t) {
                if (t.object.position.y -instance.obstacles[i].mesh.position.y -instance.obstacles[i].height / 2 > 0) {
                    instance.walljumpingleft = false;
                    instance.walljumpingright = false;
                    instance.jumping = true;
                    instance.gameconfig.jumpingstarted = 0;
                    instance.walljump = 30;
                }
                else {
                    if (Math.abs(t.object.position.x -instance.obstacles[i].mesh.position.x -instance.obstacles[i].width / 2) < 4) {
                        instance.poswalljumping = t.object.position.y;
                        instance.walljump = 0;
                        instance.walljumpingleft = false;
                        instance.walljumpingright = true;

                    }
                    else {
                        instance.walljump = 0;
                        instance.poswalljumping = t.object.position.y;
                        instance.walljumpingleft = true;
                        instance.walljumpingright = false;
                    }
                }
            })
        }
    }

    createFollowCamera(radius) {
        let camera = new BABYLON.FollowCamera("playerFollowCamera",this.player.position,this.scene, this.player);

        camera.radius = radius; // how far from the object to follow
        camera.heightOffset = 10; // how high above the object to place the camera
        camera.rotationOffset = 90; // the viewing angle
        camera.cameraAcceleration = .1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit

        return camera;
    }

    createPlayer(x, y) {
       //hitbox
       this.player = new BABYLON.MeshBuilder.CreateBox("heroplayer", { height: 10, depth: 5, width: 6 },this.scene);
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
            totalCount,
            lastFinishedTask
        ) {
            instance.gameconfig.engine.loadingUIText =
                "We are loading the scene.. " +
                remainingCount +
                " out of " +
                totalCount +
                " items still need to be loaded.";
            console.log(
                "We are loading the scene.. " +
                remainingCount +
                " out of " +
                totalCount +
                " items still need to be loaded."
            );
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


    loadAssets(){
        throw new Error('You must implement this function');
    }

    createScene(){
        throw new Error('You must implement this function');
    }
    
    renderScene(){
        throw new Error('You must implement this function');
    }
}