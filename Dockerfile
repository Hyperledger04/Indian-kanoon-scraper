FROM node:18-bullseye

# Install Playwright dependencies
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend
# FIX: Changed 'backend' to 'Backend'
COPY Backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
RUN npx playwright install chromium

# Copy frontend
WORKDIR /app
# FIX: Changed 'frontend' to 'Frontend'
COPY Frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy source code
WORKDIR /app
# FIX: Changed 'backend' to 'Backend'
COPY Backend ./backend
# FIX: Changed 'frontend' to 'Frontend'
COPY Frontend ./frontend

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Move built frontend to backend public folder
RUN mkdir -p /app/backend/public
RUN cp -r build/* /app/backend/public/

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "server.js"]
