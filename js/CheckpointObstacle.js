class CheckpointObstacle extends Obstacle{
    constructor(height,depth,width,enemies) {
        super(height, depth, width)
        this.enemies = enemies
    }

    verifyLifeEnemies(){
        for(let i = 0;i<this.enemies.length;i++){
            if(this.enemies[i].hp<=0){
                this.enemies.splice(i, 1)
                i--
            }
        }
    }

    colorMesh(scene){
        var colorMaterial = new BABYLON.GridMaterial("", scene);
        colorMaterial.majorUnitFrequency = 20;
        colorMaterial.gridRatio = 1;
        colorMaterial.mainColor = BABYLON.Color3.Red();
        this.mesh.material = colorMaterial

    }

    createDoor(scene){
        var comp = scene.assets.door.clone("")
        comp.parent = this.mesh
        comp.scaling.x = 14
        comp.scaling.y = 14
        comp.scaling.z = 14
        comp.rotation.y  =   Math.PI/2;
        comp.position.z = 10
        this.mesh.visibility = 0
    }
}