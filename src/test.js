import { spawn } from "node:child_process";

const cam = spawn("rpicam-vid", [
    "-t", "0",
    "--width", "1280",
    "--height", "720",
    "--framerate", "30",
    "--profile", "baseline",
    "--inline",
    "-o", "-"
  ]);
  
  cam.stderr.on("data", d => console.log(d));