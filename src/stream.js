const { RTCVideoSource, RTCVideoSink, rgbaToI420 } = require("wrtc").nonstandard;
const { RTCPeerConnection, RTCSessionDescription, MediaStream } = require("wrtc");

const { createCanvas, loadImage } = require("canvas");
const { StreamCamera, Codec } = require("raspivid-jpeg-stream");
const axios = require("axios");

const stream = new MediaStream();
const peer = createPeer();
const source = new RTCVideoSource();
const track = source.createTrack();

stream.addTrack(track);
peer.addTrack(track, stream);

const sink = new RTCVideoSink(track);

const config = {
  iceServers: [{ 
    urls:[
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302'
    ]
  }]
};

const test = MediaStream;
const peerConnection = new RTCPeerConnection(config);

startStreaming(source);

async function startStreaming(source) {

  const width = 320;
  const height = 240;


  const streamCamera = new StreamCamera({
    codec: Codec.H264,
    width: width,
    height: height
  });

  const videoStream = streamCamera.createStream();

  await videoStream.startCapture();

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  console.log("running!");

  videoStream.on("data", (framet) => {

    console.log(framet);
    
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
        source.onFrame(i420Frame);
        
        resolve();
      
      } catch (error) {
        console.log(error);
        resolve();
      }
    });
  });

}

setTimeout(() => {
  track.stop();
  sink.stop();
}, 10000);

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