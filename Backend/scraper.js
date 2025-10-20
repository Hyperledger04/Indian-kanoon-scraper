import { chromium } from 'playwright';
import fetch from 'node-fetch';

export async function scrapeDocIds(searchUrl, webhookUrl) {
  let browser;
  
  try {
    // Launch browser
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navigate to search URL
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle',
      timeout: 90000 
    });
    
    await page.waitForTimeout(2000);

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
      await browser.close();
    }
  }
}
