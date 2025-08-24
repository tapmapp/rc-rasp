import * as dotenv from 'dotenv';

// MODULES
import { initSocket } from "./Socket";
import { centerServo, setServoAngle } from './servo';
import * as Stream from './stream.js';

dotenv.config();

Stream.startStream();

const socket = initSocket();

const keyUp = (key: string) => {
    centerServo();
};

const keyDown = (key: string) => {
    if (key == 'a') setServoAngle(0);
    if (key == 'd') setServoAngle(90);
};

socket.on('keyDown', (key: string) => keyDown(key));
socket.on('keyUp', (key: string) => keyUp(key));