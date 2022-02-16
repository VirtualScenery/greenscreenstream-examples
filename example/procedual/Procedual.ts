import { GreenScreenStream, GreenScreenMethod, VideoResolution } from "GreenScreenStream";
import { FRACTAL } from "./fractal";

document.addEventListener("DOMContentLoaded", async () => {

  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false })
  const track = mediaStream.getVideoTracks()[0];
  const cap = { w: track.getCapabilities().width as number, h: track.getConstraints().height as number };
  
  
  
  let greenscreen = new GreenScreenStream(GreenScreenMethod.VirtualBackground, VideoResolution.SD);
  window["__instance"] = greenscreen;
  
  // override the default shader
  greenscreen.bufferFrag = FRACTAL;

  
  await greenscreen.addVideoTrack(track);
  await greenscreen.initialize(`../assets/iChannel0.png`);

  greenscreen.start(60);

  const ms = greenscreen.captureStream(60);
  document.querySelector("video").srcObject = ms;
  
});