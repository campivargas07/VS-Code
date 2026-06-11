# SKU to Google Slides Automation Workspace

This workspace contains a practical starter setup for automating SKU insertion into Google Slides.

## What is included

- n8n self-hosted setup with Docker Compose.
- Sample n8n workflow: receives `POST /webhook/sku-created` and calls Google Slides `batchUpdate`.
- Optional Playwright capture service for sites without public API/webhook.
- Webhook contract documentation.

## Project structure

- `.github/copilot-instructions.md`: setup checklist.
- `docker-compose.yml`: services for n8n and optional capture worker.
- `.env.example`: environment variables.
- `n8n/workflows/sku-to-slides.sample.json`: importable workflow sample.
- `playwright-capture/`: optional browser automation capture service.
- `docs/webhook-contract.md`: input payload specification.

## Setup

1. Copy env vars:

```bash
cp .env.example .env
```

2. Start n8n:

```bash
docker compose up -d n8n
```

3. Open n8n at `http://localhost:5678`.

4. Create Google OAuth2 credential in n8n:
- Use Google OAuth2 API credential type.
- Required scopes:
  - `https://www.googleapis.com/auth/presentations`
  - `https://www.googleapis.com/auth/drive.file`

5. In Google Slides, prepare a template slide with marker text `{{SKU_BODY}}` in the body.

6. Import `n8n/workflows/sku-to-slides.sample.json` into n8n.

7. Set env values in `.env`:
- `GOOGLE_PRESENTATION_ID`
- `GOOGLE_TEMPLATE_SLIDE_OBJECT_ID`

8. Activate workflow and test:

```bash
curl -X POST http://localhost:5678/webhook/sku-created \
  -H 'Content-Type: application/json' \
  -d '{"sku":"CLT20260610-META-1080X1350-001","requestId":"evt_1"}'
```

## Optional fallback: Playwright capture

If the source generator does not expose API/webhook, use browser capture:

```bash
docker compose --profile capture up --build playwright-capture
```

Then adapt selectors in `playwright-capture/src/capture.js` after inspecting the source page DOM.

## Error handling recommendations

- Reject empty SKU early in n8n (`IF sku not empty`).
- Add retries (3x with backoff) on Google API steps.
- Store `requestId` to avoid duplicate slide creation.
- Add error branch notifications (Slack or email) from n8n error trigger.
