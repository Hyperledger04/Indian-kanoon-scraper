# Indian Kanoon Scraper - Full Stack Application

A containerized full-stack application that scrapes document IDs from Indian Kanoon search results and sends them to an n8n webhook.

## 🚀 Features

- ✅ Beautiful React frontend with Tailwind CSS
- ✅ Express backend with Playwright scraper
- ✅ Dockerized for easy deployment
- ✅ Extracts up to 10 document IDs per search
- ✅ Sends results to configurable n8n webhook
- ✅ Real-time scraping status and results

## 📦 Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Fetch API

**Backend:**
- Node.js + Express
- Playwright (Chromium)
- CORS enabled

## 🐳 Deployment Options

### Option 1: Render.com (FREE)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` file
   - Click "Create Web Service"
   - Wait 5-10 minutes for build

3. **Access your app:**
   - URL: `https://your-app-name.onrender.com`

**Note:** Free tier sleeps after 15 mins of inactivity. First request takes ~30s to wake up.

---

### Option 2: Railway.app (FREE with limits)

1. **Push to GitHub** (same as above)

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Docker
   - Click "Deploy"

3. **Generate Domain:**
   - Go to Settings → Generate Domain
   - Access at: `https://your-app.railway.app`

---

### Option 3: Fly.io (FREE tier available)

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and Launch:**
   ```bash
   fly auth login
   fly launch
   ```

3. **Follow prompts:**
   - Choose app name
   - Select region
   - Choose free tier
   - Deploy!

4. **Access:**
   - URL: `https://your-app.fly.dev`

---

### Option 4: Local Development with Docker

1. **Build and run:**
   ```bash
   docker-compose up --build
   ```

2. **Access:**
   - Open: `http://localhost:3000`

3. **Stop:**
   ```bash
   docker-compose down
   ```

---

## 🛠️ Local Development (Without Docker)

1. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   npx playwright install chromium

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Run backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Run frontend (new terminal):**
   ```bash
   cd frontend
   npm start
   ```

4. **Access:** `http://localhost:3000`

---

## 🔧 Configuration

### Default n8n Webhook
The app comes pre-configured with: `https://n8n.n8nit.xyz/webhook/IK`

You can change this in the frontend UI or set as environment variable:
```bash
WEBHOOK_URL=https://your-webhook-url.com
```

---

## 📊 How It Works

1. User enters Indian Kanoon search URL
2. User confirms/edits n8n webhook URL
3. Backend launches Playwright browser
4. Scrapes document IDs from search results
5. Sends IDs to n8n webhook as JSON
6. n8n processes IDs → fetches full judgments → AI summary → Google Sheets

---

## 🐛 Troubleshooting

### Render.com sleeping issue:
- Free tier sleeps after 15 mins
- Use [UptimeRobot](https://uptimerobot.com) for free pinging every 5 mins

### Playwright timeout:
- Increase timeout in `scraper.js` if needed
- Check Indian Kanoon site is accessible

### Webhook failing:
- Verify webhook URL is correct
- Check n8n workflow is active
- Check backend logs for errors

---

## 📝 API Endpoint

**POST** `/api/scrape`

**Request:**
```json
{
  "url": "https://indiankanoon.org/search/?formInput=...",
  "webhookUrl": "https://n8n.n8nit.xyz/webhook/IK"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully scraped and sent to webhook",
  "docIds": ["12345", "67890", ...],
  "count": 10,
  "webhookStatus": "sent"
}
```

---

## 📄 License

MIT

---

## 🤝 Contributing

Feel free to open issues or submit PRs!

---

## ⭐ Star this repo if you find it helpful!
```

---

## 🚀 Quick Start Commands

```bash
# Clone or create this structure
# Then:

# 1. Test locally with Docker
docker-compose up --build

# 2. Or deploy to Render/Railway by pushing to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Then connect on Render.com or Railway.app
```

---

## ✅ What You Get

1. **One URL** - Everything accessible from single domain
2. **Frontend** - Beautiful React UI with Tailwind
3. **Backend API** - Express + Playwright scraper
4. **Docker Ready** - Works on any platform
5. **Free Hosting** - Deploy on Render/Railway/Fly.io
6. **Production Ready** - Error handling, CORS, health checks

---

## 📌 Recommended: Deploy on Render.com

**Why Render:**
- ✅ FREE tier (750 hrs/month)
- ✅ Auto-detects Docker
- ✅ GitHub integration
- ✅ HTTPS included
- ✅ Supports Playwright

**Steps:**
1. Push code to GitHub
2. Connect repo on Render
3. Deploy (auto-detects `render.yaml`)
4. Done! 🎉
