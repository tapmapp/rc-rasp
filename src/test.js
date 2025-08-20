const RaspividJpegStream = require("raspivid-jpeg-stream");

function startStreaming() {

  const width = 320;
  const height = 240;

  const camera = new RaspividJpegStream({
    width: width,
    height: height,
    timeout: 0,
    framerate: 24,
    bitrate: 25000000,
  });

  camera.on("data", (framet) => {

    console.log(framet);

  });

}

startStreaming();