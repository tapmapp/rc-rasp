const RaspividJpegStream = require("raspivid-jpeg-stream");

function startStreaming() {

  const width = 320;
  const height = 240;

  const camera = new RaspividJpegStream({
    'width': 640,
    'height': 480,
    'timeout': 0,
    'framerate': 24
  });

  camera.on("data", (framet) => {

    console.log(framet);

  });

}

startStreaming();