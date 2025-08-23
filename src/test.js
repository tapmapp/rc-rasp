const { StreamCamera, Codec } = require('@mdebeljuh/pi-camera-connect');
const { createCanvas, loadImage } = require("canvas");
const { RTCVideoSource, RTCVideoSink, rgbaToI420 } = require("wrtc").nonstandard;
const { fs } = require('fs');

const runApp = async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.H264,
  });

  const videoStream = streamCamera.createStream();

  const writeStream = fs.createWriteStream('video-stream.h264');

  // Pipe the video stream to our video file
  videoStream.pipe(writeStream);

  await streamCamera.startCapture();

  // We can also listen to data events as they arrive
  videoStream.on('data', data => {
    loadImage(framet).then((image) => {
        context.drawImage(image, 0, 0, width, height);

        try {
          const rgbaFrame = context.getImageData(0, 0, width, height);
          const i420Frame = {
            width,
            height,
            data: new Uint8ClampedArray(1.5 * width * height),
          };
          rgbaToI420(rgbaFrame, i420Frame);
        //   source.onFrame(i420Frame);
          
        } catch (error) {
          console.log(error);
        }
      });
  });
  videoStream.on('end', data => console.log('Video stream has ended'));

  // Wait for 5 seconds
  await new Promise(resolve => setTimeout(() => resolve(), 5000));

  await streamCamera.stopCapture();
};

runApp();