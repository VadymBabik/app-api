#!/bin/sh

set -e

echo "Waiting for database at ${DB_HOST}:${DB_PORT:-5432}..."

# Чекаємо на базу даних (максимум 30 секунд)
timeout=30
while ! nc -z ${DB_HOST} ${DB_PORT:-5432}; do
  sleep 1
  timeout=$((timeout-1))
  if [ $timeout -eq 0 ]; then
    echo "Database connection timeout!"
    exit 1
  fi
done

echo "Database started successfully"

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Starting NestJS application..."
exec "$@"