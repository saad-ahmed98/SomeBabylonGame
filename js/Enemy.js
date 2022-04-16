class Enemy extends Personnage {
    constructor(height, width, hp, speed, player, originalx, originaly, offset) {
        super(height, width, hp, speed)
        this.player = player
        this.originalx = originalx
        this.offset = offset
        this.direction = 1;
        this.originaly = originaly
        this.healthBar;
        this.hptot = hp
        this.alert = false
        this.attackdmg = 0
    }

    receiveDamage(dmg) {
        this.hp -= dmg
        this.updateHpBar()
        if (this.hp <= 0) {
            var instance = this
            this.animationGroups[1].play()
            setTimeout(() => {
                instance.mesh.dispose()
            }, 1800)
        }
    }

    updateHpBar() {
        var healthBar = this.healthBar.getChildren()[0]
        var healthBarText = this.healthBar.getChildren()[1]
        if (this.hp <= 0) {
            this.hp = 0;
        }

        if (this.hp >= 0) {
            healthBar.scaling.x = this.hp / this.hptot;
            healthBar.position.x = (1 - (this.hp / this.hptot)) * -1;

            if (healthBar.scaling.x < .3) {
                healthBar.material.diffuseColor = BABYLON.Color3.Red();
            }
            else if (healthBar.scaling.x < .5) {
                healthBar.material.diffuseColor = BABYLON.Color3.Yellow();
            }

            var textureContext = healthBarText.material.diffuseTexture.getContext();
            var size = healthBarText.material.diffuseTexture.getSize();
            var text = this.hp + "/" + this.hptot;
            if (this.hp == 0) {
                healthBarText.material.diffuseColor = BABYLON.Color3.Red();
                text = "DEAD"
            }

            textureContext.clearRect(0, 0, size.width, size.height);

            textureContext.font = "bold 120px Calibri";
            var textSize = textureContext.measureText(text);
            textureContext.fillStyle = "white";
            textureContext.fillText(text, (size.width - textSize.width) / 2, (size.height - 120) / 2);

            healthBarText.material.diffuseTexture.update();
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

        //mesh._scene.animationGroups[2].play(true)

        this.animationGroups = scene.assets.animations1.pop();
        this.animationGroups[5].play(true)
        this.mesh = box

        this.addHPBar(scene)
        this.updateHpBar()
        this.attackdmg = 1
    }

    addHPBar(scene) {
        var healthBarMaterial = new BABYLON.StandardMaterial("hb1mat", scene);
        healthBarMaterial.diffuseColor = BABYLON.Color3.Green();
        healthBarMaterial.backFaceCulling = false;

        var healthBarContainerMaterial = new BABYLON.StandardMaterial("hb2mat", scene);
        healthBarContainerMaterial.diffuseColor = BABYLON.Color3.Blue();
        healthBarContainerMaterial.backFaceCulling = false;

        var dynamicTexture = new BABYLON.DynamicTexture("dt1", 512, scene, true);
        dynamicTexture.hasAlpha = true;

        var healthBarTextMaterial = new BABYLON.StandardMaterial("hb3mat", scene);
        healthBarTextMaterial.diffuseTexture = dynamicTexture;
        healthBarTextMaterial.backFaceCulling = false;
        healthBarTextMaterial.diffuseColor = BABYLON.Color3.Black();
        var healthBar = BABYLON.MeshBuilder.CreatePlane("hb1", { width: 20, height: 5, subdivisions: 4 }, scene);
        var healthBarContainer = BABYLON.MeshBuilder.CreatePlane("hb2", { width: 20, height: 5, subdivisions: 4 }, scene);
        var healthBarText = BABYLON.MeshBuilder.CreatePlane("hb3", { width: 20, height: 20, subdivisions: 4 }, scene);

        healthBar.position = new BABYLON.Vector3(0, 0, -.01);			// Move in front of container slightly.  Without this there is flickering.
        healthBarContainer.position = new BABYLON.Vector3(0, 17, 0);     // Position above player.
        healthBarText.position = new BABYLON.Vector3(0, -3.5, -.1);

        healthBar.parent = healthBarContainer;
        healthBarContainer.parent = this.mesh;
        healthBarText.parent = healthBarContainer;
        healthBarContainer.rotation = new BABYLON.Vector3(0, 2, 0);

        this.healthBar = healthBarContainer



        healthBar.material = healthBarMaterial;
        healthBarContainer.material = healthBarContainerMaterial;
        healthBarText.material = healthBarTextMaterial;
    }

    move() {
        if (!this.isattacking) {
            this.mesh.position.y = this.mesh.position.y - 1
            var x = Math.abs(this.mesh.position.x - this.player.mesh.position.x)

            if (this.alert && x <= 60)
                this.moveTowardsPlayer()
            else if (this.mesh.position.y - this.player.mesh.position.y == -1 && x <= 150)
                this.moveTowardsPlayer()
            else {
                if (this.alert) {
                    this.resetPatrolPosition()
                    this.alert = false
                }
                this.patrol()
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
                if(instance.hp>0)
                instance.attack()
            }, 1000)
        }
        else {
            this.mesh.position.x = this.mesh.position.x + (1 * this.speed * 3 * this.direction);
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

        this.animationGroups[15].play()

    }

    checkHit() {
        var pos = this.mesh.position.x + this.width / 2 * this.direction - this.player.mesh.position.x + this.player.width / 2 * this.direction
        if (Math.abs(pos) < 3) {
            this.player.receiveDamage(this.attackdmg)
        }
    }

    attack() {
        var instance = this
        this.animationGroups[10].play()

        setTimeout(() => {
            instance.isattacking = false
            instance.checkHit()
        }, 1000)
    }

}