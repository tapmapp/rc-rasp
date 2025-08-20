const { StreamCamera, Codec, Flip, SensorMode } = require('pi-camera-connect');

async function startStreaming() {

    console.log('running!');

    const streamCamera = new StreamCamera({
        codec: Codec.MJPEG,
        flip: Flip.Vertical,
        sensorMode: SensorMode.Mode6
    });

    await streamCamera.startCapture();

    cameraStartCapture().then(() => {
        console.log('Camera is now capturing');
        streamCamera.on("frame", (framet) => {

            console.log(framet);
    
        });
    });


    

}



startStreaming();