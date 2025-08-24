import * as dotenv from 'dotenv';

// MODULES
//import { initSocket } from "./Socket";
import { centerServo, setServoAngle } from './servo';
import * as Stream from './stream.js';

dotenv.config();

Stream.startStream();

//const socket = initSocket();

centerServo();

setTimeout(() => {
    setServoAngle(90)
}, 3000);

setTimeout(() => {
    setServoAngle(45)
}, 6000);

setTimeout(() => {
    setServoAngle(0)
}, 9000);

const keyUp = (key: string) => {
    console.log('hi1')
};

const keyDown = (key: string) => {
    if (key == 'a') console.log('hi2')
    if (key == 'd') console.log('hi3')
};

//socket.on('keyDown', (key: string) => keyDown(key));
//socket.on('keyUp', (key: string) => keyUp(key));