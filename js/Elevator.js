class Elevator extends Obstacle{
    constructor(height,depth,width, targety) {
        super(height, depth, width)
        this.enemies = []
        this.targety = targety
        this.hasStarted = false
    }

    verifyLifeEnemies(){
        for(let i = 0;i<this.enemies.length;i++){
            if (this.enemies[i].hp == -999) {
                this.enemies.splice(i, 1)
                i--
            }
        }
    }

    move(){
        if(this.hasStarted){
            if(this.enemies.length==0){
            if(this.mesh.position.y>this.targety){
            this.elevatorSound(this.mesh._scene)
            this.mesh.position.y -= 1;
            }
            else this.mesh._scene.assets.elevator.stop()
            }
        }
    }

    addDetails(scene){
    
            var obj = scene.assets.switch
            obj.parent=this.mesh

            obj.position.x = 100
            obj.position.y = 5
            obj.position.z = 15
            obj.scaling.x = 8
            obj.scaling.y = 8
            obj.scaling.z = 8

            var obj = scene.assets.tile
            obj.parent=this.mesh

            obj.position.x = 100
            obj.position.y = 4.5
            obj.scaling.x = 50
            obj.scaling.y = 30
            obj.scaling.z = 50

            var obj2 = obj.clone()
            obj2.position.x = 0

            obj2 = obj.clone()
            obj2.position.x = -100

    }

    start(){
        var instance = this;
        setTimeout(() => {
            instance.hasStarted = true
        }, 2000)
    }

    elevatorSound(scene) {
        var sound = scene.assets.elevator
        sound.setVolume(0.5)
        if (!sound.isPlaying)
            sound.play()
    }

    alertSound(scene){
       scene.assets.elevator.stop()
        var sound = scene.assets.alert
        sound.setVolume(0.3)
        if (!sound.isPlaying)
            sound.play()
    }
}