import "../css/style.css";
import browser from "../assets/images/Crystal_Clear_app_linneighborhood.png";
import * as handTrack from './Modules/handtrackjs';

let root = document.getElementById("root");
let video;
let canvas;
let context;
let isVideo = false;
let model = null;

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
    document.getElementById("video-button").disabled = false
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
    else
    {
        isVideo = false;
        handTrack.stopVideo(video);
    }
};

const startVideo = () => {
    handTrack.startVideo(video).then((status) => {
        if (status)
        {
            isVideo = true;
            runDetection();
        }
        else
        {
            //Error while starting the video;
        }
    });
};

function runDetection() {
    model.detect(video).then(predictions => {
        //console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        // x0, y0, ?width,?heigth 
        if(predictions[0] != undefined && predictions[0].label == "open"){
            if(predictions[0].bbox[0]  < 200 && predictions[0].bbox[1]  > 310 ){
                console.log("Y===>");
                console.log(predictions[0].bbox[1]);
                console.log("VIVES LES CHAMPIGONS 0")
            }else{

            }
        }
        if(predictions[1] != undefined && predictions[1].label == "open"){
            if(predictions[1].bbox[0]  < 200 && predictions[1].bbox[1]  > 310 ){
                console.log("Y===>");
                console.log(predictions[1].bbox[1]);
                console.log("VIVES LES CHAMPIGONS 1")
            }else{

            }
        }
        if(predictions[2] != undefined && predictions[2].label == "open"){
            if(predictions[2].bbox[0]  < 200 ){
                console.log("VIVES LES CHAMPIGONS 2")
            }else{

            }
        }     
        if(predictions[3] != undefined && predictions[3].label == "open"){
            if(predictions[3].bbox[0]  < 200 ){
                console.log("VIVES LES CHAMPIGONS 3")
            }else{

            }
        }
        if(predictions[4] != undefined && predictions[4].label == "open"){
            if(predictions[4].bbox[0]  < 200 ){
                console.log("VIVES LES CHAMPIGONS 4")
            }else{

            }
        }
        if(predictions[5] != undefined && predictions[5].label == "open"){
            if(predictions[5].bbox[0]  < 200 ){
                console.log("VIVES LES CHAMPIGONS 5")
            }else{

            }
        }
        if(predictions[6] != undefined && predictions[6].label == "open"){
            if(predictions[6].bbox[0]  < 200 ){
                console.log("VIVES LES CHAMPIGONS 6")
            }else{

            }
        }

        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

//On lance la caméra
launchWebcamVideo();