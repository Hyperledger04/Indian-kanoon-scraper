FROM node:18-bullseye

# We no longer need any of the 'apt-get install' Playwright dependencies

WORKDIR /app

# Copy backend
COPY Backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
# We no longer need 'npx playwright install chromium'

# Copy frontend
WORKDIR /app
COPY Frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy source code
WORKDIR /app
COPY Backend ./backend
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
