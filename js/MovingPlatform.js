import Obstacle from "./Obstacle.js";

export default class MovingPlatform extends Obstacle {
    constructor(height, depth, width, originalx, originaly, offset, where) {
        super(height, depth, width)
        this.offset = 20
        this.originaly = originaly;
        this.originalx = originalx;
        this.direction = 1;
        this.where = where;
    }

    move() {
        if (this.where == "y") {
            this.mesh.position.y = this.mesh.position.y + (1 * this.direction);
            if (this.mesh.position.y > this.originaly + this.offset)
                this.direction = -1;

            if (this.mesh.position.y < this.originaly - this.offset)
                this.direction = 1;
        }
        else {
            this.mesh.position.x = this.mesh.position.x + (1 * this.direction);
            if (this.mesh.position.x > this.originalx + this.offset)
                this.direction = -1;

            if (this.mesh.position.x < this.originalx - this.offset)
                this.direction = 1;
        }
    }
}