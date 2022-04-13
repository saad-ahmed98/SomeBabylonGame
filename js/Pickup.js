class Pickup {
    constructor(originalx,originaly,offset) {
        this.originaly = originaly;
        this.originalx = originalx
        this.offset = offset;
        this.mesh
        this.direction = 1;
        this.dead = false;
        this.tag = ""
        this.tooltipimage = ""
    }

    createWalljump(scene){
        var obj = new BABYLON.Mesh.CreateDisc("", 5, 64, scene);
        var objmat = new BABYLON.StandardMaterial("", scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/walljump.png", scene);
        obj.material = objmat;
        obj.position.y = this.originaly;
        obj.position.x = this.originalx;
        this.mesh = obj
        this.tag = "walljump"
        this.tooltipimage = "images/WallJumpTooltip.png"
    }

    createSword(scene){
        var obj = new BABYLON.Mesh.CreateDisc("", 5, 64, scene);
        var objmat = new BABYLON.StandardMaterial("", scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/sword.png", scene);
        obj.material = objmat;
        obj.position.y = this.originaly;
        obj.position.x = this.originalx;
        this.mesh = obj
        this.tag = "sword"
        this.tooltipimage = "images/WallJumpTooltip.png"

    }

    createHPUp(scene){
    }

    activateEffect(player){
        switch(this.tag){
            case "walljump":
                player.powers["walljump"] = true
            case "sword":
                player.weapon ="sword"
                player.updateWeapon()
            case "hp":
                player.powers["hpbuffs"] +=10
        }
    }
    move() {
        this.mesh.position.y = this.mesh.position.y + (0.2 * this.direction);
        if (this.mesh.position.y > this.originaly + this.offset)
            this.direction = -1;

        if (this.mesh.position.y < this.originaly - this.offset)
            this.direction = 1;
    }
}