class Teleporter {
    constructor(goalX, goalY) {
        this.height = 25;
        this.width = 10;
        this.depth = 5;
        this.mesh;
        this.goalX=goalX;
        this.goalY=goalY;
    }


    createTeleport(x,y,scene) {
        var obj = new BABYLON.MeshBuilder.CreateBox("", { height: this.height, depth: this.depth, width: this.width }, scene);
        obj.position.x = x;
        obj.position.y = y+5;
        obj.visibility = 0.3;

        var obj2 = new BABYLON.Mesh.CreateDisc("", 8, 64, scene);
        var objmat = new BABYLON.StandardMaterial("", scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/LVL4/teleport.png", scene);

        obj2.material = objmat;
        obj2.position.x = x;
        obj2.position.y = y+30;
        this.mesh = obj;
    }

    teleport(player,camera){
        this.teleportSound(player.mesh._scene)
        camera.maxCameraSpeed = 100
        player.mesh.position.x = this.goalX
        player.mesh.position.y = this.goalY

        setTimeout(() => {
            camera.maxCameraSpeed = 5
        }, 200)
    }

    teleportSound(scene) {
        var sound = scene.assets.teleport
        sound.setVolume(0.4)
        sound.play()
    }
}