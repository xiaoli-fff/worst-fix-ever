// Worst Fix Ever: Funniest Commit Message
// https://make.fun/bounty/u-deysumbrella-worst-fix-ever-funniest-commit-message-3f1d9722
//
// The joke in one line: the 500s are "fixed" not by repairing anything, but by
// answering every request with a 404 instead. The error dashboard goes quiet
// and the bug count drops to zero — because nothing on the site exists anymore.
// It is a fix that works only if nobody looks at what it actually did: the
// server no longer returns server errors, but only because it no longer
// returns anything useful at all.
//
// This program does nothing clever. It holds the single commit message as a
// constant, checks it against the competition gate (one line, 1-100 chars,
// not only whitespace), and writes it verbatim to entry.txt. The 100-char
// cap matters because a commit subject is meant to be a short, single-line
// summary — anything longer stops scanning as a subject and starts reading
// as a paragraph, so the gate keeps the joke in subject-line form. No
// randomness, no network, no reading of anything outside this file, so
// every run produces byte-identical output.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a fix that "works" by returning 404 for everything.
const COMMIT_MESSAGE =
  "fix: stop the 500 errors by returning 404 for everything";

// The gate allows at most 100 characters on a single line.
const MAX_ENTRY_CHARS = 100;

function outputDirectory(): string {
  // Inside the grading sandbox the harness provides /output; locally the
  // caller can point elsewhere with MAKEFUN_OUTPUT_DIR.
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function problemsWith(line: string): string[] {
  const problems: string[] = [];
  if (line.trim().length === 0) {
    problems.push("entry is blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("entry must be a single line");
  }
  if (line.length > MAX_ENTRY_CHARS) {
    problems.push(
      `entry is ${line.length} characters, over the ${MAX_ENTRY_CHARS} limit`,
    );
  }
  return problems;
}

function main(): void {
  const problems = problemsWith(COMMIT_MESSAGE);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`gate failed: ${problem}`);
    }
    process.exit(1);
  }

  const dir = outputDirectory();
  mkdirSync(dir, { recursive: true });
  // Written exactly as-is, with no trailing newline, so the file holds
  // exactly the 56 characters of the commit message.
  writeFileSync(join(dir, "entry.txt"), COMMIT_MESSAGE, "utf8");
  console.log(`wrote entry.txt (${COMMIT_MESSAGE.length} chars) to ${dir}`);
}

main();
