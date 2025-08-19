import * as dotenv from 'dotenv';

// MODULES
import { initSocket } from "./Socket";
import { centerServo, setServoAngle } from './servo';

dotenv.config();

const socket = initSocket();

const keyUp = (key: string) => {
    centerServo();
};

const keyDown = (key: string) => {
    console.log(key);
};

socket.on('keyDown', (key: string) => keyDown(key));
socket.on('keyUp', (key: string) => keyUp(key));

setServoAngle(0);

setTimeout(() => {
    setServoAngle(90);
}, 3000);

setTimeout(() => {
    centerServo();
}, 6000);