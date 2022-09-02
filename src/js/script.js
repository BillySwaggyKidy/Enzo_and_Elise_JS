import "../css/style.css";
import browser from "../assets/images/Crystal_Clear_app_linneighborhood.png";
import * as handTrack from './Modules/handtrackjs';

let root = document.getElementById("root");
let video;
let canvas;
let context;
let isVideo = false;
let model = null;
//Une zone de jeu
let xZone = 120;
let yZone = 100;
//Debut
let xStart = 0;
let yStart = 250;
//Ecarts
let spaceSamePlayer = 10;
let spaceDifPlayer = 140;
//Détection de différences (catch)
let moveZero = new Object();
let moveOne = new Object();
let moveTwo = new Object();
let moveTree = new Object();
let moveFour = new Object();
let moveFive = new Object();

//Initialisations des mouvements
moveZero.first = "";
moveZero.second = "";

moveOne.first = "";
moveOne.second = "";

moveTwo.first = "";
moveTwo.second = "";

moveTree.first = "";
moveTree.second = "";

moveFour.first = "";
moveFour.second = "";

moveFive.first = "";
moveFive.second = "";


// https://victordibia.com/handtrack.js/#/
// document.getElementById("Canvas").addEventListener("click", ()=>{
// handTrack.stopVideo
// });
const defaultParams = {
    flipHorizontal: true,
    outputStride: 16,
    imageScaleFactor: 2,
    maxNumBoxes: 20,
    iouThreshold: 0.2,
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "large",
    bboxLineWidth: "1",
    fontSize: 17,
};

// Load the model.
handTrack.load(defaultParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel;
    document.getElementById("video-button").disabled = false;
});

let h1 = document.createElement("h1");
h1.textContent = "Hello World";
root.appendChild(h1);

let img = document.createElement("img");
img.src = browser;
root.appendChild(img);

const launchWebcamVideo = () => {
    root.innerHTML = "";
    if (!isVideo) {
        let newVideo = document.createElement("video");
        newVideo.id = "myvideo";
        let newCanvas = document.createElement("canvas");
        newCanvas.id = "canvas";
        root.appendChild(newVideo);
        root.appendChild(newCanvas);
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        video = document.getElementById("myvideo");
        startVideo();


    }
    else {
        isVideo = false;
        handTrack.stopVideo(video);
    }
};

const startVideo = () => {
    handTrack.startVideo(video).then((status) => {
        if (status) {
            isVideo = true;
            runDetection();
        }
        else {
            //Error while starting the video;
        }
    });
};

function runDetection() {
    model.detect(video).then(predictions => {
        //console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        //On dessines les zones de sélection
        //#Joueur gauche
        //Main gauche
//TODO Essayer de sortir la construction des zones jeu de la detection.
//TODO Voir la récurence d'appel
        model.roundRect(
            context,
            xStart,
            yStart,
            xZone,
            yZone,
            5,
            false,
            true
        );
        //Main droite
        model.roundRect(
            context,
            xStart + xZone + spaceSamePlayer,
            yStart,
            xZone,
            yZone,
            5,
            false,
            true
        );
        //#Joueur droit
        //Main gauche
        model.roundRect(
            context,
            xStart + (xZone * 2) + spaceSamePlayer + spaceDifPlayer,
            yStart,
            xZone,
            yZone,
            5,
            false,
            true
        );
        //Main droite
        model.roundRect(
            context,
            xStart + (xZone * 3) + (spaceSamePlayer * 2) + spaceDifPlayer,
            yStart,
            xZone,
            yZone,
            5,
            false,
            true
        );
        // x0, y0, ?width,?heigth 
        if (predictions[0] != undefined) {
            let x = predictions[0].bbox[0];
            let y = predictions[0].bbox[1];
            let label = predictions[0].label;
            //TODO Detection des autres zones
            if (x > xStart && x < xZone+1 && y > yStart && y < yStart + yZone) {
                filePopulator(moveZero, label, 1 );
            }else if( x > xZone + spaceSamePlayer && x < ((xZone*2) + spaceSamePlayer) +1 && y > yStart && y < yStart + yZone){
                filePopulator(moveZero, label, 2);
            }else if( x > (xZone*2) + spaceSamePlayer + spaceDifPlayer && x < ((xZone*3) + spaceSamePlayer + spaceDifPlayer)+1 && y > yStart && y < yStart + yZone){
                filePopulator(moveZero, label, 3);
            }else if( x > (xZone*3) + (spaceSamePlayer*2) + spaceDifPlayer && y > yStart && y < yStart + yZone){
                filePopulator(moveZero, label, 4);
            }
              
        } else {
            filePopulator(moveZero, undefined);
        }

        if (predictions[1] != undefined) {
            let x = predictions[1].bbox[0];
            let y = predictions[1].bbox[1];
            let label = predictions[1].label;
            if (x > xStart && x < xZone+1 && y > yStart && y < yStart + yZone) {
                filePopulator(moveOne, label, 1 );
            }else if( x > xZone + spaceSamePlayer && x < ((xZone*2) + spaceSamePlayer) +1 && y > yStart && y < yStart + yZone){
                filePopulator(moveOne, label, 2);
            }else if( x > (xZone*2) + spaceSamePlayer + spaceDifPlayer && x < ((xZone*3) + spaceSamePlayer + spaceDifPlayer)+1 && y > yStart && y < yStart + yZone){
                filePopulator(moveOne, label, 3);
            }else if( x > (xZone*3) + (spaceSamePlayer*2) + spaceDifPlayer && y > yStart && y < yStart + yZone){
                filePopulator(moveOne, label, 4);
            }
        }else{
            filePopulator(moveOne, undefined);
        }
        if (predictions[2] != undefined && predictions[2].label == "open") {
            let x = predictions[2].bbox[0];
            let y = predictions[2].bbox[1];
            let label = predictions[2].label;
            if (x > xStart && x < xZone+1 && y > yStart && y < yStart + yZone) {
                filePopulator(moveTwo, label, 1 );
            }else if( x > xZone + spaceSamePlayer && x < ((xZone*2) + spaceSamePlayer) +1 && y > yStart && y < yStart + yZone){
                filePopulator(moveTwo, label, 2);
            }else if( x > (xZone*2) + spaceSamePlayer + spaceDifPlayer && x < ((xZone*3) + spaceSamePlayer + spaceDifPlayer)+1 && y > yStart && y < yStart + yZone){
                filePopulator(moveTwo, label, 3);
            }else if( x > (xZone*3) + (spaceSamePlayer*2) + spaceDifPlayer && y > yStart && y < yStart + yZone){
                filePopulator(moveTwo, label, 4);
            }
        }else{
            filePopulator(moveTwo, undefined);
        }
        
        if (predictions[3] != undefined && predictions[3].label == "open") {
            let x = predictions[3].bbox[0];
            let y = predictions[3].bbox[1];
            let label = predictions[3].label;
            if (x > xStart && x < xZone+1 && y > yStart && y < yStart + yZone) {
                filePopulator(moveTree, label, 1 );
            }else if( x > xZone + spaceSamePlayer && x < ((xZone*2) + spaceSamePlayer) +1 && y > yStart && y < yStart + yZone){
                filePopulator(moveTree, label, 2);
            }else if( x > (xZone*2) + spaceSamePlayer + spaceDifPlayer && x < ((xZone*3) + spaceSamePlayer + spaceDifPlayer)+1 && y > yStart && y < yStart + yZone){
                filePopulator(moveTree, label, 3);
            }else if( x > (xZone*3) + (spaceSamePlayer*2) + spaceDifPlayer && y > yStart && y < yStart + yZone){
                filePopulator(moveTree, label, 4);
            }
        }else{
            filePopulator(moveTree, undefined);
        }
        if (predictions[4] != undefined && predictions[4].label == "open") {
            let x = predictions[4].bbox[0];
            let y = predictions[4].bbox[1];
            let label = predictions[4].label;
            if (x > xStart && x < xZone+1 && y > yStart && y < yStart + yZone) {
                filePopulator(moveFour, label, 1 );
            }else if( x > xZone + spaceSamePlayer && x < ((xZone*2) + spaceSamePlayer) +1 && y > yStart && y < yStart + yZone){
                filePopulator(moveFour, label, 2);
            }else if( x > (xZone*2) + spaceSamePlayer + spaceDifPlayer && x < ((xZone*3) + spaceSamePlayer + spaceDifPlayer)+1 && y > yStart && y < yStart + yZone){
                filePopulator(moveFour, label, 3);
            }else if( x > (xZone*3) + (spaceSamePlayer*2) + spaceDifPlayer && y > yStart && y < yStart + yZone){
                filePopulator(moveFour, label, 4);
            }
        }else{
            filePopulator(moveFour, undefined);
        }
        if (predictions[5] != undefined && predictions[5].label == "open") {
            let x = predictions[5].bbox[0];
            let y = predictions[5].bbox[1];
            let label = predictions[5].label;
            if (x > xStart && x < xZone+1 && y > yStart && y < yStart + yZone) {
                filePopulator(moveFive, label, 1 );
            }else if( x > xZone + spaceSamePlayer && x < ((xZone*2) + spaceSamePlayer) +1 && y > yStart && y < yStart + yZone){
                filePopulator(moveFive, label, 2);
            }else if( x > (xZone*2) + spaceSamePlayer + spaceDifPlayer && x < ((xZone*3) + spaceSamePlayer + spaceDifPlayer)+1 && y > yStart && y < yStart + yZone){
                filePopulator(moveFive, label, 3);
            }else if( x > (xZone*3) + (spaceSamePlayer*2) + spaceDifPlayer && y > yStart && y < yStart + yZone){
                filePopulator(moveFive, label, 4);
            }
        }else{
            filePopulator(moveFive, undefined);
        }

        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

/**
 * @Param move -> Objet de l'historique de mouvement de la prédiction en question.
 * @Param label ->Label associé à la prédiction.
 **/
const filePopulator = (move, label, zone) => {
    //On est en dehors de la zone 
    if(label == undefined){
        //On vide la liste d'attente
        move.first = "";
        move.second = "";
        return;
    }
      //On set les listes d'attente de la prédiction 1.
      if(move.first != ""){
        move.second = label == "closed"? label : "";
    }else{
        move.first = label == "open" || label == "point"? label : "";
    }
    //On vérifie si il y a eut un catch
    if(move.first != "" && move.second != ""){
        console.log("CATCH DETECTED ZONE "+ zone);
        move.first = "";
        move.second = "";
    }
};
//On lance la caméra
launchWebcamVideo();
