# 1. Базовий образ
FROM node:20-alpine AS builder

WORKDIR /app

# Встановлюємо залежності
COPY package*.json ./
RUN npm install --frozen-lockfile

# Копіюємо код
COPY . .

# ⚡️ Генеруємо Prisma Client перед білдом
RUN npx prisma generate

# Будуємо NestJS
RUN npm run build

# 2. Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]