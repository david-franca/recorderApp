document.addEventListener("DOMContentLoaded", () => {
  const display = document.querySelector("#display");
  const record = document.querySelector("#record");
  const micInput = document.querySelector("#mic");

  let isRecording = false;
  let selectDeviceId = null;
  let mediaRecorder = null;
  let chunks = [];

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device) => {
      if (device.kind === "audioinput") {
        if (!selectDeviceId) {
          selectDeviceId = device.deviceId;
        }

        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label;

        micInput.appendChild(option);
      }
    });
  });

  micInput.addEventListener("change", (event) => {
    selectDeviceId = event.target.value;
  });

  function updateButtonTo(recording) {
    if (recording) {
      document.querySelector("#record").classList.add("recording");
      document.querySelector("#mic-icon").classList.add("hide");
    } else {
      document.querySelector("#record").classList.remove("recording");
      document.querySelector("#mic-icon").classList.remove("hide");
    }
  }

  record.addEventListener("click", () => {
    updateButtonTo(!isRecording);
    handleRecord(isRecording);
    isRecording = !isRecording;
  });

  function handleRecord(recording) {
    if (recording) {
      mediaRecorder.stop();
    } else {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: selectDeviceId,
          },
          video: false,
        })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
          };
          mediaRecorder.onstop = (event) => {
            saveData();
          };
        });
    }
  }

  function saveData() {
    const blob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
    console.log("Blob =>", blob);
    chunks = [];
  }
});

window.onload = () => {
  document.body.classList.remove("preLoad");
};
