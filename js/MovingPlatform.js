class MovingPlatform extends Obstacle {
    constructor(height, depth, width, originalx, originaly, offset, where, speed) {
        super(height, depth, width)
        this.offset = offset
        this.originaly = originaly;
        this.originalx = originalx;
        this.direction = 1;
        this.where = where;
        this.speed = speed
    }

    move(player) {
        if (this.where == "y") {
            this.mesh.position.y = this.mesh.position.y + (1 * this.direction*this.speed);
            if (this.mesh.position.y > this.originaly + this.offset)
                this.direction = -1;

            if (this.mesh.position.y < this.originaly - this.offset)
                this.direction = 1;
        }
        else {
            this.mesh.position.x = this.mesh.position.x + (1 * this.direction*this.speed);
            if(this.collision(player))
                player.mesh.position.x = player.mesh.position.x + (1 * this.direction*this.speed);
            if (this.mesh.position.x > this.originalx + this.offset)
                this.direction = -1;

            if (this.mesh.position.x < this.originalx - this.offset)
                this.direction = 1;
        }
    }

    collision(player) {
            var val = player.width/2
            if (player.mesh.position.x < this.xright() + val && player.mesh.position.x > this.xleft() - val) {
                let posup = player.mesh.position.y - 5 - this.yup()
                let posdown = player.mesh.position.y + 5 - this.ydown()
                let posleft = player.mesh.position.x - 3 - this.xleft()
                let posright = player.mesh.position.x + 3 - this.xright()

                if (posleft < 0 && player.mesh.position.y - 5 < this.yup() && player.mesh.position.y + 5 > this.ydown()) {
                }
                else if (posright > 0 && player.mesh.position.y - 5 < this.yup() && player.mesh.position.y + 5 > this.ydown()) {
                }
                else if (player.mesh.position.x < this.xright() && player.mesh.position.x > this.xleft()) {
                    if (posdown < 0) {
                    }
                    else if (posup < 2) {
                        return true
                    }
                }
            }
        return false
    }
}