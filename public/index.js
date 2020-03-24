/**
 * Mozilla documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element
 */

const preview = document.getElementById("preview");
const startButton = document.getElementById("startBtn");
const stopButton = document.getElementById("stopBtn");
const downloadButton = document.getElementById("downloadBtn");
const recording = document.getElementById("recording");
let recorder;

function startRecording(stream) {
  const data = [];
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = event => data.push(event.data);
  recorder.start();

  const stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = event => reject(event.name);
  });

  return stopped.then(() => data);
}

function stop(stream) {
  recorder.stop();
  stream.getTracks().forEach(track => track.stop());
}

function today() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${month}_${day}_${year}`;
}

startButton.addEventListener(
  "click",
  function() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then(stream => {
        preview.srcObject = stream;
        downloadButton.href = stream;
        preview.captureStream = preview.captureStream || preview.mozCaptureStream;

        return new Promise(resolve => (preview.onplaying = resolve));
      })
      .then(() => startRecording(preview.captureStream()))
      .then(recordedChunks => {
        const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });

        recording.src = URL.createObjectURL(recordedBlob);
        downloadButton.href = recording.src;
        downloadButton.download = `RecordedVideo_${today()}.webm`;

        alert("Successfully recorded. Click on the download button ");
      })
      .catch(() => alert("Error while recording.. Please, try again!"));
  },
  false
);

stopButton.addEventListener(
  "click",
  function() {
    stop(preview.srcObject);
    downloadButton.disabled = false;
  },
  false
);

downloadButton.addEventListener("click", function() {
  const { href, download } = this;
  if (!href || !download) {
    alert("There is nothing to download. Please capture your screen first.");
  }
});
