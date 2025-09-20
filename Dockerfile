FROM node:18-alpine

WORKDIR /usr/src/app

# Встановлюємо залежності для збірки
RUN apk add --no-cache netcat-openbsd python3 make g++

# Копіюємо тільки package files спочатку для кращого кешування
COPY package*.json ./
COPY prisma ./prisma

# Встановлюємо залежності
RUN npm ci --only=production && npm cache clean --force

# Генеруємо Prisma client
RUN npx prisma generate

# Копіюємо решту коду
COPY . .

# Збираємо додаток
RUN npm run build

# Створюємо non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /usr/src/app

USER nestjs

EXPOSE 3000

# Health check для Coolify
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD [ "node", "dist/main" ]