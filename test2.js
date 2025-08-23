// extract-frames.js
// Extract frames from Raspberry Pi camera MJPEG stream using functions only.

const fs = require("fs");
const { StreamCamera, Codec } = require("pi-camera-connect");

let buffer = Buffer.alloc(0);

const SOI = Buffer.from([0xff, 0xd8]); // Start of Image
const EOI = Buffer.from([0xff, 0xd9]); // End of Image

function handleChunk(chunk) {

  buffer = Buffer.concat([buffer, chunk]);

  let start = buffer.indexOf(SOI);
  let end = start !== -1 ? buffer.indexOf(EOI, start + 2) : -1;

  while (start !== -1 && end !== -1) {
    const jpeg = buffer.slice(start, end + 2);
    
    // SAVE FRAME

    buffer = buffer.slice(end + 2);

    start = buffer.indexOf(SOI);
    end = start !== -1 ? buffer.indexOf(EOI, start + 2) : -1;
  }
}



async function startCapture() {

  const camera = new StreamCamera({
    codec: Codec.MJPEG,
    width: 640,
    height: 480,
    fps: 10,
  });

  const stream = camera.createStream();
  stream.on("data", handleChunk);

  console.log("📸 Capturing frames... Press Ctrl+C to stop.");
  await camera.startCapture();
}

startCapture().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});