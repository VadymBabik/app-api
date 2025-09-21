FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Встановлюємо залежності для збірки (якщо потрібно)
RUN apk add --no-cache python3 make g++

# Копіюємо package files спочатку для кращого кешування
COPY package*.json ./
COPY prisma ./prisma

# Встановлюємо залежності
RUN npm ci

# Генеруємо Prisma client
RUN npx prisma generate

# Копіюємо решту коду та збираємо
COPY . .
RUN npm run build

# Фінальний образ
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# Встановлюємо тільки необхідні пакети для роботи
RUN apk add --no-cache curl

# Копіюємо тільки необхідні файли
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Створюємо non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /usr/src/app

USER nestjs

EXPOSE 3000

# Health check для Coolify
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main"]