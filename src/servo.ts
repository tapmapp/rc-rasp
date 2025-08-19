import { Gpio } from 'pigpio';

// ==================
// Pin configuration
// ==================
const SERVO_PIN = 18; // Must be a hardware-PWM capable GPIO (12, 13, 18, or 19)

// Servo timing constants
const SERVO_MIN_US = 500;   // ~0°
const SERVO_MAX_US = 2500;  // ~180°
const SERVO_FREQ_HZ = 50;   // Standard frame rate

// ================
// GPIO instance
// ================
const servo = new Gpio(SERVO_PIN, { mode: Gpio.OUTPUT });

// ================
// Helper functions
// ================
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function setServoAngle(angle: number): void {
    const a = clamp(angle, 0, 360);
    const pulse = SERVO_MIN_US + (SERVO_MAX_US - SERVO_MIN_US) * (a / 180);
    servo.servoWrite(Math.round(pulse));
    console.log(`Servo set to ${a}° (${Math.round(pulse)} µs)`);
}

export function centerServo(): void {
    setServoAngle(80);
    setTimeout(() => {
        setServoAngle(90);
    }, 1000);
    setTimeout(() => {
        setServoAngle(0);
    }, 3000);
}

export function stopServo(): void {
    servo.servoWrite(0);
    console.log("Servo stopped (no pulses).");
}