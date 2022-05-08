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
        this.width = ""
        this.height = ""
    }

    createWalljump(scene){
        var obj = new BABYLON.Mesh.CreateDisc("", 5, 64, scene);
        var objmat = new BABYLON.StandardMaterial("", scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/LVL1/walljump.png", scene);
        obj.material = objmat;
        obj.position.y = this.originaly;
        obj.position.x = this.originalx;
        this.mesh = obj
        this.tag = "walljump"
        this.tooltipimage = "images/LVL1/WallJumpTooltip.png"
        this.width = "700px"
        this.height = "196px"
    }

    createSword(scene){
        var obj = new BABYLON.Mesh.CreateDisc("", 5, 64, scene);
        var objmat = new BABYLON.StandardMaterial("", scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/common/sword.png", scene);
        obj.material = objmat;
        obj.position.y = this.originaly;
        obj.position.x = this.originalx;
        this.mesh = obj
        this.tag = "sword"
        this.tooltipimage = "images/common/SwordTooltip.png"
        this.width = "400px"
        this.height = "153px"

    }

    createHPUp(scene){

        var obj = new BABYLON.Mesh.CreateDisc("", 5, 64, scene);
        var objmat = new BABYLON.StandardMaterial("", scene);
        objmat.diffuseTexture = new BABYLON.Texture("images/common/hpup.png", scene);
        obj.material = objmat;
        obj.position.y = this.originaly;
        obj.position.x = this.originalx;
        this.mesh = obj
        this.tag = "hp"
        this.tooltipimage = "images/common/HPTooltip.png"
        this.width = "400px"
        this.height = "153px"
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
                player.hp+=2
                player.updateHpBar()
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