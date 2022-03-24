export default class Pickup {
    constructor(originaly,offset,mesh) {
        this.originaly = originaly;
        this.offset = offset;
        this.mesh = mesh;
        this.direction = 1;
        this.dead = false;
    }
}