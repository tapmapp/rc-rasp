import * as dotenv from 'dotenv';

// MODULES
import { initSocket } from "./Socket";
import { centerServo, setServoAngle } from './servo';

dotenv.config();


initSocket();

setServoAngle(0);

setTimeout(() => {
    setServoAngle(90);
}, 1000);


setTimeout(() => {
    centerServo();
}, 2000);