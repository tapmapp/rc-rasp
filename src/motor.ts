import { Gpio } from 'pigpio';

// =====================
// Pin & timing settings
// =====================

// Choose a hardware PWM-capable pin: 12, 13, 18, or 19.
const ESC_PIN = 13;

// ESC pulse range (most ESCs: 1000–2000 µs at ~50 Hz)
const ESC_MIN_US = 1000;
const ESC_MAX_US = 2000;
const DEFAULT_ARM_MS = 2000;

// ==============
// GPIO instance
// ==============
const esc = new Gpio(ESC_PIN, { mode: Gpio.OUTPUT });

// ==============
// Helpers
// ==============
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Convert normalized throttle (0..1) to microsecond pulse (ESC_MIN_US..ESC_MAX_US).
 */
function throttleToPulse(t: number): number {
  const tt = clamp(t, 0, 1);
  return Math.round(ESC_MIN_US + (ESC_MAX_US - ESC_MIN_US) * tt);
}

// =============
// ESC controls
// =============

/**
 * Arm the ESC by sending minimum throttle for a duration (default 2s).
 * Call this after the ESC is powered and the Pi is booted.
 */
export async function armESC(ms: number = DEFAULT_ARM_MS): Promise<void> {
  esc.servoWrite(ESC_MIN_US);
  await sleep(ms);
}

/**
 * Calibrate the ESC's throttle range (ONLY if your ESC uses this sequence).
 * Many ESCs: apply MAX throttle, wait for beeps, then MIN throttle.
 * Read your ESC manual before using this.
 */
export async function calibrateESC(stepMs: number = 2000): Promise<void> {
  // FULL THROTTLE
  esc.servoWrite(ESC_MAX_US);
  await sleep(stepMs);

  // MIN THROTTLE
  esc.servoWrite(ESC_MIN_US);
  await sleep(stepMs);
}

/**
 * Set normalized throttle, 0.0 (min) .. 1.0 (max).
 * Typical safe range is 0.0..0.6 for bench tests—know your setup.
 */
export function setEscThrottle(t: number): void {
  const pulse = throttleToPulse(t);
  esc.servoWrite(pulse);
}

/**
 * Stop sending pulses. Some ESCs prefer staying at MIN instead (use setEscThrottle(0)).
 */
export function stopESC(): void {
  esc.servoWrite(0);
}