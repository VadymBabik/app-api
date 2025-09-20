# Базовий образ для збірки
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Встановлюємо залежності для збірки
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma

# Встановлюємо всі залежності
RUN npm ci --include=dev

# Генеруємо Prisma Client ПЕРШИМ
RUN npx prisma generate

COPY . .

# Збираємо додаток
RUN npm run build

# Видаляємо devDependencies
RUN npm prune --production

# Фінальний образ
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Встановлюємо тільки необхідні пакети
RUN apk add --no-cache netcat-openbsd

# Копіюємо package.json та node_modules з білдера
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Копіюємо entrypoint скрипт
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Створюємо non-root користувача для безпеки
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Змінюємо власника файлів
RUN chown -R nestjs:nodejs /usr/src/app

USER nestjs

# Оголошуємо порт
EXPOSE 3003

# Змінні середовища за замовчуванням
ENV NODE_ENV=production
ENV APP_PORT=3003
ENV ORIGIN=http://localhost:3000
ENV API_PREFIX=/api

ENTRYPOINT [ "docker-entrypoint.sh" ]
CMD [ "node", "dist/main" ]