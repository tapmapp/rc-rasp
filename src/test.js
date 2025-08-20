const { StreamCamera, Codec, Flip, SensorMode } = require('pi-camera-connect');

function startStreaming() {

    console.log('running!');

    const streamCamera = new StreamCamera({
        codec: Codec.MJPEG,
        flip: Flip.Vertical,
        sensorMode: SensorMode.Mode6
    });
    

    streamCamera.on("frame", (framet) => {

        console.log(framet);

    });

}

startStreaming();