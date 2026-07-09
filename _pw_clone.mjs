import { chromium } from 'playwright';
const SP = process.argv[2] || '.';
const browser = await chromium.launch({ headless: false, slowMo: 400 });
const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));

await page.goto('http://localhost:5050/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
console.log('title:', await page.title());

// Screenshot the landing (Setup) page
await page.screenshot({ path: `${SP}/clone_1_setup.png` });

// Try to navigate to Portfolio (the prototype uses nav tabs / buttons)
async function go(name) {
  const el = page.getByText(name, { exact: false }).first();
  if (await el.isVisible().catch(() => false)) {
    await el.click().catch(() => {});
    await page.waitForTimeout(2500);
    return true;
  }
  return false;
}

for (const [tab, shot] of [['Portfolio','clone_2_portfolio.png'], ['Peer','clone_3_peer.png'], ['Overlap','clone_4_overlap.png']]) {
  const ok = await go(tab);
  console.log(`nav ${tab}:`, ok);
  if (ok) await page.screenshot({ path: `${SP}/${shot}` });
}

console.log('console errors:', errors.length ? errors.slice(0,6) : 'none');
await browser.close();
