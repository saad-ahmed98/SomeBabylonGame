class Pickup {
    constructor(originaly, offset, mesh) {
        this.originaly = originaly;
        this.offset = offset;
        this.mesh = mesh;
        this.direction = 1;
        this.dead = false;
    }
    move() {
        this.mesh.position.y = this.mesh.position.y + (0.2 * this.direction);
        if (this.mesh.position.y > this.originaly + this.offset)
            this.direction = -1;

        if (this.mesh.position.y < this.originaly - this.offset)
            this.direction = 1;
    }
}