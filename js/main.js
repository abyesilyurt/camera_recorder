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
        player.stopVideo();
        player.playVideo();
        startRecording();
        
    } else {
        stopRecording();
        recordButton.textContent = 'Record';
        playButton.disabled = false;
        downloadButton.disabled = false;
        player.stopVideo();
    }
});

pauseButton.addEventListener('click', () => {
    // resumeRecording();
    mediaRecorder.pause();

    if (pauseButton.textContent === 'Pause') {
        mediaRecorder.pause();
        player.pauseVideo();
        pauseButton.textContent = 'Resume';
    } else {
        mediaRecorder.resume();
        player.playVideo();
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

    player.playVideo();
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

    let recordedVideo = document.querySelector('video#gum');
    recordedVideo.stop();
    player.stopVideo();
});

function handleSourceOpen(event) {
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0 && pauseButton.textContent != 'Resume') {
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

    player.stopVideo();
}


function resumeRecording() {
    mediaRecorder.resume();
    player.playVideo();
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
        handleSuccess();
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

// const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
const constraints = {
    audio: {
        // echoCancellation: { exact: hasEchoCancellation }
        echoCancellation: { exact: true }
    },
    video: {
        height: {max: 320}
    }
};
console.log('Using media constraints:', constraints);
init(constraints);

// Record/Stop Save
// Fit to screen
// Request to rotate





// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '480',
    width: '640',
    videoId: 'AHmF9VF3PjI',
    events: {
      'onReady': onPlayerReady,
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
//   event.target.playVideo();
}
