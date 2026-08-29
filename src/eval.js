import fs from "fs";
import path from "path";
import { askChatbot } from "./chatbot.js";
import { judgePair } from "./judge.js";

const cases = JSON.parse(fs.readFileSync(path.resolve("./tests/cases.json"), "utf-8"));
const LIMIT = Number(process.env.EVAL_LIMIT || cases.length);
const DELAY_MS = Number(process.env.EVAL_DELAY_MS || 0);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const results = [];
  const casesToRun = cases.slice(0, Math.max(1, Math.min(LIMIT, cases.length)));
  console.log(`Running ${casesToRun.length} case(s) with ${DELAY_MS}ms delay between calls.`);

  for (const c of casesToRun) {
    try {
      const resp = await askChatbot(c.prompt);
      const judge = await judgePair(c.expected, resp.answer);
      const pass = judge.score >= 0.8;
      results.push({ id: c.id, prompt: c.prompt, expected: c.expected, answer: resp.answer, score: judge.score, verdict: judge.verdict, reason: judge.reason, pass });
      console.log(`Case ${c.id}: score=${judge.score} pass=${pass}`);
    } catch (err) {
      results.push({ id: c.id, error: String(err) });
      console.error(`Case ${c.id} error:`, err);
    }

    if (DELAY_MS > 0 && c.id !== casesToRun[casesToRun.length - 1].id) {
      await sleep(DELAY_MS);
    }
  }

  // Write markdown report
  const lines = [];
  lines.push('# Eval Report');
  lines.push('\n');
  lines.push('| Case | Score | Pass | Comment |');
  lines.push('|---|---:|---|---|');
  for (const r of results) {
    if (r.error) {
      lines.push(`| ${r.id} | - | fail | ERROR: ${r.error.replace(/\n/g, ' ')} |`);
    } else {
      lines.push(`| ${r.id} | ${r.score.toFixed(2)} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.reason.replace(/\n/g, ' ')} |`);
    }
  }

  // Failure-mode commentary
  lines.push('\n');
  lines.push('## Failure mode commentary');
  lines.push('\n');
  const fails = results.filter(r => !r.pass);
  if (fails.length === 0) {
    lines.push('All cases passed the pass threshold.');
  } else {
    for (const f of fails) {
      if (f.error) {
        lines.push(`- Case ${f.id}: runtime/error — ${f.error}`);
      } else {
        lines.push(`- Case ${f.id}: ${f.reason}`);
      }
    }
  }

  fs.writeFileSync(path.resolve('eval_report.md'), lines.join('\n'));
  console.log('Wrote eval_report.md');
}

run();
