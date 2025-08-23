const { StreamCamera, Codec } = require('@mdebeljuh/pi-camera-connect');
const jpeg = require('jpeg-js');
const axios = require('axios');

const { RTCVideoSource, rgbaToI420 } = require("wrtc").nonstandard;
const { RTCPeerConnection, RTCSessionDescription, MediaStream } = require("wrtc");

let buffer = Buffer.alloc(0);

const SOI = Buffer.from([0xff, 0xd8]); // Start of Image
const EOI = Buffer.from([0xff, 0xd9]); // End of Image

const stream = new MediaStream();
//const peer = createPeer();
const source = new RTCVideoSource();
const track = source.createTrack();

stream.addTrack(track);
//peer.addTrack(track, stream);

const WIDTH = 640;
const HEIGHT = 480;
const FPS = 24;

const streamCamera = new StreamCamera({
  codec: Codec.MJPEG,
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
});

// ---------- Frame pipeline ----------
function jpegToRgba(jpegBuffer) {
  // jpeg-js returns { width, height, data } where data is RGBA (Uint8Array length = w*h*4)
  const { width, height, data } = jpeg.decode(jpegBuffer, { useTArray: true });
  return { width, height, data };
}

function rgbaToI420Frame(rgbaFrame) {
  const { width, height, data } = rgbaFrame;
  // Allocate I420 buffer: Y (w*h) + U (w*h/4) + V (w*h/4) = 1.5 * w*h bytes
  const i420ByteLen = Math.floor(width * height * 1.5);
  const i420Data = new Uint8ClampedArray(i420ByteLen);

  // wrtc.nonstandard.rgbaToI420 expects { width, height, data } for both src/dst
  rgbaToI420(
    { width, height, data: data },          // RGBA source
    { width, height, data: i420Data }       // I420 destination
  );

  return { width, height, data: i420Data };
}

async function main() {

  const mjpegStream = streamCamera.createStream();
  await streamCamera.startCapture();

  mjpegStream.on('data', (jpegBuffer) => {

    handleChunk(jpegBuffer);

    // try {

    //   // 1) JPEG -> RGBA
    //   const rgbaFrame = jpegToRgba(jpegBuffer);

    //   // 2) RGBA -> I420
    //   const i420Frame = rgbaToI420Frame(rgbaFrame);

    //   // i420Frame.data
    //   source.onFrame(i420Frame);

    // } catch (err) {
    //   console.error('Frame processing error:', err);
    // }
  });

  mjpegStream.on('error', (err) => {
    console.error('Stream error:', err);
  });

  console.log(`Capture started: ${WIDTH}x${HEIGHT} @ ${FPS}fps (MJPEG)`);

}

function handleChunk(chunk) {

  buffer = Buffer.concat([buffer, chunk]);

  let start = buffer.indexOf(SOI);
  let end = start !== -1 ? buffer.indexOf(EOI, start + 2) : -1;

  while (start !== -1 && end !== -1) {
    const jpeg = buffer.slice(start, end + 2);
    const rgbaFrame = jpegToRgba(jpeg);
    // SAVE FRAME

    buffer = buffer.slice(end + 2);

    start = buffer.indexOf(SOI);
    end = start !== -1 ? buffer.indexOf(EOI, start + 2) : -1;
  }
}

main();

function createPeer() {

  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });

  peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
  return peer;

}

async function handleNegotiationNeededEvent(peer) {

  const offer = await peer.createOffer();
  
  await peer.setLocalDescription(offer);
  
  const payload = {
    sdp: peer.localDescription,
  };

  const { data } = await axios.post("http://192.168.1.128:5000/broadcast", payload);
  const desc = new RTCSessionDescription(data.sdp);
  peer.setRemoteDescription(desc).catch((e) => console.log(e));

}