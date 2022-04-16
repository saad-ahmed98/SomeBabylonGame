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

        var obj = new BABYLON.Mesh.CreateDisc("", 5, 64, scene);
        var objmat = new BABYLON.StandardMaterial("", scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/hpup.png", scene);
        obj.material = objmat;
        obj.position.y = this.originaly;
        obj.position.x = this.originalx;
        this.mesh = obj
        this.tag = "hp"
        this.tooltipimage = "images/WallJumpTooltip.png"
    }

    activateEffect(player){
        switch(this.tag){
            case "walljump":
                player.gameconfig.stats["walljump"] = true
                break
            case "sword":
                player.gameconfig.stats["weapon"] ="sword"
                player.updateWeapon()
                break
            case "hp":
                player.gameconfig.stats["hp"] +=2
                console.log(player.gameconfig.stats)
                console.log(player.gameconfig.statsprev)

                player.hp+=2
                break
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