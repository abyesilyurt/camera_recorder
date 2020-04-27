'use strict';

const mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
let mediaRecorder;
let recordedBlobs;
let sourceBuffer;


// Setup buttons
const errorMsgElement = document.querySelector('span#errorMsg');
// const recordedVideo = document.querySelector('video#recorded');

const recordButton = document.querySelector('button#record');
const pauseButton = document.querySelector('button#pause');
// const resumeButton = document.querySelector('button#resume');

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Record') {
        startRecording();
    } else {
        stopRecording();
        recordButton.textContent = 'Record';
        playButton.disabled = false;
        downloadButton.disabled = false;
    }
});

// resumeButton.addEventListener('click', () => {
//     // resumeRecording();
//     mediaRecorder.resume();
// });

pauseButton.addEventListener('click', () => {
    // resumeRecording();
    mediaRecorder.pause();

    if (pauseButton.textContent === 'Pause') {
        mediaRecorder.pause();
        pauseButton.textContent = 'Resume';
    } else {
        mediaRecorder.resume();
        pauseButton.textContent = 'Pause';
        // playButton.disabled = false;
    }
});


const playButton = document.querySelector('button#play');
playButton.addEventListener('click', () => {
    const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
    let recordedVideo = document.querySelector('video#gum');
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
});

const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
});

function handleSourceOpen(event) {
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function startRecording() {
    handleSuccess();

    recordedBlobs = [];
    let options = { mimeType: 'video/webm' };
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
        return;
    }

    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop';
    playButton.disabled = true;
    downloadButton.disabled = true;
    pauseButton.disabled = false;
    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
    mediaRecorder.stop();
}


function resumeRecording() {
    mediaRecorder.resume();
}


function handleSuccess() {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    const gumVideo = document.querySelector('video#gum');
    gumVideo.srcObject = stream;
}

let stream;
async function init(constraints) {
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        // handleSuccess(stream);
        let elem = document.documentElement; 
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
          } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
          }
        handleSuccess();
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

// document.querySelector('button#start').addEventListener('click', async () => {
//     const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
//     const constraints = {
//         audio: {
//             echoCancellation: { exact: hasEchoCancellation }
//         },
//         video: {
//             width: 1280, height: 720
//         }
//     };
//     console.log('Using media constraints:', constraints);
//     await init(constraints);
// });


// const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
const constraints = {
    audio: {
        // echoCancellation: { exact: hasEchoCancellation }
        echoCancellation: { exact: true }
    },
    video: {
        width: 1280, height: 720
    }
};
console.log('Using media constraints:', constraints);
init(constraints);

// Record/Stop Save
// Fit to screen
// Request to rotate