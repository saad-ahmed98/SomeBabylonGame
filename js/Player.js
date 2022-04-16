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
        if(this.gameconfig.stats["weapon"]=="sword")
        this.swordmesh.setEnabled(true)
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
        healthBarContainer.position = new BABYLON.Vector3(10, 17, 0);     // Position above player.
        healthBarText.position = new BABYLON.Vector3(0, -3.5, -.1);

        healthBar.parent = healthBarContainer;
        healthBarContainer.parent = this.mesh;
        healthBarText.parent = healthBarContainer;
        healthBarContainer.rotation = new BABYLON.Vector3(0, 2, 0);

        this.healthBar = healthBarContainer
        this.healthBar.lookAt(new BABYLON.Vector3(10000000 * -this.lookAt, 0, 0));




        healthBar.material = healthBarMaterial;
        healthBarContainer.material = healthBarContainerMaterial;
        healthBarText.material = healthBarTextMaterial;
    }

    updateHpBar() {
        var healthBar = this.healthBar.getChildren()[0]
        var healthBarText = this.healthBar.getChildren()[1]
        if (this.hp <= 0) {
            this.hp = 0;
        }

        if (this.hp >= 0) {
            healthBar.scaling.x = this.hp / this.gameconfig.stats["hp"];
            healthBar.position.x = (1 - (this.hp / this.gameconfig.stats["hp"])) * -1;

            if (healthBar.scaling.x < .3) {
                healthBar.material.diffuseColor = BABYLON.Color3.Red();
            }
            else if (healthBar.scaling.x < .5) {
                healthBar.material.diffuseColor = BABYLON.Color3.Yellow();
            }

            var textureContext = healthBarText.material.diffuseTexture.getContext();
            var size = healthBarText.material.diffuseTexture.getSize();
            var text = this.hp + "/" + this.gameconfig.stats["hp"];
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
            followCamera.rotationOffset = 90

            }
            this.mesh.lookAt(new BABYLON.Vector3(10000000*this.lookAt, 0, 0));
            this.healthBar.lookAt(new BABYLON.Vector3(10000000 * -this.lookAt, 0, 0));
            this.healthBar.position = new BABYLON.Vector3(10, 17, 0); 

            if(this.isattacking)
                followCamera.rotationOffset = 90*this.lookAt

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
            this.healthBar.lookAt(new BABYLON.Vector3(10000000 * -this.lookAt, 0, 0));
            this.healthBar.position = new BABYLON.Vector3(-10, 17, 0); 


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
        this.updateHpBar()
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
            this.healthBar.lookAt(new BABYLON.Vector3(10000000, 0, 0));
            this.healthBar.position = new BABYLON.Vector3(-10, 17, 0); 

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
                this.healthBar.lookAt(new BABYLON.Vector3(-10000000, 0, 0));
                this.healthBar.position = new BABYLON.Vector3(10, 17, 0); 


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