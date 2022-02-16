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
const greenscreenstream_1 = require("greenscreenstream");
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    let customChromaKey = {
        r: 0,
        g: 0,
        b: 0
    };
    const inMediaStream = yield navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false });
    const track = inMediaStream.getVideoTracks()[0];
    let instance = new greenscreenstream_1.GreenScreenStream(greenscreenstream_1.GreenScreenMethod.VirtualBackgroundUsingGreenScreen, greenscreenstream_1.VideoResolution.SD);
    yield instance.addVideoTrack(track);
    yield instance.initialize("../assets/beach.jpg");
    const detectedColor = document.querySelector(".dominates");
    detectedColor.addEventListener("click", () => {
        instance.setChromaKey(customChromaKey.r, customChromaKey.g, customChromaKey.b);
    });
    // detect color 2 / second
    setInterval(() => {
        let colors = instance.getColorsFromStream();
        let d = colors.dominant;
        //let p = colors.palette; // not displayed
        const s = `rgb(${d[0]},${d[1]},${d[2]}`;
        detectedColor.style.background = s;
        customChromaKey.r = d[0] / 255;
        customChromaKey.g = d[1] / 255;
        customChromaKey.b = d[2] / 255;
    }, 1000 * 2);
    instance.start(25);
    document.querySelector("video").srcObject = instance.captureStream(25);
    detectedColor.addEventListener("click", () => instance.setChromaKey(customChromaKey.r, customChromaKey.g, customChromaKey.b));
}));
