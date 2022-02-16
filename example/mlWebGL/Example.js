"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GreenScreenStream_1 = require("GreenScreenStream");
let greenscreen;
document.addEventListener("DOMContentLoaded", () => {
    registerInputEvents();
    startStream(GreenScreenStream_1.BodyPixMode.Standard);
});
function startStream(quality) {
    return __awaiter(this, void 0, void 0, function* () {
        const track = yield getWebcamInStream();
        const bgfile = getBackground();
        greenscreen = new GreenScreenStream_1.GreenScreenStream(GreenScreenStream_1.GreenScreenMethod.VirtualBackground, GreenScreenStream_1.VideoResolution.SD);
        yield greenscreen.initialize(`../assets/${bgfile}`, { bodyPixMode: quality });
        yield greenscreen.addVideoTrack(track);
        greenscreen.start(30);
        const outStream = greenscreen.captureStream(30); // capture result as a MediaSteam and attacj to video element
        document.querySelector("video").srcObject = outStream;
        document.querySelector(".swap").classList.remove("hide");
        window["_instance"] = greenscreen; // expose for debuging purposes
    });
}
function getBackground() {
    return location.hash.length > 0 ? location.hash.replace("#", "") : "beach.jpg";
}
function getWebcamInStream() {
    return __awaiter(this, void 0, void 0, function* () {
        const camStream = yield navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false });
        return camStream.getVideoTracks()[0];
    });
}
function registerInputEvents() {
    //Background change
    document.querySelectorAll(".swap-image").forEach(s => {
        s.addEventListener("click", (e) => {
            const src = e.target.dataset.src;
            greenscreen.setBackground(src);
        });
    });
    //Quality change
    document.querySelectorAll(".swap-quality").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const mode = parseInt(e.target.dataset.mode);
            /**
             * 0 = Fast
             * 1 = Standard
             * 2 = Precise
             * 3 = Maximum
             */
            if (mode !== 3)
                return greenscreen.setBodyPixModel({ bodyPixMode: mode });
            const bConfirmed = window.confirm(`This setting might seriously stress your System. \n
                Loading might take a while.\n Continue?`);
            if (bConfirmed)
                greenscreen.setBodyPixModel({ bodyPixMode: mode });
        });
    });
}
