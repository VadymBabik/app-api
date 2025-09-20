FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

RUN npm prune --production

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /usr/src/app

USER nestjs

EXPOSE 3003

ENTRYPOINT [ "docker-entrypoint.sh" ]
CMD [ "node", "dist/main" ]