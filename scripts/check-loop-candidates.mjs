import fs from 'node:fs';
import path from 'node:path';

// We can read JPEG buffers or use simple pixel difference / byte correlation
// Or we can compare with node by reading image files or using a small node script
const dir = path.resolve('docs/video-analysis/act-01/typing-frames');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();

console.log(`Found ${files.length} frames.`);
// Frames are spaced 1/12s = 0.0833s apart.
// Frame 001 is at t=0.0s.
// Let's check frame sizes and log candidates.

