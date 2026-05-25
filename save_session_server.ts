import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import express from 'express';
import { join } from 'path';

async function main() {
  const app = express();
  let browserContext: any = null;
  let playwrightBrowser: any = null;

  app.get('/', async (req, res) => {
    if (browserContext) {
      try {
        const sessionData = await browserContext.storageState();
        writeFileSync(join(process.cwd(), 'medium-session.json'), JSON.stringify(sessionData, null, 2));
        res.send('<h1>✅ Session saved successfully! You can close this window now.</h1>');
        console.log('✅ Session saved successfully to medium-session.json');
        setTimeout(() => {
          playwrightBrowser?.close().catch(() => {});
          process.exit(0);
        }, 2000);
      } catch (error) {
        res.send(`<h1>❌ Error saving session: ${error}</h1>`);
      }
    } else {
      res.send('<h1>❌ Browser not ready yet.</h1>');
    }
  });

  app.listen(3001, async () => {
    console.log('🚀 Login helper running! Open http://localhost:3001 when you are done logging in.');
    
    playwrightBrowser = await chromium.launch({
      headless: false,
      args: [
        '--no-first-run',
        '--disable-blink-features=AutomationControlled',
        '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });

    browserContext = await playwrightBrowser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await browserContext.newPage();
    await page.goto('https://medium.com/m/signin');
  });
}

main();
