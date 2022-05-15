class Player extends Personnage {
    constructor(height, width, speed, gameconfig) {
        super(height, width, gameconfig.stats["hp"], speed)
        this.gameconfig = gameconfig
        this.swordmesh;
        this.jumping = false;
        this.lookAt = 1;
        this.walljumpingleft = false;
        this.walljumpingright = false;
        this.walljump = 0;
        this.poswalljumping = 0;
    }

    updateWeapon() {
        if (this.gameconfig.stats["weapon"] == "sword")
            this.swordmesh.setEnabled(true)
    }

    
    updateHpBar() {
        cyborg.style.display = "block"
        if (this.hp <= 0) {
            this.hp = 0;
        }
        document.getElementById("progressbarWrapper").style.width=this.gameconfig.stats["hp"]*30;
        document.getElementById("greenBar").style.width=this.hp*30;
    }


    move(followCamera, enemies) {
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
            if (!this.isattacking) {
                this.lookAt = 1
                followCamera.rotationOffset = 90

            }
            this.mesh.lookAt(new BABYLON.Vector3(10000000 * this.lookAt, 0, 0));
           

            if (this.isattacking)
                followCamera.rotationOffset = 90 * this.lookAt

            if (this.jumping && !this.isattacking)
                this.animationGroups[4].play()

        }
        if (this.gameconfig.inputStates.left) {
            idle = false

            this.mesh.moveWithCollisions(new BABYLON.Vector3(-1 * this.gameconfig.rollingAverage.average * this.speed, 0, 0));
            if (!this.isattacking) {
                followCamera.rotationOffset = -90
                this.lookAt = -1
            }
            this.mesh.lookAt(new BABYLON.Vector3(10000000 * this.lookAt, 0, 0));
            


            if (this.jumping && !this.isattacking)
                this.animationGroups[4].play()
        }
        if (this.gameconfig.inputStates.left && this.gameconfig.inputStates.right)
            followCamera.rotationOffset = -90

        if (this.gameconfig.inputStates.attack) {
            idle = false
            if (!this.isattacking)
                this.attack(enemies)
        }

        if (idle && this.walljump && this.jumping) {
            for (let i = 0; i < this.animationGroups; i++) {
                this.animationGroups[i].stop()
            }
            this.animationGroups[2].play()
        }
    }

    attack(enemies) {
        var instance = this
        this.isattacking = true
        this.animationGroups[5].play()
        setTimeout(() => {
            instance.isattacking = false;
            instance.checkHit(enemies)
            instance.attackSound(instance.mesh._scene)
            if (instance.gameconfig.stats["weapon"] == "sword")
                instance.swingSword(instance.mesh._scene)
        }, 500)
    }

    swingSword(scene) {
        var swing = scene.assets.swordSwingSound
        swing.setVolume(0.1)
        if (!swing.isPlaying)
            swing.play()
    }

    attackSound(scene) {
        var sound = scene.assets.attack
        sound.setVolume(1)
        if (!sound.isPlaying)
            sound.play()
    }

    hurtSound(scene) {
        var sound = scene.assets.hurt
        sound.setVolume(1)
        sound.play()
    }

    jumpSound(scene) {
        var sound = scene.assets.attack
        sound.setVolume(1)
        if (!sound.isPlaying)
            sound.play()
    }

    walljumpSound(scene) {
        var sound = scene.assets.attack
        sound.setVolume(1)
        sound.play()
    }

    receiveDamage(dmg) {
        this.hp -= dmg
        this.updateHpBar()
        if(this.hp>0)
        this.hurtSound(this.mesh._scene)
        var instance = this;
        if (this.hp <= 0) {
            for (let i = 1; i < this.animationGroups; i++) {
                this.animationGroups[i].stop()
            }
            this.animationGroups[0].play()
            setTimeout(() =>{
                instance.mesh.dispose()
            },2500
            )
        }
    }

    checkHit(enemies) {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].hp > 0) {
                var pos = this.mesh.position.x + this.width / 2 * this.lookAt - enemies[i].mesh.position.x + enemies[i].width / 2 * this.lookAt
                if (Math.abs(pos) < this.weaponrange()) {
                    enemies[i].receiveDamage(this.weapondmg())
                }
            }
        }
    }

    weaponrange() {
        switch (this.gameconfig.stats["weapon"]) {
            case "fists":
                return 3
            case "sword":
                return 5
        }
    }

    weapondmg() {
        switch (this.gameconfig.stats["weapon"]) {
            case "fists":
                return 1
            case "sword":
                return 3
        }
    }

    jump(followCamera) {
        if (this.walljumpingleft && this.walljump < 25 && this.gameconfig.stats["walljump"]) {
            if (this.walljump == 0)
                this.walljumpSound(this.mesh._scene)
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
                if (this.walljump == 0)
                    this.jumpSound(this.mesh._scene)
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
                    if (this.gameconfig.jumpingstarted == 0)
                        this.jumpSound(this.mesh._scene)
                    this.gameconfig.updateJump()
                    this.jumping = false;

                }
            }
        }
        this.animationGroups[1].play()
    }

}