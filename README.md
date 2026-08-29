# Digital Evidence of Learning: Structured Chatbot + Eval Harness

This repository is a compact, open-source example of how to capture digital evidence of learning in an AI project. It combines:

- a chatbot that returns structured JSON output using Zod
- a 10-case evaluation harness
- an LLM-as-judge scoring workflow
- a markdown report that records pass/fail results and failure modes

The goal is not just to build a model wrapper, but to demonstrate auditable evidence of learning, assessment quality, and evaluation transparency in a reproducible way.

## Why this matters for Digital Evidence of Learning

In an educational and research setting, evidence is stronger when it is:

- structured and machine-readable
- reproducible across test cases
- validated with explicit schemas
- reviewed through an evaluation rubric
- documented in an accessible report

This project provides a lightweight example of that pipeline.

## Project structure

- `src/chatbot.js` — chatbot wrapper that enforces a Zod schema on model output
- `src/judge.js` — LLM-as-judge evaluator that scores answers using structured JSON output
- `src/eval.js` — runs the evaluation harness and writes the markdown report
- `tests/cases.json` — 10 test prompts and expected outcomes
- `eval_report.md` — generated report with pass/fail analysis and commentary

## Success criteria covered

This project supports the following learning evidence goals:

- Zod schema validates model responses
- 10 evaluation cases are executed
- LLM-as-judge scoring is used
- Markdown report contains a pass/fail table
- Failure modes are documented in commentary

## Quick start

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Add your API key in `.env`:

```env
OPENAI_API_KEY=your_key_here
```

3. Install dependencies:

```bash
npm install
```

4. Run the evaluation harness:

```bash
npm run eval
```

This produces `eval_report.md` in the project root.

## Notes

- If a model returns extra prose instead of clean JSON, the extractor attempts to isolate the JSON payload before validation.
- The default model can be overridden with `OPENAI_MODEL`.
- Secrets should never be committed to the repository; use `.env` locally and keep it out of Git.

## License

This project is open source and released under the MIT License.
