class GameConfig{
    constructor(canvas,divFps){
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true);
        this.inputStates = {};
        this.rollingAverage = new BABYLON.RollingAverage(60);
        this.modifySettings();
        this.jumpingstarted = 0;
        this.divFps = divFps;
        this.jumpcounter = 1;
        this.scenes = [];
        this.stats;
        this.statsprev;
    }

    createNewEngine(){
        this.scenes[0].dispose()
        this.engine.dispose()
        this.engine = new BABYLON.Engine(this.canvas, true);
    }
    updateJump(){
        this.jumpingstarted+=this.jumpcounter;
    }

    newStats(walljump=false){
        this.stats = {
            "walljump":walljump,
            "hp":6,
            "weapon":"fists",
        }
        this.statsprev = Object.assign( {}, this.stats );
        
    }


    modifySettings() {

    // key listeners for the player
    this.inputStates.left = false;
    this.inputStates.right = false;
    this.inputStates.up = false;
    this.inputStates.down = false;
    this.inputStates.space = false;
    this.inputStates.attack = false;
    this.inputStates.pause=false;


    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
            this.inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
            this.inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
            this.inputStates.right = true;
        } else if ((event.key === "ArrowDown") || (event.key === "s") || (event.key === "S")) {
            this.inputStates.down = true;
        } else if (event.key === " ") {
            this.inputStates.space = true;
        }
        else if ((event.key === "e") || (event.key === "E")) {
            this.inputStates.attack = true;
        }else if(event.key==='Escape'){
            if(this.inputStates.pause)
            this.inputStates.pause=false;
            else
            this.inputStates.pause=true;      
          }
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
            this.inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {

            this.inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
            this.inputStates.right = false;
        } else if ((event.key === "ArrowDown") || (event.key === "s") || (event.key === "S")) {
            this.inputStates.down = false;
        } else if (event.key === " ") {
            this.jumpingstarted = 30;
            this.inputStates.space = false;
        }
        else if ((event.key === "e") || (event.key === "E")) {
            this.inputStates.attack = false;
        }else if(event.key==='Escape'){
            if(this.inputStates.pause)
            this.inputStates.pause=false;
            else
            this.inputStates.pause=true;
            
        }
    }, false);
}
}