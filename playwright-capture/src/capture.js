import { chromium } from "playwright";
import fetch from "node-fetch";

const SOURCE_URL = "https://brandepica.github.io/tools/skugen.html";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "http://localhost:5678/webhook/sku-created";

async function captureAndSend() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(SOURCE_URL, { waitUntil: "domcontentloaded" });

    // NOTE: Selectors are placeholders and should be updated after inspecting real DOM.
    // This fallback exists only when no direct webhook/API is available.
    await page.waitForTimeout(2000);

    const sku = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll("input, textarea, div, span"))
        .map((el) => (el.textContent || el.value || "").trim())
        .filter(Boolean)
        .filter((txt) => /[A-Z0-9]{4,}/.test(txt));
      return candidates[0] || "";
    });

    if (!sku) {
      throw new Error("No SKU detected from source page");
    }

    const payload = {
      sku,
      source: "playwright-capture",
      generatedAt: new Date().toISOString(),
      requestId: `evt_${Date.now()}`
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Webhook failed with status ${res.status}`);
    }

    console.log("SKU forwarded:", payload);
  } finally {
    await browser.close();
  }
}

captureAndSend().catch((err) => {
  console.error("Capture error:", err.message);
  process.exit(1);
});
