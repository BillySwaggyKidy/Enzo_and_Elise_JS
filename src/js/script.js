import "../css/style.css";
import browser from "../assets/images/Crystal_Clear_app_linneighborhood.png";

let root = document.getElementById("root");

let h1 = document.createElement("h1");
h1.textContent = "Hello World";
root.appendChild(h1);

let img = document.createElement("img");
img.src = browser;
root.appendChild(img);

console.log("test");

