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

## Decision: use a stronger model as judge

The evaluation layer intentionally uses a stronger model than the base chatbot model for judging. This is a deliberate design choice to improve evaluation quality, reduce false positives on partially correct answers, and make scoring more consistent with rubric-based assessment.

Why this matters:

- the chatbot is optimized for generation, while the judge is optimized for evaluation
- a stronger judge can better compare the assistant answer against the expected answer and provide grounded reasoning
- using a separate judge improves transparency and makes the evaluation process auditable as digital evidence of learning

The workflow is therefore:

1. generate an answer from the chatbot
2. validate the answer shape with Zod
3. send the expected and actual answer to the judge model
4. score the response on a 0–1 scale with a verdict and reason
5. record the result in the markdown eval report

This makes the assessment process more rigorous and easier to explain in educational or research settings.

## Quick start

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Add your API key in `.env`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

3. Install dependencies:

```bash
npm install
```

4. Run the web app locally:

```bash
npm run dev
```

5. Run the evaluation harness:

```bash
npm run eval
```

This produces `eval_report.md` in the project root.

## Vercel deployment

This project is also ready to deploy to Vercel as a Next.js app.

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables in the Vercel dashboard:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
4. Deploy the project.

The app uses the Next.js API route at `/api/chat` to call the structured chatbot logic.

## Notes

- If a model returns extra prose instead of clean JSON, the extractor attempts to isolate the JSON payload before validation.
- The default model can be overridden with `OPENAI_MODEL`.
- Secrets should never be committed to the repository; use `.env` locally and keep it out of Git.

## License

This project is open source and released under the MIT License.
