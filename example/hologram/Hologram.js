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
const hologram_shader_1 = require("./hologram-shader");
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const mediaStream = yield navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false });
    const track = mediaStream.getVideoTracks()[0];
    let greenscreen = new greenscreenstream_1.GreenScreenStream(greenscreenstream_1.GreenScreenMethod.VirtualBackground, greenscreenstream_1.VideoResolution.SD);
    // override the default shader
    greenscreen.bufferFrag = hologram_shader_1.HOLOGRAM_SHADER;
    yield greenscreen.addVideoTrack(track);
    yield greenscreen.initialize(`../assets/mars.jpg`);
    greenscreen.start(30);
    const outStream = greenscreen.captureStream(30);
    document.querySelector("video").srcObject = outStream;
}));
