import { spawnSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('====================================================');
console.log('FAST COMPREHENSIVE GIT OBJECT DATABASE AUDIT');
console.log('====================================================');

// Helper to audit any ref
function auditRef(refName) {
  console.log(`\nAuditing ref: ${refName}...`);
  // Pipe git rev-list --objects directly into git cat-file --batch-check
  const revList = spawnSync('git', ['rev-list', '--objects', refName], {
    maxBuffer: 1024 * 1024 * 50,
    encoding: 'utf-8',
  });

  if (revList.error || revList.status !== 0) {
    console.error(`Failed rev-list for ${refName}:`, revList.stderr);
    return [];
  }

  const catFile = spawnSync('git', ['cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize) %(rest)'], {
    input: revList.stdout,
    maxBuffer: 1024 * 1024 * 50,
    encoding: 'utf-8',
  });

  if (catFile.error || catFile.status !== 0) {
    console.error(`Failed cat-file for ${refName}:`, catFile.stderr);
    return [];
  }

  const lines = catFile.stdout.trim().split('\n');
  const blobs = [];

  for (const line of lines) {
    const parts = line.trim().split(' ');
    const sha = parts[0];
    const type = parts[1];
    const size = parseInt(parts[2], 10);
    const objPath = parts.slice(3).join(' ');

    if (type === 'blob') {
      blobs.push({
        sha,
        path: objPath || '<unnamed-blob>',
        sizeBytes: size,
        sizeMiB: (size / (1024 * 1024)).toFixed(2),
        sizeMB: (size / (1000 * 1000)).toFixed(2),
      });
    }
  }

  blobs.sort((a, b) => b.sizeBytes - a.sizeBytes);
  return blobs;
}

// 1. Audit Target Branch: refs/heads/cinematic-video-rebuild
const targetRef = 'refs/heads/cinematic-video-rebuild';
const targetBlobs = auditRef(targetRef);

console.log(`Target branch (${targetRef}) has ${targetBlobs.length} reachable blobs.`);

const targetOver50 = targetBlobs.filter(b => b.sizeBytes >= 50 * 1024 * 1024);
const targetOver100 = targetBlobs.filter(b => b.sizeBytes >= 100 * 1024 * 1024);

console.log(`\nTARGET BRANCH BLOBS >= 100 MiB: ${targetOver100.length}`);
for (const b of targetOver100) {
  // Find which commits reference it
  const commitCheck = spawnSync('git', ['log', '--oneline', `--find-object=${b.sha}`, targetRef], { encoding: 'utf-8' });
  b.commits = commitCheck.stdout.trim().split('\n').filter(Boolean);
  console.log(`- ${b.sizeMiB} MiB (${b.sizeBytes} B) [${b.sha}]: ${b.path}`);
  console.log(`  Referenced in:`, b.commits);
}

console.log(`\nTARGET BRANCH BLOBS >= 50 MiB: ${targetOver50.length}`);
for (const b of targetOver50) {
  if (!b.commits) {
    const commitCheck = spawnSync('git', ['log', '--oneline', `--find-object=${b.sha}`, targetRef], { encoding: 'utf-8' });
    b.commits = commitCheck.stdout.trim().split('\n').filter(Boolean);
  }
  console.log(`- ${b.sizeMiB} MiB (${b.sizeBytes} B) [${b.sha}]: ${b.path}`);
  console.log(`  Referenced in:`, b.commits);
}

// 2. Audit All Other Refs
const allRefsRaw = execSync('git for-each-ref --format="%(refname)"', { encoding: 'utf-8' });
const allRefs = allRefsRaw.trim().split('\n').map(r => r.trim()).filter(Boolean);

const refReports = {};
for (const ref of allRefs) {
  if (ref === targetRef) continue;
  const refBlobs = auditRef(ref);
  const over50 = refBlobs.filter(b => b.sizeBytes >= 50 * 1024 * 1024);
  const over100 = refBlobs.filter(b => b.sizeBytes >= 100 * 1024 * 1024);
  refReports[ref] = {
    totalBlobs: refBlobs.length,
    blobsOver50: over50,
    blobsOver100: over100,
    top5: refBlobs.slice(0, 5)
  };
  console.log(`Ref ${ref}: ${over50.length} blobs >= 50 MiB, ${over100.length} blobs >= 100 MiB`);
}

// 3. Storage Measurements
const countObjects = execSync('git count-objects -vH', { encoding: 'utf-8' });

// Current working tree tracked sizes
const lsFiles = execSync('git ls-files', { encoding: 'utf-8' }).trim().split('\n');
let trackedBytes = 0;
for (const f of lsFiles) {
  if (fs.existsSync(f)) {
    trackedBytes += fs.statSync(f).size;
  }
}

// Total .git/objects size on disk
function getDirSize(dir) {
  let sz = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) sz += getDirSize(p);
    else sz += fs.statSync(p).size;
  }
  return sz;
}

const gitObjectsBytes = getDirSize('.git/objects');

const auditData = {
  timestamp: new Date().toISOString(),
  targetRef,
  countObjects,
  gitObjectsSizeMiB: (gitObjectsBytes / (1024 * 1024)).toFixed(2),
  trackedWorkingTreeSizeMiB: (trackedBytes / (1024 * 1024)).toFixed(2),
  targetBranch: {
    totalBlobs: targetBlobs.length,
    blobsOver100MiB: targetOver100,
    blobsOver50MiB: targetOver50,
    top15LargestBlobs: targetBlobs.slice(0, 15)
  },
  otherRefs: refReports
};

fs.writeFileSync('docs/reports/git-history-audit-raw.json', JSON.stringify(auditData, null, 2));
console.log('\nAudit complete! Saved data to docs/reports/git-history-audit-raw.json');
