import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ffprobePath = path.resolve('bin/ffprobe.exe');
const sourceVideosDir = path.resolve('assets/source-videos');
const acts = ['act-01', 'act-02', 'act-03', 'act-04', 'act-05'];

const results = {};

for (const act of acts) {
  const videoFile = path.join(sourceVideosDir, `${act}.mp4`);
  const stat = fs.statSync(videoFile);
  
  const rawOutput = execFileSync(ffprobePath, [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_format',
    '-show_streams',
    videoFile
  ], { encoding: 'utf-8' });

  const data = JSON.parse(rawOutput);
  const videoStream = data.streams.find(s => s.codec_type === 'video');
  const audioStream = data.streams.find(s => s.codec_type === 'audio');

  const fpsParts = (videoStream.avg_frame_rate || '30/1').split('/');
  const fps = Number(fpsParts[0]) / Number(fpsParts[1] || 1);
  const duration = Number(data.format.duration || videoStream.duration);
  const totalFrames = videoStream.nb_frames ? Number(videoStream.nb_frames) : Math.round(duration * fps);

  results[act] = {
    file: `assets/source-videos/${act}.mp4`,
    fileSizeBytes: stat.size,
    fileSizeMB: (stat.size / (1024 * 1024)).toFixed(2),
    durationSeconds: duration,
    totalFrames: totalFrames,
    width: videoStream.width,
    height: videoStream.height,
    aspectRatio: videoStream.display_aspect_ratio || `${videoStream.width}:${videoStream.height}`,
    fps: Number(fps.toFixed(2)),
    codec: videoStream.codec_name,
    profile: videoStream.profile,
    pixelFormat: videoStream.pix_fmt,
    bitrateKbps: Math.round(Number(data.format.bit_rate || videoStream.bit_rate || 0) / 1000),
    hasAudio: !!audioStream,
    audioCodec: audioStream ? audioStream.codec_name : null,
  };
}

fs.writeFileSync(
  path.resolve('docs/video-analysis/video-specs.json'),
  JSON.stringify(results, null, 2)
);

console.log('Video specs written successfully:');
console.log(JSON.stringify(results, null, 2));

