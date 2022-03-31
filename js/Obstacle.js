class Obstacle {
    constructor(height,depth,width) {
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.mesh;
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