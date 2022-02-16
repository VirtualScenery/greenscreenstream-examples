import { GreenScreenMethod, GreenScreenStream, VideoResolution } from "greenscreenstream";
import { HOLOGRAM_SHADER } from "./hologram-shader";

document.addEventListener("DOMContentLoaded", async () => {

    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false });
    const track = mediaStream.getVideoTracks()[0];

    let greenscreen = new GreenScreenStream(GreenScreenMethod.VirtualBackground, VideoResolution.SD);
    // override the default shader
    greenscreen.bufferFrag = HOLOGRAM_SHADER;

    await greenscreen.addVideoTrack(track);
    await greenscreen.initialize(`../assets/mars.jpg`)

    greenscreen.start(30);
    
    const outStream = greenscreen.captureStream(30);
    document.querySelector("video").srcObject = outStream;
});