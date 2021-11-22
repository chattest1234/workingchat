const myId = Math.floor(Math.random() * 100);
const socket = io("https://guarded-river-30617.herokuapp.com");

socket.on("audio-input", ({ id, buffer }) => {
  var blob = new Blob([buffer], { type: "audio/ogg; codecs=opus" });
  var audio = document.createElement("audio");
  audio.src = window.URL.createObjectURL(blob);
  audio.play();
});

console.log(window.navigator.getUserMedia);

socket.on("connect_error", (err) => {
  console.log(err);
});
function startStream() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const recorder = new MediaRecorder(stream);

      recorder.onstart = () => {
        this.chunks = [];
      };

      recorder.ondataavailable = (e) => {
        this.chunks.push(e.data);
      };

      recorder.onstop = (e) => {
        var blob = new Blob(this.chunks, {
          type: "audio/ogg; codecs=opus",
        });
        socket.emit("stream", { id: myId, data: blob });
      };

      document.querySelector("button").addEventListener("mousedown", () => {
        recorder.start();
      });
      document.querySelector("button").addEventListener("mouseup", () => {
        recorder.stop();
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
startStream();
