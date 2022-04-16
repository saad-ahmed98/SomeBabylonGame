class Personnage {
    constructor(height,width, hp, speed) {
        this.height = height;
        this.width = width;
        this.mesh;
        this.hp = hp
        this.speed = speed
        this.animationGroups
        this.healthBar;
        this.isattacking = false;

    }
    xleft(){
        return this.mesh.position.x - this.width/2
    }

    xright(){
        return this.mesh.position.x + this.width/2
    }

    yup(){
        return this.mesh.position.y + this.height/2
    }

    ydown(){
        return this.mesh.position.y - this.height/2
    }

    move(){
        throw "not implemented"
    }

    attack(){
        throw "not implemented"
    }

    die(){
        throw "not implemented"
    }
    
    xleft(){
        return this.mesh.position.x - this.width/2
    }

    xright(){
        return this.mesh.position.x + this.width/2
    }

    yup(){
        return this.mesh.position.y + this.height/2
    }

    ydown(){
        return this.mesh.position.y - this.height/2
    }
}