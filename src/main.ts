import * as dotenv from 'dotenv';

// MODULES
import { initSocket } from "./Socket";
import { centerServo, setServoAngle } from './servo';

dotenv.config();

initSocket();

setServoAngle(0);

setTimeout(() => {
    setServoAngle(90);
}, 3000);

setTimeout(() => {
    centerServo();
}, 6000);