import { chromium } from 'playwright';
import fetch from 'node-fetch';

// This connects to browserless.io using your API key
// We will set this in Render's "Environment" settings
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;
const BROWSERLESS_URL = const BROWSERLESS_URL = `wss://production-sfo.browserless.io?token=${BROWSERLESS_API_KEY}`;

export async function scrapeDocIds(searchUrl, webhookUrl) {
  let browser;
  
  try {
    // --- THIS IS THE MAIN CHANGE ---
    // Instead of launching a local browser, we connect to the remote one
    console.log('Connecting to browserless.io...');
    browser = await chromium.connect(BROWSERLESS_URL, {
      timeout: 60000 // Give 60s to connect
    });
    // --- END OF CHANGE ---
    
    const page = await browser.newPage();
    
    console.log(`Navigating to ${searchUrl}...`);
    // Navigate to search URL
    // We use 'domcontentloaded' because it's faster and all we need is the HTML
    await page.goto(searchUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 90000 
    });
    
    // This wait is no longer needed, page.goto handles it
    // await page.waitForTimeout(2000); 

    console.log('Extracting doc IDs...');
    // Extract doc IDs
    const links = await page.$$eval('a[href*="/doc/"]', (anchors) =>
      anchors.map((a) => a.href)
    );

    const ids = Array.from(
      new Set(
        links
          .map((link) => {
            const match = link.match(/\/doc\/([A-Za-z0-9]+)/);
            return match ? match[1] : null;
          })
          .filter(Boolean)
      )
    );

    const docIds = ids.slice(0, 10); // top 10 doc IDs
    
    console.log(`Scraped ${docIds.length} doc IDs:`, docIds);

    // Send to webhook
    const payload = {
      searchUrl,
      docIds
    };

    console.log('Sending to webhook...');
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let webhookStatus = 'sent';
    if (!webhookResponse.ok) {
      console.error('Webhook error:', webhookResponse.status, webhookResponse.statusText);
      webhookStatus = `error: ${webhookResponse.status}`;
    } else {
      console.log('Successfully sent to webhook');
    }

    return {
      docIds,
      webhookStatus
    };

  } catch (error) {
    console.error('Scraper error:', error);
    throw error;
  } finally {
    if (browser) {
      console.log('Closing browser connection.');
      await browser.close();
    }
  }
}
