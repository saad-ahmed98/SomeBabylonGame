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
            if(this.mesh.position.y>this.targety)
            this.mesh.position.y -= 1;
            }
        }
    }

    start(){
        var instance = this;
        setTimeout(() => {
            instance.hasStarted = true
        }, 2000)
    }
}