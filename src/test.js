const { StreamCamera, Codec } = require('@mdebeljuh/pi-camera-connect');
const { createCanvas, loadImage } = require("canvas");
const { RTCVideoSource, RTCVideoSink, rgbaToI420 } = require("wrtc").nonstandard;
const fs = require('fs');

const runApp = async () => {

    const width = 320;
    const height = 240;

  const streamCamera = new StreamCamera({
    width,
    height,
    codec: Codec.MJPEG,
  });

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const videoStream = streamCamera.createStream();


  await streamCamera.startCapture();


return new Promise((resolve) => {
    // We can also listen to data events as they arrive
    videoStream.on('data', data => {

        console.log(data);

        loadImage(data).then((image) => {
            console.log('done')
            console.log(image);
            resolve();
        });
    });
})
  videoStream.on('end', data => console.log('Video stream has ended'));

  // Wait for 5 seconds
  await new Promise(resolve => setTimeout(() => resolve(), 5000));

  await streamCamera.stopCapture();
};

runApp();