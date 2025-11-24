#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
// Simple helper to append standardized entries to AGENT_LOG.md
// Usage: node scripts/agent-log.js -- --actor my-agent --type Claim --title "..." --scope file1,file2 --branch feat/x --notes "..."

const fs = require('fs');
const path = require('path');

const logPath = path.resolve(__dirname, '..', 'AGENT_LOG.md');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[i+1] : true;
      out[key] = val;
      if (val !== true) i++;
    }
  }
  return out;
}

function nowISO() { return new Date().toISOString(); }

function buildEntry(opts) {
  const time = nowISO();
  const actor = opts.actor || 'unknown-agent';
  const type = opts.type || 'Note';
  const title = opts.title || '';
  const branch = opts.branch || '';
  const notes = opts.notes || '';
  const scope = (opts.scope || '').split(',').map(s => s.trim()).filter(Boolean);

  const lines = [];
  lines.push('---');
  lines.push(`time: ${time}`);
  lines.push(`actor: ${actor}`);
  lines.push(`type: ${type}`);
  if (title) lines.push(`title: ${title}`);
  if (scope.length) {
    lines.push('scope:');
    scope.forEach(s => lines.push(`  - ${s}`));
  }
  if (branch) lines.push(`branch: ${branch}`);
  if (opts.commit) lines.push(`commit: ${opts.commit}`);
  if (notes) lines.push(`notes: "${notes.replace(/"/g, '\\"')}"`);
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const opts = parseArgs();
  const entry = buildEntry(opts);
  try {
    fs.appendFileSync(logPath, entry, { encoding: 'utf8' });
    console.log('Appended entry to AGENT_LOG.md');
  } catch (e) {
    console.error('Failed to append to AGENT_LOG.md', e);
    process.exit(2);
  }
}

main();
