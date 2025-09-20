#!/bin/sh

# Make sure our backend app does not start before db ready
echo "Waiting for database at $DB_HOST:5432..."

# Використовуємо DB_HOST з змінних середовища або з DATABASE_URL
DB_HOST=${DB_HOST:-$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')}

while ! nc -z $DB_HOST 5432; do
  sleep 2
done
echo "Database started successfully"

# Apply db migrations
echo "Applying database migrations..."
npx prisma migrate deploy

echo "Generating Prisma Client"
npx prisma generate

echo "Starting NestJS application on port $APP_PORT..."
exec "$@"