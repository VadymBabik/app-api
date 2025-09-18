# 1. Базовий образ
FROM node:20-alpine AS builder

# 2. Робоча директорія
WORKDIR /app

# 3. Встановлюємо залежності
COPY package*.json ./
RUN npm install --frozen-lockfile

# 4. Копіюємо код і будуємо
COPY . .
RUN npm run build

# 5. Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Встановлюємо лише prod-залежності
COPY package*.json ./
RUN npm install --omit=dev --frozen-lockfile

# Копіюємо зібраний код і prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

# Генеруємо Prisma client
RUN npx prisma generate

# Відкриваємо порт (наприклад 3000)
EXPOSE 3000

# Запускаємо NestJS
CMD ["node", "dist/main.js"]