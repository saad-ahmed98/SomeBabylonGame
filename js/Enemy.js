class Enemy extends Personnage {
    constructor(height, width, hp, speed, player, originalx, originaly, offset) {
        super(height, width, hp, speed)
        this.player = player
        this.originalx = originalx
        this.offset = offset
        this.direction = 1;
        this.originaly = originaly
        this.hptot = hp
        this.alert = false
        this.attackdmg = 0
        this.canFireLasers = true
        this.bullets = []
    }

    receiveDamage(dmg) {
        this.hp -= dmg
        this.updateHpBar()
        if (this.hp <= 0) {
            if (this.attackdmg > 0) {
                if (this.hp != -999)
                    this.deathSound(this.mesh._scene)
                var instance = this
                this.animationGroups[1].play()
                for (let i = 0; i < this.bullets.length; i++) {
                    if (!this.bullets[i].dead) {
                        this.bullets[i].mesh.dispose()
                        this.bullets[i].dead = true
                    }
                }
                setTimeout(() => {
                    instance.mesh.dispose()
                    instance.hp = -999
                }, 1400)
            }
            else {
                this.mesh.dispose()
                this.bossanimations[3].play()
            }
        }
    }

    updateHpBar() {
        var hpbar = this.hp
        if (hpbar <= 0)
            hpbar = 0;

        if (hpbar >= 0) {
            this.healthBar.scaling.x = hpbar / this.hptot;
            this.healthBar.position.x = (1 - (hpbar / this.hptot)) * -1;
        }
    }

    createEnemy1(scene) {
        var box = new BABYLON.MeshBuilder.CreateBox("", { height: this.height, depth: 5, width: this.width }, scene);
        box.position.x = this.originalx;
        box.position.y = this.originaly;
        box.lookAt(new BABYLON.Vector3(10, 0, 0));
        box.visibility = 0;

        box.frontVector = new BABYLON.Vector3(0, 0, 1);

        //actual character
        var mesh = scene.assets.enemy1.pop();
        mesh.name = "";

        mesh.parent = box;
        mesh.position.x = 0;
        mesh.position.z = 0;
        mesh.position.y = -5;
        mesh.scaling.x = 3;
        mesh.scaling.z = 3;
        mesh.scaling.y = 3;
        mesh.rotation = new BABYLON.Vector3(0, 0, 0);

        this.animationGroups = scene.assets.animations1.pop();
        this.animationGroups[5].play(true)
        this.mesh = box

        this.addHPBar(scene)
        this.updateHpBar()
        this.attackdmg = 1
    }

    shoot(scene) {
        var x = this.mesh.position.x - this.player.mesh.position.x
        if (x > 0)
            this.direction = -1
        else this.direction = 1
        this.mesh.lookAt(new BABYLON.Vector3(this.direction * 10000000, 0, 0));
        this.healthBar.lookAt(new BABYLON.Vector3(10000000 * -this.direction, 0, 0));


        if (!this.canFireLasers) return;

        this.canFireLasers = false;

        setTimeout(() => {
            this.canFireLasers = true;
        }, 3000);

        this.animationGroups[13].play()

        scene.assets.laserSound.setVolume(0.1);
        scene.assets.laserSound.play();

        var bullet = new Bullet(this.direction)
        bullet.createBullet(this.mesh.position.x + 2 * this.direction, this.mesh.position.y + 8, this.mesh._scene)
        this.bullets.push(bullet)
    }

    createEnemy3(scene) {
        var box = new BABYLON.MeshBuilder.CreateBox("", { height: this.height, depth: 5, width: this.width }, scene);
        box.position.x = this.originalx;
        box.position.y = this.originaly;
        box.lookAt(new BABYLON.Vector3(10, 0, 0));
        box.visibility = 0;

        box.frontVector = new BABYLON.Vector3(0, 0, 1);

        //actual character
        var mesh = scene.assets.enemy3.pop();
        mesh.name = "";

        mesh.parent = box;
        mesh.position.x = 0;
        mesh.position.z = 0;
        mesh.position.y = -5;
        mesh.scaling.x = 3;
        mesh.scaling.z = 3;
        mesh.scaling.y = 3;
        mesh.rotation = new BABYLON.Vector3(0, 0, 0);

        //mesh._scene.animationGroups[2].play(true)

        this.animationGroups = scene.assets.animations3.pop();
        this.animationGroups[5].play(true)
        this.mesh = box

        this.addHPBar(scene)
        this.updateHpBar()
        this.attackdmg = 1
    }

    createEnemy2(scene) {
        var box = new BABYLON.MeshBuilder.CreateBox("", { height: this.height, depth: this.width, width: 5 }, scene);
        box.position.x = this.originalx;
        box.position.y = this.originaly;
        box.lookAt(new BABYLON.Vector3(10, 0, 0));
        box.visibility = 0;

        box.frontVector = new BABYLON.Vector3(0, 0, 1);

        //actual character
        var mesh = scene.assets.enemy2.pop();
        mesh.name = "";

        mesh.parent = box;
        mesh.position.x = 0;
        mesh.position.z = 0;
        mesh.position.y = -5;
        mesh.scaling.x = 3.5;
        mesh.scaling.z = 3.5;
        mesh.scaling.y = 3.5;
        mesh.rotation = new BABYLON.Vector3(0, 0, 0);

        //mesh._scene.animationGroups[2].play(true)

        this.animationGroups = scene.assets.animations2.pop();
        this.animationGroups[5].play(true)
        this.mesh = box
        this.attackdmg = 2

        this.addHPBar(scene)
        this.updateHpBar()
    }

    createGenerator(scene) {
        var box = new BABYLON.MeshBuilder.CreateBox("", { height: this.height, depth: this.width, width: 5 }, scene);
        box.position.x = this.originalx;
        box.position.y = this.originaly;
        box.visibility = 0;


        //actual character
        var mesh = scene.assets.generators.pop();
        this.bossanimations =  scene.assets.bossanimation
        mesh.name = "";

        mesh.parent = box;
        mesh.position.x = 0;
        mesh.position.z = 0;
        mesh.position.y = -22;
        mesh.scaling.x = 18;
        mesh.scaling.z = 18;
        mesh.scaling.y = 18;
        //mesh.rotation = new BABYLON.Vector3(0, 0, 0);

        this.mesh = box
        this.attackdmg = 0

        this.addHPBar(scene)
        this.updateHpBar()

        this.mesh.lookAt(new BABYLON.Vector3(10000000, 0, 0));
        this.healthBar.lookAt(new BABYLON.Vector3(10000000, 0, 0));
    }

    addHPBar(scene) {
        var healthBarMaterial = new BABYLON.StandardMaterial("hb1mat", scene);
        
        healthBarMaterial.diffuseColor = BABYLON.Color3.Red();
        
        healthBarMaterial.backFaceCulling = false;


        var dynamicTexture = new BABYLON.DynamicTexture("dt1", 512, scene, true);
        dynamicTexture.hasAlpha = true;

        var healthBar = BABYLON.MeshBuilder.CreatePlane("hb1", { width: 15, height: 3, subdivisions: 4 }, scene);
        // healthBar.position = new BABYLON.Vector3(0, 17, 0);     // Position above player.
        var pos = 17
        if (this.attackdmg == 2)
            pos = 22
        healthBar.position = new BABYLON.Vector3(0, pos, 0);

        healthBar.parent = this.mesh;
        healthBar.rotation = new BABYLON.Vector3(0, 2, 0);

        this.healthBar = healthBar

        healthBar.material = healthBarMaterial;
    }

    move() {
        if (this.attackdmg > 0) {
            for (let i = 0; i < this.bullets.length; i++)
                this.bullets[i].move()
            if (!this.isattacking) {
                this.mesh.position.y = this.mesh.position.y - 1
                var x = Math.abs(this.mesh.position.x - this.player.mesh.position.x)

                if (this.alert && x <= 60) {
                    if (this.hptot != 4)
                        this.moveTowardsPlayer()
                    else this.shoot(this.mesh._scene)
                }
                else if (this.mesh.position.y - this.player.mesh.position.y == -1 && x <= 150) {
                    if (this.hptot != 4)
                        this.moveTowardsPlayer()
                    else this.shoot(this.mesh._scene)
                }
                else {
                    if (this.alert) {
                        this.resetPatrolPosition()
                        this.alert = false
                    }
                    this.patrol()
                }
            }
        }
    }

    resetPatrolPosition() {
        if (this.mesh.position.x < this.originalx)
            this.direction = 1
        else this.direction = -1

    }

    moveTowardsPlayer() {
        var instance = this

        this.alert = true
        var x = this.mesh.position.x - this.player.mesh.position.x
        if (x > 0)
            this.direction = -1
        else this.direction = 1
        this.mesh.lookAt(new BABYLON.Vector3(this.direction * 10000000, 0, 0));
        this.healthBar.lookAt(new BABYLON.Vector3(10000000 * -this.direction, 0, 0));
        if (Math.abs(this.mesh.position.x - this.player.mesh.position.x) < 12) {
            this.isattacking = true
            setTimeout(() => {
                if (instance.hp > 0)
                    instance.attack()
            }, 1000)
        }
        else {
            this.mesh.position.x = this.mesh.position.x + (1 * this.speed * 3 * this.direction);
            if (this.hp > 0)
                this.animationGroups[11].play()
        }
    }

    patrol() {
        this.mesh.position.x = this.mesh.position.x + (1 * this.speed * this.direction);
        if (this.mesh.position.x > this.originalx + this.offset)
            this.direction = -1;
        if (this.mesh.position.x < this.originalx - this.offset)
            this.direction = 1;

        this.mesh.lookAt(new BABYLON.Vector3(this.direction * 10000000, 0, 0));
        this.healthBar.lookAt(new BABYLON.Vector3(10000000 * -this.direction, 0, 0));
        var anim = 15
        if (this.attackdmg == 2)
            anim = 16
        if (this.hp > 0)
            this.animationGroups[anim].play()

    }

    checkHit() {
        var pos = this.mesh.position.x + this.width / 2 * this.direction - this.player.mesh.position.x + this.player.width / 2 * this.direction
        if (Math.abs(pos) < 3) {
            this.player.receiveDamage(this.attackdmg)
        }
    }


    attackSound(scene) {
        var sound
        if (this.attackdmg == 2)
            sound = scene.assets.enemy2attack
        else sound = scene.assets.enemyattack
        sound.setVolume(0.4)
        if (!sound.isPlaying)
            sound.play()
    }

    deathSound(scene) {
        var sound
        if (this.attackdmg == 2)
            sound = scene.assets.enemy2death
        else sound = scene.assets.enemydeath
        sound.setVolume(0.4)
        if (!sound.isPlaying)
            sound.play()
    }

    attack() {
        this.attackSound(this.mesh._scene)
        var instance = this
        if (this.hp > 0)
            this.animationGroups[10].play()

        setTimeout(() => {
            instance.isattacking = false
            instance.checkHit()
        }, 500)
    }

}