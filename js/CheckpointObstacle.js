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
        var colorMaterial = new BABYLON.StandardMaterial("", scene);
        colorMaterial.diffuseColor = BABYLON.Color3.Red();
        this.mesh.material = colorMaterial
    }
}