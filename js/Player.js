class Player extends Personnage {
    constructor(height, width, speed, gameconfig) {
        super(height, width, gameconfig.stats["hp"], speed)
        this.gameconfig = gameconfig
        this.swordmesh;

        //variables d'état, à changer
        this.jumping = false;
        this.lookAt = 1;
        this.walljumpingleft = false;
        this.walljumpingright = false;
        this.walljump = 0;
        this.poswalljumping = 0;
    }

    updateWeapon(){
        this.swordmesh.setEnabled(true)
    }

    move(followCamera,enemies) {

        let idle = true;
        if (!this.jumping) {
            this.mesh.position.y = this.mesh.position.y - 2.2
            this.animationGroups[1].play()
        }

        if (this.gameconfig.inputStates.space) {

            idle = false
            this.jump(followCamera)
        }
        if (this.gameconfig.inputStates.up) {
        }
        if (this.gameconfig.inputStates.down) {

        }
        if (this.gameconfig.inputStates.right) {
            idle = false

            this.mesh.moveWithCollisions(new BABYLON.Vector3(1 * this.gameconfig.rollingAverage.average * this.speed, 0, 0));
            if(!this.isattacking){
            this.lookAt = 1
            followCamera.rotationOffset = -90

            }
            this.mesh.lookAt(new BABYLON.Vector3(10000000*this.lookAt, 0, 0));
            followCamera.rotationOffset = 90

            if (this.jumping && !this.isattacking)
                this.animationGroups[4].play()

        }
        if (this.gameconfig.inputStates.left) {
            idle = false

            this.mesh.moveWithCollisions(new BABYLON.Vector3(-1 * this.gameconfig.rollingAverage.average * this.speed, 0, 0));
            if(!this.isattacking){
            followCamera.rotationOffset = -90
            this.lookAt = -1
            }
            this.mesh.lookAt(new BABYLON.Vector3(10000000*this.lookAt, 0, 0));
            if (this.jumping && !this.isattacking)
                this.animationGroups[4].play()
        }
        if(this.gameconfig.inputStates.left && this.gameconfig.inputStates.right)
            followCamera.rotationOffset = 90

        if (this.gameconfig.inputStates.attack) {
            idle = false
            if(!this.isattacking)
            this.attack(enemies)
        }

        if (idle && this.walljump && this.jumping) {
            for (let i = 0; i < this.animationGroups; i++) {
                this.animationGroups[i].stop()
            }
            this.animationGroups[2].play(true)
        }
    }

    attack(enemies) {
        var instance = this
            this.isattacking = true
            this.animationGroups[5].play()
            setTimeout(() => {
                instance.isattacking = false;
                instance.checkHit(enemies)
            },500)
            //swingSword(this.scene,this.player)
    }

    receiveDamage(dmg) {
        this.hp -= dmg
        //this.updateHpBar()
        console.log(this.hp)
        if (this.hp <= 0) {
            console.log("GAME OVER")
            //this.animationGroups[1].play()
        }
    }

    checkHit(enemies){
        for(let i = 0;i<enemies.length;i++){
            if(enemies[i].hp>0){
                var pos = this.mesh.position.x +this.width/2*this.lookAt - enemies[i].mesh.position.x+enemies[i].width/2*this.lookAt
            if( Math.abs(pos)<this.weaponrange()){
                enemies[i].receiveDamage(this.weapondmg())
            }
            }
        }
    }

    weaponrange(){
        switch(this.gameconfig.stats["weapon"]){
            case "fists":
                return 3
            case "sword":
                return 5
        }
    }

    weapondmg(){
        switch(this.gameconfig.stats["weapon"]){
            case "fists":
                return 1
            case "sword":
                return 3
        }
    }

    jump(followCamera) {
        if (this.walljumpingleft && this.walljump < 25 && this.gameconfig.stats["walljump"]) {
            if (this.walljump < 15)
                this.gameconfig.inputStates.right = false;
            this.mesh.moveWithCollisions(new BABYLON.Vector3(-0.7 * this.gameconfig.rollingAverage.average * this.speed, 0, 0));
            this.mesh.moveWithCollisions(new BABYLON.Vector3(0, 2 * this.gameconfig.rollingAverage.average * this.speed, 0));
            this.mesh.lookAt(new BABYLON.Vector3(-10000000, 0, 0));
            followCamera.rotationOffset = -90
            this.lookAt = -1
            this.walljump++;

        }
        else {
            if (this.walljumpingright && this.walljump < 25 && this.gameconfig.stats["walljump"]) {
                if (this.walljump < 15)
                    this.gameconfig.inputStates.left = false;
                this.mesh.moveWithCollisions(new BABYLON.Vector3(0.7 * this.gameconfig.rollingAverage.average * this.speed, 0, 0));
                this.mesh.moveWithCollisions(new BABYLON.Vector3(0, 2 * this.gameconfig.rollingAverage.average * this.speed, 0));
                this.mesh.lookAt(new BABYLON.Vector3(10000000, 0, 0));
                followCamera.rotationOffset = 90
                this.lookAt = 1
                this.walljump++;
            }
            else {
                if (this.jumping || this.gameconfig.jumpingstarted < 30) {
                    this.mesh.moveWithCollisions(new BABYLON.Vector3(0, 2 * this.gameconfig.rollingAverage.average * this.speed, 0));
                    this.mesh.lookAt(new BABYLON.Vector3(this.lookAt * 10000000, 0, 0));
                    this.gameconfig.updateJump()
                    this.jumping = false;
                }
            }
        }
        this.animationGroups[1].play()
    }

}