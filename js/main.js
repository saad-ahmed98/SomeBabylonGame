import Dude from "./Dude.js";
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
var poswalljumping = 0;
var walljump = 0;
var haswalljump = false;


window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();

    let tank = scene.getMeshByName("heroTank");

    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?

        tank.move();
        //tank.lookAt(new BABYLON.Vector3(lookAt*10000000, tank.position.y, 0));
        //console.log("ici")


        let heroDude = scene.getMeshByName("heroDude");
        if (heroDude)
            heroDude.Dude.move(scene);

        if (scene.dudes) {
            for (var i = 0; i < scene.dudes.length; i++) {
                scene.dudes[i].Dude.move(scene);
            }
        }

        scene.render();
    });
}


function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);
    const groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
    //groundMaterial.diffuseTexture = new BABYLON.Texture("images/grass.jpg");
    ground.material = groundMaterial;

    let freeCamera = createFreeCamera(scene);
    let tank = createTank(scene);
    //var layer = new BABYLON.Layer('','images/skybox.png', scene, true);

    let skybox = new BABYLON.MeshBuilder.CreateBox("skybox", { height: 1687.5, depth: 1, width: 3200 }, scene);
    skybox.position.y = 100;
    let skyboxmat = new BABYLON.StandardMaterial("skyboxmat", scene);
    skybox.material = skyboxmat;

    skyboxmat.diffuseTexture = new BABYLON.Texture("images/skybox.jpg", scene);

    skybox.position.z = 500




    BABYLON.SceneLoader.ImportMesh("Plane", "models/", "cartoonSword.glb", scene, function (meshes, particleSystems, skeletons) {
        for (let i = 0; i < meshes.length; i++) {
            meshes[i].name = "sword" + i;
            meshes[i].parent = tank;
            meshes[i].position.x = 6;
            meshes[i].position.z = 1;

            meshes[i].scaling.x = 0.3;
            meshes[i].scaling.z = 0.3;
            meshes[i].scaling.y = 0.3;

            meshes[i].rotation = new BABYLON.Vector3(0, 20, -5);
        }
    });

    var obstacles = createObstaclesLVL1(scene);
    var pickups = createPickupsLVL1(scene);
    createEndLevel(scene);

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].mesh.material = groundMaterial;
    }

    //BABYLON.SceneLoader.ImportMesh("", "models/", "RayGun.glb", scene, onGunImported);
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
        //box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0.7 }, scene);

        // second parameter is the target to follow
        //scene.activeCamera = freeCamera;

        createLights(scene);

        //createHeroDude(scene);

        /*window.addEventListener("mousemove", function () {
            // We try to pick an object
            var pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult.hit) {
                var targetPoint = pickResult.pickedPoint;
                targetPoint.y = tank.position.y;
                tank.lookAt(targetPoint);
            }
        });
        */
    })

    tank.move = () => {
        wavePickups(pickups);
        contactPickups(pickups,tank);
        //tank.position.z += -1; // speed should be in unit/s, and depends on
        // deltaTime !

        // if we want to move while taking into account collision detections
        // collision uses by default "ellipsoids"
        /*if (tank.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        } 
        */
        //tank.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));

        if (inputStates.space) {
            if (walljumpingleft && walljump < 25 && haswalljump) {
                if(walljump<15)
                inputStates.right = false;
                tank.moveWithCollisions(new BABYLON.Vector3(-0.7 * tank.speed, 0, 0));
                tank.moveWithCollisions(new BABYLON.Vector3(0, 2 * tank.speed, 0));
                tank.lookAt(new BABYLON.Vector3(-10000000, 0, 0));
                followCamera.rotationOffset = -90
                lookAt = -1
                walljump++;

            }
            else {
                if (walljumpingright && walljump < 25 && haswalljump) {
                    if(walljump<15)
                    inputStates.left = false;
                    tank.moveWithCollisions(new BABYLON.Vector3(0.7 * tank.speed, 0, 0));
                    tank.moveWithCollisions(new BABYLON.Vector3(0, 2 * tank.speed, 0));
                    tank.lookAt(new BABYLON.Vector3(10000000, 0, 0));
                    followCamera.rotationOffset = 90
                    lookAt = 1
                    walljump++;
                }
                else {
                    if (jumping || jumpingstarted < 30) {
                        tank.moveWithCollisions(new BABYLON.Vector3(0, 1.2 * tank.speed, 0));
                        tank.lookAt(new BABYLON.Vector3(lookAt * 10000000, 0, 0));
                        jumpingstarted++
                        jumping = false;
                    }
                }
            }

        }
        if (inputStates.up) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
            //tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, tank.speed, tank.speed));
        }
        if (inputStates.down) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            //tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, -tank.speed, -tank.speed));

        }
        if (inputStates.left) {
            tank.moveWithCollisions(new BABYLON.Vector3(-1 * tank.speed, 0, 0));
            //tank.rotation.y -= 0.02;
            //tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
            tank.lookAt(new BABYLON.Vector3(-10000000, 0, 0));
            followCamera.rotationOffset = -90
            lookAt = -1

        }
        if (inputStates.right) {
            tank.moveWithCollisions(new BABYLON.Vector3(1 * tank.speed, 0, 0));
            //tank.rotation.y += 0.02
            //tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
            tank.lookAt(new BABYLON.Vector3(10000000, 0, 0));
            followCamera.rotationOffset = 90
            lookAt = 1
        }
        //tank.rotation.y += 0.02;
        //tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
        //tank.lookAt(new BABYLON.Vector3(10000000, 0, 0));

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

function wavePickups(pickups){
    for(let i = 0;i<pickups.length;i++){
        pickups[i].mesh.position.y = pickups[i].mesh.position.y+(0.2*pickups[i].direction);
        if(pickups[i].mesh.position.y>pickups[i].originaly+pickups[i].offset)
            pickups[i].direction = -1;
        
        if(pickups[i].mesh.position.y<pickups[i].originaly-pickups[i].offset)
            pickups[i].direction = 1;
    }
}

function contactPickups(pickups,tank){

    for(let i = 0;i<pickups.length;i++){
        if(!pickups[i].dead){
        if(Math.abs(pickups[i].mesh.position.x -tank.position.x) <=5 && Math.abs(pickups[i].mesh.position.y -tank.position.y)<=5){
            console.log("WALL JUMP OBTAINED");
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

    var obj = new BABYLON.Mesh.CreateDisc("", 5,64, scene);
    var objmat = new BABYLON.StandardMaterial("", scene);
    objmat.diffuseTexture = new BABYLON.Texture("images/walljump.png", scene);
    obj.material = objmat;
    obj.position.y = 12;
    obj.position.x = 500;

    var pickup = new Pickup (obj.position.y,2,obj)
    pickups.push(pickup);

    var particleSystem = new BABYLON.ParticleSystem("particles", 2000,scene);
    particleSystem.maxScaleX = 2;
    particleSystem.maxScaleY = 2;


    var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
    noiseTexture.animationSpeedFactor = 5;
    noiseTexture.persistence = 2;
    noiseTexture.brightness = 0.5;
    noiseTexture.octaves = 2;
    particleSystem.noiseTexture = noiseTexture;
    particleSystem.noiseStrength = new BABYLON.Vector3(100, 100, 100);
    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("images/flare.png");
    // Position where the particles are emiited from
    particleSystem.emitter = pickup.mesh;
    particleSystem.start();

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
    obstt.push(obst)

    obst = new Obstacle(180, 100, 200)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -50;
    obj.position.x = -350;
    obst.mesh = obj;
    obstt.push(obst)

    obst = new Obstacle(10, 50, 60)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 65;
    obj.position.x = -250;
    obst.mesh = obj;
    obstt.push(obst)

    obst = new Obstacle(50, 100, 300)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 80;
    obj.position.x = -50;
    obst.mesh = obj;
    obstt.push(obst)

    obst = new Obstacle(80, 100, 200)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -40;
    obj.position.x = -100;
    obst.mesh = obj;
    obstt.push(obst)

    obst = new Obstacle(190, 100, 130)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = -40;
    obj.position.x = 35;
    obst.mesh = obj;
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
    obstt.push(obst)

    var obst = new Obstacle(100, 100, 7)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 70;
    obj.position.x = 555;
    obst.mesh = obj;
    obstt.push(obst)

    var obst = new Obstacle(100, 100, 50)
    obj = new BABYLON.MeshBuilder.CreateBox("", { height: obst.height, depth: obst.depth, width: obst.width }, scene);
    obj.position.y = 50;
    obj.position.x = 625;
    obst.mesh = obj;
    obstt.push(obst)

    return obstt;
}

function createGround(scene) {
    //const groundOptions = { width:200, height:200, subdivisions:20, minHeight:0, maxHeight:50, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    //const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/lvl1.png', groundOptions, scene); 
    var ground = BABYLON.MeshBuilder.CreateBox("Ground", { depth: 100, width: 1600, height: 50 }, scene);
    ground.position.y = -100;

    // to be taken into account by collision detection
    ground.checkCollisions = true;
    return ground;
}

function createEndLevel(scene){

    var obj = new BABYLON.MeshBuilder.CreateBox("", { height: 10, depth: 10, width: 5 }, scene);
    obj.position.y = 105;
    obj.position.x = 630;
    obj.visibility = 0;

    var particleSystem = new BABYLON.ParticleSystem("", 2000,scene);
    particleSystem.maxSize = 7;



    var noiseTexture = new BABYLON.NoiseProceduralTexture("", 256, scene);
    noiseTexture.animationSpeedFactor = 1;
    noiseTexture.persistence = 2;
    noiseTexture.brightness = 0.5;
    noiseTexture.octaves = 1;
    particleSystem.noiseTexture = noiseTexture;
    particleSystem.noiseStrength = new BABYLON.Vector3(100, 100, 100);
    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("images/flare.png");
    // Position where the particles are emiited from
    particleSystem.emitter = obj;
    particleSystem.start();

    /*
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000,scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("images/flare.png");

    // Position where the particles are emiited from
    particleSystem.emitter = new BABYLON.Vector3(0, 0.5, 0);

    particleSystem.start();
    */
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.HemisphericLight("dir0", new BABYLON.Vector3(1, 8, -10), scene);
    light0.intensity = 1;


}

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(-80, 0, -100), scene);
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);

    camera.radius = 100; // how far from the object to follow
    camera.heightOffset = 10; // how high above the object to place the camera
    camera.rotationOffset = 90; // the viewing angle
    camera.cameraAcceleration = .1; // how fast to move
    camera.maxCameraSpeed = 5; // speed limit

    return camera;
}

let zMovement = 5;
function createTank(scene, camera) {
    let tank = new BABYLON.MeshBuilder.CreateBox("heroTank", { height: 10, depth: 5, width: 6 }, scene);
    tank.position.x = -750;
    let tankhead = new BABYLON.MeshBuilder.CreateBox("heroTank", { height: 5, depth: 6, width: 10 }, scene);
    tankhead.parent = tank; //1
    tank.lookAt(new BABYLON.Vector3(10, 0, 0));


    let tankMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
    tankMaterial.diffuseColor = new BABYLON.Color3(255, 0, 0);
    //tankMaterial.emissiveColor = new BABYLON.Color3.Blue;
    tank.material = tankMaterial;

    let gunmaterial = new BABYLON.StandardMaterial("gunMaterial", scene);
    gunmaterial.diffuseColor = new BABYLON.Color3(255, 0, 0);
    //gunmaterial.emissiveColor = new BABYLON.Color3.Blue;
    tankhead.material = gunmaterial;

    // By default the box/tank is in 0, 0, 0, let's change that...
    //tank.position.y = 0.6;
    //tankhead.position.x = -950;

    tankhead.position.y = 0.6;


    tank.speed = 2;
    tank.frontVector = new BABYLON.Vector3(0, 0, 1);

    return tank;
}

function createHeroDude(scene) {
    // load the Dude 3D animated model
    // name, folder, skeleton name 
    BABYLON.SceneLoader.ImportMesh("him", "models/Dude/", "Dude.babylon", scene, (newMeshes, particleSystems, skeletons) => {
        let heroDude = newMeshes[0];
        heroDude.position = new BABYLON.Vector3(0, 0, 5);  // The original dude
        // make it smaller 
        heroDude.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        //heroDude.speed = 0.1;

        // give it a name so that we can query the scene to get it by name
        heroDude.name = "heroDude";

        // there might be more than one skeleton in an imported animated model. Try console.log(skeletons.length)
        // here we've got only 1. 
        // animation parameters are skeleton, starting frame, ending frame,  a boolean that indicate if we're gonna 
        // loop the animation, speed, 
        let a = scene.beginAnimation(skeletons[0], 0, 120, true, 1);

        let hero = new Dude(heroDude, 0.1, scene);

        // make clones
        scene.dudes = [];
        for (let i = 0; i < 10; i++) {
            scene.dudes[i] = doClone(heroDude, skeletons, i);
            scene.beginAnimation(scene.dudes[i].skeleton, 0, 120, true, 1);

            // Create instance with move method etc.
            var temp = new Dude(scene.dudes[i], 0.3);
            // remember that the instances are attached to the meshes
            // and the meshes have a property "Dude" that IS the instance
            // see render loop then....
        }


    });
}


function doClone(originalMesh, skeletons, id) {
    let myClone;
    let xrand = Math.floor(Math.random() * 500 - 250);
    let zrand = Math.floor(Math.random() * 500 - 250);

    myClone = originalMesh.clone("clone_" + id);
    myClone.position = new BABYLON.Vector3(xrand, 0, zrand);

    if (!skeletons) return myClone;

    // The mesh has at least one skeleton
    if (!originalMesh.getChildren()) {
        myClone.skeleton = skeletons[0].clone("clone_" + id + "_skeleton");
        return myClone;
    } else {
        if (skeletons.length === 1) {
            // the skeleton controls/animates all children, like in the Dude model
            let clonedSkeleton = skeletons[0].clone("clone_" + id + "_skeleton");
            myClone.skeleton = clonedSkeleton;
            let nbChildren = myClone.getChildren().length;

            for (let i = 0; i < nbChildren; i++) {
                myClone.getChildren()[i].skeleton = clonedSkeleton
            }
            return myClone;
        } else if (skeletons.length === originalMesh.getChildren().length) {
            // each child has its own skeleton
            for (let i = 0; i < myClone.getChildren().length; i++) {
                myClone.getChildren()[i].skeleton = skeletons[i].clone("clone_" + id + "_skeleton_" + i);
            }
            return myClone;
        }
    }

    return myClone;
}

window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    /*scene.onPointerDown = () => {
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
    }, false);
}

