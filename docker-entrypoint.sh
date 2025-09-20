#!/bin/sh

echo "Waiting for database at ${DB_HOST}:${DB_PORT:-5432}..."

# Чекаємо на базу даних
while ! nc -z ${DB_HOST} ${DB_PORT:-5432}; do
  sleep 2
done

echo "Database started successfully"

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Starting NestJS application on port ${APP_PORT:-3003}..."
exec "$@"