import "../css/style.css";
import browser from "../assets/images/Crystal_Clear_app_linneighborhood.png";
import * as handTrack from 'handtrackjs';

let root = document.getElementById("root");
let updateNote = document.getElementById("updatenote");
let video;
let canvas;
let context;
let isVideo = false;
let model = null;

// https://victordibia.com/handtrack.js/#/

const defaultParams = {
    flipHorizontal: false,
    outputStride: 16,
    imageScaleFactor: 1,
    maxNumBoxes: 20,
    iouThreshold: 0.2,
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "large",
    bboxLineWidth: "2",
    fontSize: 17,
};

// Load the model.
handTrack.load(defaultParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel;
    updateNote.innerText = "Loaded Model!"
    document.getElementById("video-button").disabled = false
});

let h1 = document.createElement("h1");
h1.textContent = "Hello World";
root.appendChild(h1);

let img = document.createElement("img");
img.src = browser;
root.appendChild(img);

document.getElementById("video-button").addEventListener("click",()=>{
    launchWebcamVideo();
});

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
            updateNote.innerText = "Video started. Now tracking";
            isVideo = true;
            runDetection();
        }
        else
        {
            updateNote.innerText = "Error while starting the video";
        }
    });
};

function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}