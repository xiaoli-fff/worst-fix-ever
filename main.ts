// Worst Fix Ever: Funniest Commit Message (Node 22, standard library only):
// writes one original commit message for a bug fix that made everything
// worse to /output/entry.txt.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input.
// Both runs write identical bytes.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The joke: a fix that "works" on paper — the 500 errors are gone — because
// every request now returns 404 instead. The repair broke more than it
// mended, in the plain voice of a tired engineer typing a subject line.
const ENTRY_TEXT =
  'fix: stop the 500 errors by returning 404 for everything';

// Gate (competition.yaml): /output/entry.txt must be UTF-8 text of 1-100
// characters, not only whitespace, and exactly one line.
const MAX_CHARS = 100;

function failGate(detail: string): never {
  throw new Error(`gate failed: ${detail}`);
}

function checkNotBlank(text: string): void {
  if (text.trim().length === 0) {
    failGate('entry must not be empty or only whitespace');
  }
}

function checkSingleLine(text: string): void {
  if (text.includes('\n') || text.includes('\r')) {
    failGate('entry must be exactly one line');
  }
}

function checkLength(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    failGate(`entry must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
}

function checkNoTrailingSpace(text: string): void {
  if (text !== text.trimEnd()) {
    failGate('entry must not end with trailing whitespace');
  }
}

// validateEntry checks each gate item separately so a failure names the
// gate item that was missed instead of a bare character count.
function validateEntry(text: string): string {
  checkNotBlank(text);
  checkSingleLine(text);
  checkLength(text);
  checkNoTrailingSpace(text);
  return text + '\n';
}

const ENTRY = validateEntry(ENTRY_TEXT);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.txt'), ENTRY, 'utf8');
