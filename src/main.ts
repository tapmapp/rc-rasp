import * as dotenv from 'dotenv';

// MODULES
import { initSocket } from "./Socket";
import { centerServo } from './servo';

dotenv.config();


initSocket();

centerServo();