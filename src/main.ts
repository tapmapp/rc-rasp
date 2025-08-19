import * as dotenv from 'dotenv';

// MODULES
import { initSocket } from "./Socket";
import { centerServo, setServoAngle } from './servo';

dotenv.config();

initSocket();

setServoAngle(0);

setTimeout(() => {
    setServoAngle(40);
}, 1000);

setTimeout(() => {
    setServoAngle(80);
}, 1000);

centerServo();