#!/bin/sh
set -e

echo "🚀 Starting Finance Tracker Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
npx sequelize-cli db:migrate

# Run seeders (only if not already seeded)
echo "🌱 Running database seeders..."
npx sequelize-cli db:seed:all || echo "⚠️  Seeders already applied or failed (this is okay)"

echo "✨ Database setup complete!"

# Start the application
echo "🎯 Starting application..."
exec "$@"
