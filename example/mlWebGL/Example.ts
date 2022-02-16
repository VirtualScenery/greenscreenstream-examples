import { GreenScreenMethod, GreenScreenStream, BodyPixMode, VideoResolution } from "GreenScreenStream";


let greenscreen: GreenScreenStream;

document.addEventListener("DOMContentLoaded", () => {
    registerInputEvents();
    startStream(BodyPixMode.Standard)
});


async function startStream(quality?: BodyPixMode) {

    const track = await getWebcamInStream();

    const bgfile = getBackground();
    greenscreen = new GreenScreenStream(GreenScreenMethod.VirtualBackground, VideoResolution.SD);

    await greenscreen.initialize(`../assets/${bgfile}`, { bodyPixMode: quality });
    await greenscreen.addVideoTrack(track);

    greenscreen.start(30);
    const outStream = greenscreen.captureStream(30); // capture result as a MediaSteam and attacj to video element

    document.querySelector("video").srcObject = outStream;
    document.querySelector(".swap").classList.remove("hide");
    window["_instance"] = greenscreen; // expose for debuging purposes
}


function getBackground(): string {
    return location.hash.length > 0 ? location.hash.replace("#", "") : "beach.jpg";
}


async function getWebcamInStream(): Promise<MediaStreamTrack> {
    const camStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 }, audio: false });
    return camStream.getVideoTracks()[0];
}


function registerInputEvents() {

    //Background change
    document.querySelectorAll(".swap-image").forEach(s => {
        s.addEventListener("click", (e) => {
            const src = (e.target as HTMLElement).dataset.src;
            greenscreen.setBackground(src);
        });
    });
    
    //Quality change
    document.querySelectorAll(".swap-quality").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const mode: number = parseInt( (e.target as HTMLElement).dataset.mode );
            /**
             * 0 = Fast
             * 1 = Standard
             * 2 = Precise
             * 3 = Maximum
             */
            if(mode !== 3)
                return greenscreen.setBodyPixModel({ bodyPixMode: mode });
    
            const bConfirmed = window.confirm(
                `This setting might seriously stress your System. \n
                Loading might take a while.\n Continue?`
            );
    
            if(bConfirmed)
                greenscreen.setBodyPixModel({ bodyPixMode: mode });
        });
    });
}