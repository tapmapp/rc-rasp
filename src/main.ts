import * as dotenv from 'dotenv';

// MODULES
import { initSocket } from "./Socket";
import { centerServo, setServoAngle } from './servo';

dotenv.config();


initSocket();

setServoAngle(90);

