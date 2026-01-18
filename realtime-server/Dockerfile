# ---------- СТАДИЯ 1: сборка TypeScript ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- СТАДИЯ 2: минимальный продакшен ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Копируем только собранный JS
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["npm", "run", "start"]