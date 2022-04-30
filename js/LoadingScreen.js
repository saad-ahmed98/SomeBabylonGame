BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    this._loadingDiv = document.createElement("div");

    this._loadingDiv.id = "babylonjsLoadingDiv";
    this._loadingDiv.style.opacity = "0";
    this._loadingDiv.style.transition = "opacity 1.5s ease";
    this._loadingDiv.style.pointerEvents = "none";
    this._loadingDiv.style.display = "grid";
    this._loadingDiv.style.gridTemplateRows = "100%";
    this._loadingDiv.style.gridTemplateColumns = "100%";
    this._loadingDiv.style.justifyItems = "center";
    this._loadingDiv.style.alignItems = "center";

    // Loading text
    this._loadingTextDiv = document.createElement("div");
    this._loadingTextDiv.style.position = "absolute";
    this._loadingTextDiv.style.left = "0";
    this._loadingTextDiv.style.top = "70%";
    this._loadingTextDiv.style.marginTop = "80px";
    this._loadingTextDiv.style.width = "100%";
    this._loadingTextDiv.style.height = "20px";
    this._loadingTextDiv.style.fontFamily = "Arial";
    this._loadingTextDiv.style.fontSize = "14px";
    this._loadingTextDiv.style.color = "white";
    this._loadingTextDiv.style.textAlign = "center";
    this._loadingTextDiv.style.zIndex = "1";
    this._loadingTextDiv.innerHTML = "Loading";

    this._loadingDiv.appendChild(this._loadingTextDiv);

    //set the predefined text
    this._loadingTextDiv.innerHTML = this._loadingText;

    // Generating keyframes
    this._style = document.createElement("style");
    this._style.type = "text/css";
    const keyFrames = `@-webkit-keyframes spin1 {\
                0% { -webkit-transform: rotate(0deg);}
                100% { -webkit-transform: rotate(360deg);}
            }\
            @keyframes spin1 {\
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
            }`;
    this._style.innerHTML = keyFrames;
    document.getElementsByTagName("head")[0].appendChild(this._style);

    
    // Loading img
    if(imageLoading!=""){
    const imgBack = new Image();
    if (!BABYLON.DefaultLoadingScreen.prototype.DefaultLogoUrl) {
        imgBack.src = imageLoading
    } else {
        imgBack.src = BABYLON.DefaultLoadingScreen.prototype.DefaultLogoUrl;
    }

    imgBack.style.width = "800px";
    imgBack.style.gridColumn = "1";
    imgBack.style.gridRow = "1";
    imgBack.style.top = "40%";
    imgBack.style.left = "50%";
    imgBack.style.transform = "translate(-50%, -50%)";
    imgBack.style.position = "absolute";
    this._loadingDiv.appendChild(imgBack);

    const titleLoad = new Image();
    if (!BABYLON.DefaultLoadingScreen.prototype.DefaultLogoUrl) {
        titleLoad.src = titleLoading
    } else {
        titleLoad.src = BABYLON.DefaultLoadingScreen.prototype.DefaultLogoUrl;
    }
    titleLoad.style.width = "700px";
    titleLoad.style.gridColumn = "1";
    titleLoad.style.gridRow = "1";
    titleLoad.style.top = "10%";
    titleLoad.style.left = "50%";
    titleLoad.style.transform = "translate(-50%, -50%)";
    titleLoad.style.position = "absolute";
    this._loadingDiv.appendChild(titleLoad);
}

    const imgLoad = new Image();
    if (!BABYLON.DefaultLoadingScreen.prototype.DefaultLogoUrl) {
        imgLoad.src = "images/common/loadingbartxt.png"
    } else {
        imgLoad.src = BABYLON.DefaultLoadingScreen.prototype.DefaultLogoUrl;
    }

    imgLoad.style.width = "200px";
    imgLoad.style.gridColumn = "1";
    imgLoad.style.gridRow = "1";
    imgLoad.style.top = "70%";
    imgLoad.style.left = "50%";
    imgLoad.style.transform = "translate(-50%, -50%)";
    imgLoad.style.position = "absolute";
    this._loadingDiv.appendChild(imgLoad);

    this._resizeLoadingUI();

    window.addEventListener("resize", this._resizeLoadingUI);

    this._loadingDiv.style.backgroundColor = this._loadingDivBackgroundColor;
    document.body.appendChild(this._loadingDiv);

    this._loadingDiv.style.opacity = "1";
};



BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function(){
    if (!this._loadingDiv) {
        return;
    }

    const onTransitionEnd = () => {
        if (this._loadingDiv) {
            if (this._loadingDiv.parentElement) {
                this._loadingDiv.parentElement.removeChild(this._loadingDiv);
            }
            this._loadingDiv = null;
        }
        if (this._style) {
            if (this._style.parentElement) {
                this._style.parentElement.removeChild(this._style);
            }
            this._style = null;
        }
        window.removeEventListener("resize", this._resizeLoadingUI);
    };

    this._loadingDiv.style.opacity = "0";
    this._loadingDiv.addEventListener("transitionend", onTransitionEnd);
}