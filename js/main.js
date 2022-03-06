import Dude from "./Dude.js";

let canvas;
let engine;
let scene;
// vars for handling inputs
let inputStates = {};

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

        let heroDude = scene.getMeshByName("heroDude");
        if(heroDude)
            heroDude.Dude.move(scene);

        if(scene.dudes) {
            for(var i = 0 ; i < scene.dudes.length ; i++) {
                scene.dudes[i].Dude.move(scene);
            }
        }    

        scene.render();
    });
}


function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);
    let tank = createTank(scene);
    BABYLON.SceneLoader.ImportMesh("Lightning Gun", "models/", "LightningGun.glb", scene, function (meshes, particleSystems, skeletons) {
        for(let i = 0; i<meshes.length;i++){
            meshes[i].name="gun"+i;
            meshes[i].parent = tank;
            meshes[i].position.x = 6;
            meshes[i].scaling.x = 2.5;
            meshes[i].scaling.z=2.5;
            meshes[i].rotation = new BABYLON.Vector3(0,3.1, 0);
        }
    });
    //BABYLON.SceneLoader.ImportMesh("", "models/", "RayGun.glb", scene, onGunImported);

    Ammo().then(() => {
    scene.enablePhysics(null, new BABYLON.AmmoJSPlugin());
    var physicsEngine = scene.getPhysicsEngine();
    physicsEngine.gravity.y = -100



    // Add Imposters
    tank.physicsImpostor = new BABYLON.PhysicsImpostor(tank, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, restitution: 0 }, scene);
    tank.physicsImpostor.physicsBody.collisionFilterGroup = 1
    tank.position.y=5
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    ground.physicsImpostor.physicsBody.collisionFilterMask = 1 | 2

    
    addWallPhysics(scene)
    //box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0.7 }, scene);

    // second parameter is the target to follow
    let followCamera = createFollowCamera(scene, tank);
    //scene.activeCamera = followCamera;
    scene.activeCamera = freeCamera;

    createLights(scene);

    //createHeroDude(scene);

    window.addEventListener("mousemove", function () {
		// We try to pick an object
		var pickResult = scene.pick(scene.pointerX, scene.pointerY);
		if (pickResult.hit) {
			var targetPoint = pickResult.pickedPoint;
			targetPoint.y = tank.position.y;
			tank.lookAt(targetPoint);
		}
	});
})



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

   return scene;
}

var translate = function (mesh, direction, power) {
    mesh.physicsImpostor.setLinearVelocity(
        mesh.physicsImpostor.getLinearVelocity().add(direction.scale(power)
        )
    );
}

function getWallsImposters(scene){
   return [scene.getMeshByName("up").physicsImpostor,scene.getMeshByName("down").physicsImpostor,scene.getMeshByName("right").physicsImpostor,scene.getMeshByName("left").physicsImpostor]
}

function addWallPhysics(scene){
    var up = scene.getMeshByName("up")
    up.physicsImpostor = new BABYLON.PhysicsImpostor(up, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0.7 }, scene);
    up.physicsImpostor.physicsBody.collisionFilterMask = 1 | 2

    var down = scene.getMeshByName("down")
    down.physicsImpostor = new BABYLON.PhysicsImpostor(down, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0.7 }, scene);
    down.physicsImpostor.physicsBody.collisionFilterMask = 1 | 2

    var right = scene.getMeshByName("right")
    right.physicsImpostor = new BABYLON.PhysicsImpostor(right, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0.7 }, scene);
    right.physicsImpostor.physicsBody.collisionFilterMask = 1 | 2

    var left = scene.getMeshByName("left")
    left.physicsImpostor = new BABYLON.PhysicsImpostor(left, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0.7 }, scene);
    left.physicsImpostor.physicsBody.collisionFilterMask = 1 | 2

}

function createWalls(len,width,height, scene) {
    // Create the outer wall using a Cylinder mesh
    var right = new BABYLON.MeshBuilder.CreateBox("right", {height:height, depth:len, width:10}, scene);
    right.position.x=len/2-5
    var left = new BABYLON.MeshBuilder.CreateBox("left", {height:height, depth:len, width:10}, scene);
    left.position.x=-len/2+5

    var up = new BABYLON.MeshBuilder.CreateBox("up", {height:height, depth:10, width:width-20}, scene);
    up.position.z=width/2-5

    var bottom = new BABYLON.MeshBuilder.CreateBox("down", {height:height, depth:10, width:width-20}, scene);
    bottom.position.z=-width/2+5
    return [right,left,up,bottom];
}

function createGround(scene) {
    //const groundOptions = { width:200, height:200, subdivisions:20, minHeight:0, maxHeight:50, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    //const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/lvl1.png', groundOptions, scene); 
    var ground = BABYLON.MeshBuilder.CreateGround("Ground", {width: 200, height: 200}, scene);
    
        const groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
        //groundMaterial.diffuseTexture = new BABYLON.Texture("images/grass.jpg");
        ground.material = groundMaterial;

        var walls = createWalls(200,200,100,scene)
        for(let i = 0;i<walls.length;i++){
            walls[i].material = groundMaterial;
        }

        // to be taken into account by collision detection
        ground.checkCollisions = true;
    return ground;
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);

}

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 300, -10), scene);
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);

    camera.radius = 40; // how far from the object to follow
	camera.heightOffset = 14; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit

    return camera;
}

let zMovement = 5;
function createTank(scene) {
    let tank = new BABYLON.MeshBuilder.CreateBox("heroTank", {height:5, depth:6, width:10}, scene);
    let tankhead = new BABYLON.MeshBuilder.CreateBox("heroTank", {height:10, depth:5, width:6}, scene);
    tankhead.parent = tank; //1

    let tankMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
    tankMaterial.diffuseColor = new BABYLON.Color3.Red;
    //tankMaterial.emissiveColor = new BABYLON.Color3.Blue;
    tank.material = tankMaterial;

    let gunmaterial = new BABYLON.StandardMaterial("gunMaterial", scene);
    gunmaterial.diffuseColor = new BABYLON.Color3.Yellow;
    //gunmaterial.emissiveColor = new BABYLON.Color3.Blue;
    tankhead.material = gunmaterial;

    // By default the box/tank is in 0, 0, 0, let's change that...
    tank.position.y = 0.6;
    tankhead.position.y = 0.6;

    tank.speed = 1;
    tank.frontVector = new BABYLON.Vector3(0, 0, 1);

    tank.move = () => {
                //tank.position.z += -1; // speed should be in unit/s, and depends on
                                 // deltaTime !

        // if we want to move while taking into account collision detections
        // collision uses by default "ellipsoids"

        let yMovement = 0;
       
        if (tank.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        } 
        //tank.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));

        if(inputStates.up) {
            tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
            //tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, tank.speed, tank.speed));
        }    
        if(inputStates.down) {
            tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            //tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, -tank.speed, -tank.speed));

        }    
        if(inputStates.left) {
            tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
            //tank.rotation.y -= 0.02;
            //tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
        }    
        if(inputStates.right) {
            tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
            //tank.rotation.y += 0.02;
            //tank.frontVector = new BABYLON.Vector3(Math.sin(tank.rotation.y), 0, Math.cos(tank.rotation.y));
        }

    }

    return tank;
}

function createHeroDude(scene) {
   // load the Dude 3D animated model
    // name, folder, skeleton name 
    BABYLON.SceneLoader.ImportMesh("him", "models/Dude/", "Dude.babylon", scene,  (newMeshes, particleSystems, skeletons) => {
        let heroDude = newMeshes[0];
        heroDude.position = new BABYLON.Vector3(0, 0, 5);  // The original dude
        // make it smaller 
        heroDude.scaling = new BABYLON.Vector3(0.2  , 0.2, 0.2);
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
        for(let i = 0; i < 10; i++) {
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
    let xrand = Math.floor(Math.random()*500 - 250);
    let zrand = Math.floor(Math.random()*500 - 250);

    myClone = originalMesh.clone("clone_" + id);
    myClone.position = new BABYLON.Vector3(xrand, 0, zrand);

    if(!skeletons) return myClone;

    // The mesh has at least one skeleton
    if(!originalMesh.getChildren()) {
        myClone.skeleton = skeletons[0].clone("clone_" + id + "_skeleton");
        return myClone;
    } else {
        if(skeletons.length === 1) {
            // the skeleton controls/animates all children, like in the Dude model
            let clonedSkeleton = skeletons[0].clone("clone_" + id + "_skeleton");
            myClone.skeleton = clonedSkeleton;
            let nbChildren = myClone.getChildren().length;

            for(let i = 0; i < nbChildren;  i++) {
                myClone.getChildren()[i].skeleton = clonedSkeleton
            }
            return myClone;
        } else if(skeletons.length === originalMesh.getChildren().length) {
            // each child has its own skeleton
            for(let i = 0; i < myClone.getChildren().length;  i++) {
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
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = true;
        }  else if (event.key === " ") {
           inputStates.space = true;
        }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = false;
        }  else if (event.key === " ") {
           inputStates.space = false;
        }
    }, false);
}

