
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeDocIds } from './scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Scraping API endpoint
app.post('/api/scrape', async (req, res) => {
  const { url, webhookUrl } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!webhookUrl) {
    return res.status(400).json({ error: 'Webhook URL is required' });
  }

  try {
    console.log('Starting scrape for:', url);
    const result = await scrapeDocIds(url, webhookUrl);
    
    res.json({
      success: true,
      message: 'Successfully scraped and sent to webhook',
      docIds: result.docIds,
      count: result.docIds.length,
      webhookStatus: result.webhookStatus
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape',
      message: error.message 
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});
