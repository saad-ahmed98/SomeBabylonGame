import Obstacle from "./Obstacle.js";
import Pickup from "./Pickup.js";


let canvas;
let engine;
let scene;
// vars for handling inputs
let inputStates = {};
let jumping = true;
let jumpingstarted = 0
var lookAt = 1;
var walljumpingleft = false;
var walljumpingright = false;
var walljump = 0;
var haswalljump = false;
var isattacking = false;
var poswalljumping = 0;
var rollingAverage;

let divFps = document.getElementById("fps");


window.onload = startGame;


function configureAssetManager(scene) {
    // useful for storing references to assets as properties. i.e scene.assets.cannonsound, etc.
    scene.assets = {};

    let assetsManager = new BABYLON.AssetsManager(scene);

    assetsManager.onProgress = function (
        remainingCount,
        totalCount,
        lastFinishedTask
    ) {
        engine.loadingUIText =
            "We are loading the scene. " +
            remainingCount +
            " out of " +
            totalCount +
            " items still need to be loaded.";
        console.log(
            "We are loading the scene. " +
            remainingCount +
            " out of " +
            totalCount +
            " items still need to be loaded."
        );
    };

    assetsManager.onFinish = function (tasks) {
        createScene(scene)
        let tank = scene.getMeshByName("heroTank");
        engine.runRenderLoop(function () {
            scene.toRender(tank);
        });
    };

    return assetsManager;
}

function loadAssets(scene){
    loadSounds(scene);
    loadBuildings(scene);
}

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    scene.assetsManager = configureAssetManager(scene);
    loadAssets(scene);


    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();
    rollingAverage = new BABYLON.RollingAverage(60);


    scene.toRender = (tank) => {
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
        rollingAverage.add(scene.getAnimationRatio());

        tank.move();


        scene.render();
    };
    scene.assetsManager.load();

}

function loadBuildings(scene){
    let meshTask = scene.assetsManager.addMeshTask(
        "6story task",
        "",
        "models/",
        "6Story_Balcony.glb"
      );
    
      meshTask.onSuccess = function (task) {
        scene.assets.sixstorybalcony = task.loadedMeshes[1]
      };

    meshTask = scene.assetsManager.addMeshTask(
        "3story task",
        "",
        "models/",
        "3Story_Balcony.glb"
      );
    
      meshTask.onSuccess = function (task) {
        scene.assets.threestorybalcony = task.loadedMeshes[1]
      };

    meshTask = scene.assetsManager.addMeshTask(
        "2story wide task",
        "",
        "models/",
        "2Story_Wide.glb"
      );
    
      meshTask.onSuccess = function (task) {
        scene.assets.twostorywide = task.loadedMeshes[1]
      };

      meshTask = scene.assetsManager.addMeshTask(
        "4story center task",
        "",
        "models/",
        "4Story_Center.glb"
      );
    
      meshTask.onSuccess = function (task) {
        scene.assets.fourstorycenter = task.loadedMeshes[1]
      };

      meshTask = scene.assetsManager.addMeshTask(
        "building2 task",
        "",
        "models/",
        "Building2_Large.glb"
      );
    
      meshTask.onSuccess = function (task) {
        scene.assets.buildingtwolarge = task.loadedMeshes[0]
      };
}
function loadSounds(scene) {
    var assetsManager = scene.assetsManager;
    var binaryTask = assetsManager.addBinaryFileTask(
        "swordSwing",
        "sounds/sword swing.wav"
    );
    binaryTask.onSuccess = function (task) {
        scene.assets.swordSwingSound = new BABYLON.Sound(
            "swordSwing",
            task.data,
            scene,
            null,
            {
                loop: false,
            }
        );
    };
}

function swingSword(scene, tank) {
    scene.assets.swordSwingSound.setPosition(tank.position);
    scene.assets.swordSwingSound.play();

    isattacking = false;
}


function createScene(scene) {
    let ground = createGround(scene);
    const groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
    //groundMaterial.diffuseTexture = new BABYLON.Texture("images/grass.jpg");
    ground.material = groundMaterial;

    let tank = createTank(scene);
    //var layer = new BABYLON.Layer('','images/skybox.png', scene, true);

    let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 1687.5, depth: 1, width: 3200 }, scene);
    skybox.position.y = 100;
    let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", scene);
    skybox.material = skyboxmat;

    skyboxmat.diffuseTexture = new BABYLON.Texture("images/skybox.jpg", scene);

    skybox.position.z = 500



    BABYLON.SceneLoader.ImportMesh("", "models/", "character.glb", scene, function (meshes, skeletons) {
        for (let i = 0; i < meshes.length; i++) {
            meshes[i].name = "bg" + i;
            meshes[i].parent = tank;
            meshes[i].position.x = 0;
            meshes[i].position.z = 0;
            meshes[i].position.y = -5;


            meshes[i].scaling.x = 5;
            meshes[i].scaling.z = 5;
            meshes[i].scaling.y = 5;
            meshes[i]._scene.animationGroups[2].play(true)
            tank.animationGroups = meshes[i]._scene.animationGroups
        }
        /*
        let hand =meshes[0].getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0]
        BABYLON.SceneLoader.ImportMesh("Plane", "models/", "cartoonSword.glb", scene, function (meshes, particleSystems, skeletons) {
                meshes[0].name = "sword";
                meshes[0].parent = hand;
                //meshes[i].position.x = 6;
                //meshes[0].position.z = -5;
    
                meshes[0].scaling.x = 0.2;
                meshes[0].scaling.z = 0.2;
                meshes[0].scaling.y = 0.2;
    
                //meshes[0].rotation = new BABYLON.Vector3(0, 0, 20);
        });
        */
    });


    var obstacles = createObstaclesLVL1(scene);
    var pickups = createPickupsLVL1(scene);
    var endlvl = createEndLevelLVL1(scene);


    let followCamera = createFollowCamera(scene, tank);
    scene.activeCamera = followCamera;
    Ammo().then(() => {
        scene.enablePhysics(null, new BABYLON.AmmoJSPlugin());
        var physicsEngine = scene.getPhysicsEngine();
        physicsEngine.setGravity(new BABYLON.Vector3(0, -200, 0));



        // Add Imposters
        tank.physicsImpostor = new BABYLON.PhysicsImpostor(tank, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, restitution: 0 }, scene);

        tank.position.y = 20
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, scene);
        ground.physicsImpostor.registerOnPhysicsCollide(tank.physicsImpostor, function () {
            console.log("GAME OVER")
        })

        addObstaclesPhysics(obstacles, tank, scene)

        createLights(scene);

    })

    tank.move = () => {
        if (tank.position.y < -20){
            scene.activeCamera.lockedTarget = null
        }

        if (tank.animationGroups != undefined) {

            let idle = true;
            wavePickups(pickups);
            contactPickups(pickups, tank);
            contactEndLevel(endlvl, tank);

            if (tank.animationGroups[5]._isStarted == false)
                isattacking = false;

            if (inputStates.space) {
                idle = false
                if (walljumpingleft && walljump < 25 && haswalljump) {
                    if (walljump < 15)
                        inputStates.right = false;
                    tank.moveWithCollisions(new BABYLON.Vector3(-0.7 * rollingAverage.average*tank.speed, 0, 0));
                    tank.moveWithCollisions(new BABYLON.Vector3(0, 2 * rollingAverage.average*tank.speed, 0));
                    tank.lookAt(new BABYLON.Vector3(-10000000, 0, 0));
                    followCamera.rotationOffset = -90
                    lookAt = -1
                    walljump++;

                }
                else {
                    if (walljumpingright && walljump < 25 && haswalljump) {
                        if (walljump < 15)
                            inputStates.left = false;
                        tank.moveWithCollisions(new BABYLON.Vector3(0.7 * rollingAverage.average*tank.speed, 0, 0));
                        tank.moveWithCollisions(new BABYLON.Vector3(0, 2 * rollingAverage.average*tank.speed, 0));
                        tank.lookAt(new BABYLON.Vector3(10000000, 0, 0));
                        followCamera.rotationOffset = 90
                        lookAt = 1
                        walljump++;
                    }
                    else {
                        if (jumping || jumpingstarted < 30) {
                            tank.moveWithCollisions(new BABYLON.Vector3(0, 1.2 * rollingAverage.average*tank.speed, 0));
                            tank.lookAt(new BABYLON.Vector3(lookAt * 10000000, 0, 0));
                            jumpingstarted++
                            jumping = false;
                        }
                    }
                }
                tank.animationGroups[1].play()
            }
            if (inputStates.up) {
            }
            if (inputStates.down) {

            }
            if (inputStates.left) {
                idle = false

                tank.moveWithCollisions(new BABYLON.Vector3(-1 * rollingAverage.average*tank.speed, 0, 0));
                tank.lookAt(new BABYLON.Vector3(-10000000, 0, 0));
                followCamera.rotationOffset = -90
                lookAt = -1
                if (jumping && !isattacking)
                    tank.animationGroups[4].play()
            }
            if (inputStates.right) {
                idle = false

                tank.moveWithCollisions(new BABYLON.Vector3(1 * rollingAverage.average*tank.speed, 0, 0));
                tank.lookAt(new BABYLON.Vector3(10000000, 0, 0));
                followCamera.rotationOffset = 90
                lookAt = 1
                if (jumping && !isattacking)
                    tank.animationGroups[4].play()

            }

            if (inputStates.attack) {
                idle = false
                if (!isattacking) {
                    isattacking = true;
                    tank.animationGroups[5].play()
                    //swingSword(scene,tank)
                }
            }

            if (idle && walljump && jumping) {
                for (let i = 0; i < tank.animationGroups; i++) {
                    tank.animationGroups[i].stop()
                }
                tank.animationGroups[2].play(true)
            }
        }
    }




    /*

    var left, right;
    left = 0;
    right = 2;
    scene.onPointerDown = (e) => {
        if (e.button === left) {
            var shootedball = BABYLON.Mesh.CreateSphere("shootedball", 5, 5);
    
            shootedball.position.x = tank.position.x;
            shootedball.position.y = tank.position.y;
            shootedball.position.z = tank.position.z;
    
            var pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult.hit) {
                var targetPoint = pickResult.pickedPoint;
                if(targetPoint.x - shootedball.position.x > 0){
                    shootedball.position.x+=5
                    targetPoint.x+=5
                }
                else {shootedball.position.x-=5
                        targetPoint.x-=5
                }
                if(targetPoint.z - shootedball.position.z > 0){
                    shootedball.position.z+=5
                    targetPoint.z+=5
                }
                else {shootedball.position.z-=5
                targetPoint.z-=5
                }
                targetPoint.y = 20;
            }
            shootedball.physicsImpostor = new BABYLON.PhysicsImpostor(shootedball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.1, restitution: 0 }, scene);
            shootedball.physicsImpostor.physicsBody.collisionFilterGroup = 2
            shootedball.physicsImpostor.registerOnPhysicsCollide(getWallsImposters(scene),function(sball,walls){
                scene.removeMesh(sball.object)
                sball.object.dispose()
        })
    
            translate(shootedball,targetPoint, 5);
    
            setTimeout(() => {
                shootedball.dispose();
              }, 3000);
            
        }
    }
    scene.onPointerUp = (e) => {
        if (e.button === right) {
                
        }
        if (e.button === left) {
            //azfahweg
        }
    }
    */


    return scene;
}
/*
var translate = function (mesh, direction, power) {
    mesh.physicsImpostor.setLinearVelocity(
        mesh.physicsImpostor.getLinearVelocity().add(direction.scale(power)
        )
    );
}

*/



function wavePickups(pickups) {
    for (let i = 0; i < pickups.length; i++) {
        pickups[i].mesh.position.y = pickups[i].mesh.position.y + (0.2 * pickups[i].direction);
        if (pickups[i].mesh.position.y > pickups[i].originaly + pickups[i].offset)
            pickups[i].direction = -1;

        if (pickups[i].mesh.position.y < pickups[i].originaly - pickups[i].offset)
            pickups[i].direction = 1;
    }
}

function contactEndLevel(endlvl, tank){
        if (Math.abs(endlvl.position.x - tank.position.x) <= 10 && Math.abs(endlvl.position.y - tank.position.y) <= 10) {
            console.log("LEVEL FINISHED!");
    }
}

function contactPickups(pickups, tank) {

    for (let i = 0; i < pickups.length; i++) {
        if (!pickups[i].dead) {
            if (Math.abs(pickups[i].mesh.position.x - tank.position.x) <= 10 && Math.abs(pickups[i].mesh.position.y - tank.position.y) <= 10) {
                console.log("WALL JUMP OBTAINED");
                console.log("Keep mantained space bar while jumping on walls to be sent to the other direction!");

                haswalljump = true;
                pickups[i].mesh.dispose();
                pickups[i].dead = true;
            }
        }

    }
}
function addObstaclesPhysics(obstacles, tank, scene) {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].mesh.physicsImpostor = new BABYLON.PhysicsImpostor(obstacles[i].mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, scene);
        obstacles[i].mesh.physicsImpostor.registerOnPhysicsCollide(tank.physicsImpostor, function (obj, t) {
            if (t.object.position.y - obstacles[i].mesh.position.y - obstacles[i].height / 2 > 0) {
                walljumpingleft = false;
                walljumpingright = false;
                jumping = true;
                jumpingstarted = 0;
                walljump = 30;
            }
            else {
                if (Math.abs(t.object.position.x - obstacles[i].mesh.position.x - obstacles[i].width / 2) < 4) {
                    poswalljumping = t.object.position.y;
                    walljump = 0;
                    walljumpingleft = false;
                    walljumpingright = true;

                }
                else {
                    walljump = 0;
                    poswalljumping = t.object.position.y;
                    walljumpingleft = true;
                    walljumpingright = false;
                }
            }
        })
    }
}

function createPickupsLVL1(scene) {
    var pickups = [];

    var obj = new BABYLON.Mesh.CreateDisc("", 5, 64, scene);
    var objmat = new BABYLON.StandardMaterial("", scene);
    objmat.diffuseTexture = new BABYLON.Texture("images/walljump.png", scene);
    obj.material = objmat;
    obj.position.y = 12;
    obj.position.x = 500;

    var pickup = new Pickup(obj.position.y, 2, obj)
    pickups.push(pickup);

    /*var particleSystem = new BABYLON.ParticleSystem("particles", 10, scene);
    particleSystem.maxScaleX = 2;
    particleSystem.maxScaleY = 2;


    var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
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

    return pickups;
}

function createObstaclesLVL1(scene) {
    var obstt = []
    var obj;
    var obst = new Obstacle(100, 100, 300)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -50;
    obj.position.x = -650;
    obst.mesh = obj;
    obj.visibility = 0;
    let building = scene.assets.twostorywide.clone("building1");
    building.parent = obj;
    building.scaling.x = 80;
    building.scaling.y = 50;
    building.scaling.z = 80;
    building.rotation = new BABYLON.Vector3(0, 3.15, 0);
    building.position.y = -78;

    obstt.push(obst)

    obst = new Obstacle(180, 100, 200)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -55;
    obj.position.x = -355;
    obst.mesh = obj;
    obj.visibility = 0;

    building = scene.assets.twostorywide.clone("building2");
    building.parent = obj;
    building.scaling.x = 55;
    building.scaling.y = 50;
    building.scaling.z = 55;
    building.rotation = new BABYLON.Vector3(0, 3.15, 0);
    building.position.y = -38;
    obstt.push(obst)

    obst = new Obstacle(10, 50, 60)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 65;
    obj.position.x = -250;
    obst.mesh = obj;
    obstt.push(obst)

    obst = new Obstacle(10, 50, 60)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 95;
    obj.position.x = -170;
    obst.mesh = obj;
    obstt.push(obst)

    obst = new Obstacle(10, 50, 60)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 125;
    obj.position.x = -90;
    obst.mesh = obj;
    obstt.push(obst)

    obst = new Obstacle(80, 100, 200)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -40;
    obj.position.x = -100;
    obst.mesh = obj;
    obj.visibility = 0;

    building = scene.assets.fourstorycenter.clone("building3");
    building.parent = obj;
    building.scaling.x = 70;
    building.scaling.y = 60;
    building.scaling.z = 65;
    building.rotation = new BABYLON.Vector3(0, 3.15, 0);
    building.position.y = -255;
    building.position.x = -15;


    obstt.push(obst)

    

    obst = new Obstacle(320, 100, 130)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -40;
    obj.position.x = 35;
    obst.mesh = obj;
    obj.visibility = 0;

    building = scene.assets.fourstorycenter.clone("building4");
    building.parent = obj;
    building.scaling.x = 55;
    building.scaling.y = 45;
    building.scaling.z = 50;
    building.rotation = new BABYLON.Vector3(0, 3.15, 0);
    building.position.y = -62;
    //building.position.x = -15;
    obstt.push(obst)

    obst = new Obstacle(10, 70, 100)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 65;
    obj.position.x = 250;
    obst.mesh = obj;
    obstt.push(obst)



    var obst = new Obstacle(100, 100, 300)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -50;
    obj.position.x = 500;
    obst.mesh = obj;
    obj.visibility = 0;
    building = scene.assets.twostorywide.clone("building5");
    building.parent = obj;
    building.scaling.x = 80;
    building.scaling.y = 50;
    building.scaling.z = 80;
    building.rotation = new BABYLON.Vector3(0, 3.15, 0);
    building.position.y = -78;

    obstt.push(obst)

    var obst = new Obstacle(100, 100, 7)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 80;
    obj.position.x = 640;
    obst.mesh = obj;
    obstt.push(obst)

    var obst = new Obstacle(300, 100, 300)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -65;
    obj.position.x = 830;
    obst.mesh = obj;

    obj.visibility = 0;
    building = scene.assets.buildingtwolarge.clone("building5");
    building.parent = obj;
    building.scaling.x = 52;
    building.scaling.y = 52;
    building.scaling.z = 30;
    building.rotation = new BABYLON.Vector3(0, 3.15, 0);
    building.position.y = -147;

    obstt.push(obst)

    return obstt;
}

function createGround(scene) {
    var ground = BABYLON.MeshBuilder.CreateBox("Ground", { depth: 100, width: 1600, height: 50 }, scene);
    ground.position.y = -400;
    ground.checkCollisions = true;
    return ground;
}

function createEndLevelLVL1(scene) {
    var obj = new BABYLON.MeshBuilder.CreateBox("", { height: 30, depth: 5, width: 15 }, scene);
    obj.position.y = 90;
    obj.position.x = 850;
    obj.visibility = 0.3;

    var obj2 = new BABYLON.Mesh.CreateDisc("", 10, 64, scene);
    var objmat = new BABYLON.StandardMaterial("", scene);
    objmat.diffuseTexture = new BABYLON.Texture("images/endlvl.png", scene);

    obj2.material = objmat;
    obj2.position.y = 130;
    obj2.position.x = 850;


    return obj;

}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.HemisphericLight("dir0", new BABYLON.Vector3(1, 8, -10), scene);
    light0.intensity = 1;


}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);

    camera.radius = 150; // how far from the object to follow
    camera.heightOffset = 10; // how high above the object to place the camera
    camera.rotationOffset = 90; // the viewing angle
    camera.cameraAcceleration = .1; // how fast to move
    camera.maxCameraSpeed = 5; // speed limit

    return camera;
}

function createTank(scene, camera) {
    let tank = new BABYLON.MeshBuilder.CreateBox("heroTank", { height: 10, depth: 5, width: 6 }, scene);
    tank.position.x = -750;
    tank.lookAt(new BABYLON.Vector3(10, 0, 0));
    tank.visibility = 0;


    let tankMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
    tankMaterial.diffuseColor = new BABYLON.Color3(255, 0, 0);
    tank.material = tankMaterial;

    let gunmaterial = new BABYLON.StandardMaterial("gunMaterial", scene);
    gunmaterial.diffuseColor = new BABYLON.Color3(255, 0, 0);



    tank.speed = 2;
    tank.frontVector = new BABYLON.Vector3(0, 0, 1);

    return tank;
}


window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    /*
    scene.onPointerDown = () => {
        if(!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        } else {
            console.log("Pointer already locked");
        }
    }

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if(element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })
    */

    // key listeners for the tank
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    inputStates.attack = false;


    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
            inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
            inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
            inputStates.right = true;
        } else if ((event.key === "ArrowDown") || (event.key === "s") || (event.key === "S")) {
            inputStates.down = true;
        } else if (event.key === " ") {
            inputStates.space = true;
        }
        else if ((event.key === "e") || (event.key === "E")) {
            inputStates.attack = true;
        }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
            inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
            jumpingstarted = 30;

            inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
            inputStates.right = false;
        } else if ((event.key === "ArrowDown") || (event.key === "s") || (event.key === "S")) {
            inputStates.down = false;
        } else if (event.key === " ") {
            inputStates.space = false;
        }
        else if ((event.key === "e") || (event.key === "E")) {
            inputStates.attack = false;
        }
    }, false);
}

