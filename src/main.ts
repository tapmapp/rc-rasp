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
    if (key == 'a') setServoAngle(90);
    if (key == 'd') setServoAngle(0);
};

socket.on('keyDown', (key: string) => keyDown(key));
socket.on('keyUp', (key: string) => keyUp(key));