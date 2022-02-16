import { GreenScreenStream, GreenScreenMethod, VideoResolution } from 'greenscreenstream';



document.addEventListener("DOMContentLoaded", async () => {

    let customChromaKey = {
        r: 0,
        g: 0,
        b: 0
    }


    const inMediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false })
    const track = inMediaStream.getVideoTracks()[0];

    let instance = new GreenScreenStream(GreenScreenMethod.VirtualBackgroundUsingGreenScreen, VideoResolution.SD);

    await instance.addVideoTrack(track);
    await instance.initialize("../assets/beach.jpg");

    const detectedColor = document.querySelector(".dominates") as HTMLElement;

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
});