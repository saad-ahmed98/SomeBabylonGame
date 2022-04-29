class Bullet{
    constructor(direction) {
        this.direction = direction
        this.mesh
        this.createBullet()
        this.dead = false
    }

    move(){
        this.mesh.position.x +=1*this.direction
    }

    createBullet(x,y,scene){
        var colorMaterial = new BABYLON.StandardMaterial("", this.scene);
        colorMaterial.diffuseColor = BABYLON.Color3.Yellow();
        
        this.mesh = new BABYLON.MeshBuilder.CreateBox("", { height: 1, depth: 2, width: 3 }, scene);
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.material = colorMaterial
        var instance = this
        setTimeout(function(){
            instance.mesh.dispose()
            instance.dead = true
        },5000)
    }
}