# Finance Tracker

A full-stack web application for tracking income and expenses with a financial summary dashboard.

## 🚀 Quick Start with Docker Compose (Recommended)

The fastest way to get started is using Docker Compose. This will start all services (frontend, backend, and database) with a single command:

```bash
# Clone the repository
git clone git@github.com:davidhailu0/finance-tracker.git
cd personal-finance-tracker

# Start all services (frontend, backend, database)
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

**Access the application:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:3001
- 📚 API Documentation (Swagger): http://localhost:3001/api-docs

**Default credentials:**
- Email: `test@example.com`
- Password: `password123`

The database is automatically initialized with migrations and seed data on first run.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Sequelize ORM
- **Database**: MySQL 8.0
- **Authentication**: JWT
- **Internationalization**: Native Next.js i18n (5 languages: English, Amharic, Oromo, Tigrinya, Somali)
- **Testing**: Jest + Supertest (Backend), Vitest + React Testing Library (Frontend)
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

### For Docker Setup (Recommended)
- Docker Desktop or Docker Engine
- Docker Compose (included with Docker Desktop)

### For Manual Setup
- Node.js 18+
- MySQL 8.0
- pnpm (or npm/yarn)

## 🐳 Docker Setup (Detailed)

### First Time Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd personal-finance-tracker
   ```

2. **Create environment files (optional - defaults work):**
   ```bash
   # Backend environment (optional)
   cp backend/.env.example backend/.env
   
   # Frontend environment (optional)
   cp frontend/.env.example frontend/.env.local
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Wait for services to be ready:**
   ```bash
   # Check service status
   docker-compose ps
   
   # Watch logs until you see "Server running on port 3001"
   docker-compose logs -f backend
   ```

5. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Login with default credentials or register a new account

### Common Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a specific service
docker-compose restart frontend
docker-compose restart backend

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild after code changes
docker-compose up -d --build

# Clean restart (removes volumes)
docker-compose down -v
docker-compose up -d

# Execute commands in containers
docker-compose exec backend pnpm test
docker-compose exec frontend pnpm lint

# Access database
docker-compose exec db mysql -u root -prootpassword finance_tracker

# Run migrations manually (if needed)
docker-compose exec backend npx sequelize-cli db:migrate

# Run seeders manually (if needed)
docker-compose exec backend npx sequelize-cli db:seed:all

# Undo last migration
docker-compose exec backend npx sequelize-cli db:migrate:undo

# Undo all seeders
docker-compose exec backend npx sequelize-cli db:seed:undo:all
```

### Database Migrations & Seeding

**Automatic (Recommended):**
Migrations and seeders run automatically when the backend container starts for the first time. You don't need to do anything!

**Manual Control:**
If you need to run migrations or seeders manually:

```bash
# Run migrations
docker-compose exec backend npx sequelize-cli db:migrate

# Run seeders
docker-compose exec backend npx sequelize-cli db:seed:all

# Undo last migration
docker-compose exec backend npx sequelize-cli db:migrate:undo

# Undo all migrations
docker-compose exec backend npx sequelize-cli db:migrate:undo:all

# Undo all seeders
docker-compose exec backend npx sequelize-cli db:seed:undo:all

# Create new migration
docker-compose exec backend npx sequelize-cli migration:generate --name migration-name

# Create new seeder
docker-compose exec backend npx sequelize-cli seed:generate --name seeder-name
```

**Reset Database:**
To completely reset the database:

```bash
# Stop services and remove volumes
docker-compose down -v

# Start fresh (migrations and seeders will run automatically)
docker-compose up -d
```

### Troubleshooting Docker

**Port conflicts:**
```bash
# If ports 3000, 3001, or 3306 are in use, stop conflicting services or modify docker-compose.yml
docker-compose down
# Edit docker-compose.yml to change ports
docker-compose up -d
```

**Database connection issues:**
```bash
# Check if database is ready
docker-compose logs db

# Restart backend after database is ready
docker-compose restart backend
```

**Clear everything and start fresh:**
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 💻 Manual Setup (Without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=finance_tracker
# DB_USER=root
# DB_PASSWORD=yourpassword

# Create database
mysql -u root -p
CREATE DATABASE finance_tracker;
exit;

# Run migrations
npx sequelize-cli db:migrate

# Seed database (optional)
npx sequelize-cli db:seed:all

# Start development server
pnpm dev
```

Backend will run on http://localhost:3001

### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start development server
pnpm dev
```

Frontend will run on http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3001
DB_HOST=localhost          # Use 'db' for Docker
DB_PORT=3306
DB_NAME=finance_tracker
DB_USER=root
DB_PASSWORD=yourpassword   # Use 'rootpassword' for Docker
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get financial summary

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

**Full API documentation:** http://localhost:3001/api-docs

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  avatarUrl VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## ✨ Features

- 🔐 User authentication (JWT-based)
- 💰 Create, read, update, delete transactions
- 📊 Financial summary dashboard with animated charts
- 📈 Category-based breakdown with insights
- 📅 Date range filtering with quick filters
- 📄 Export data (CSV/JSON)
- 🌍 Multi-language support (English, Amharic, Oromo, Tigrinya, Somali)
- 🎨 Beautiful animations with Framer Motion
- 📱 Fully responsive design
- 🧪 Comprehensive test coverage
- 📚 API documentation with Swagger
- 🐳 Docker support for easy deployment

## 📜 Scripts

### Backend
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm migrate          # Run database migrations
pnpm seed             # Seed the database
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:unit        # Run unit tests only
pnpm test:integration # Run integration tests only
```

### Frontend
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Open test UI
pnpm test:coverage    # Run tests with coverage
```

### Docker
```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
docker-compose restart backend # Restart backend
docker-compose up -d --build   # Rebuild and start
```

## 🧪 Testing

This project includes comprehensive test coverage for both backend and frontend.

### Quick Start
```bash
# Backend tests (requires MySQL database)
cd backend && pnpm test

# Frontend tests
cd frontend && pnpm test

# Run all tests (Windows)
run-all-tests.bat

# Run all tests (Linux/Mac)
./run-all-tests.sh
```

### Backend Tests - Database Requirement

⚠️ **Important**: Backend tests require a MySQL database connection. 

**Options:**
1. **Use Docker MySQL** (Recommended):
   ```bash
   docker-compose up -d db
   cd backend && pnpm test
   ```

2. **Use Local MySQL**:
   - Install MySQL locally
   - Create test database: `CREATE DATABASE finance_tracker_test;`
   - Run tests: `cd backend && pnpm test`

3. **Skip integration tests**:
   ```bash
   cd backend && pnpm test:unit
   ```

See [backend/TESTING_NOTE.md](./backend/TESTING_NOTE.md) for detailed information.

### Test Coverage
- **Backend**: ~60% coverage (core services, middleware, API endpoints)
- **Frontend**: ~40% coverage (components, utilities)
- **Total**: 12 test suites, ~94 test cases

### Testing Documentation
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide
- [TEST_QUICK_START.md](./TEST_QUICK_START.md) - Quick reference
- [TESTING_SUMMARY.md](./TESTING_SUMMARY.md) - Implementation summary
- [backend/TESTING_NOTE.md](./backend/TESTING_NOTE.md) - Backend testing requirements

## 📚 Documentation

**📖 [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Complete documentation index and navigation guide**

### Getting Started
- [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) - ⚡ Get running in 5 minutes
- [README.md](./README.md) - Complete project documentation (this file)

### Project Status
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current status and completed tasks
- [TESTING_STATUS.md](./TESTING_STATUS.md) - Testing setup and results

### Features & Implementation
- [I18N_REFERENCE.md](./I18N_REFERENCE.md) - Multi-language support guide
- [ENHANCED_FEATURES.md](./frontend/ENHANCED_FEATURES.md) - Enhanced features guide
- [ARCHITECTURE.md](./frontend/ARCHITECTURE.md) - Frontend architecture guide

### Setup & Deployment
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database migrations and seeding guide
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Detailed Docker setup guide
- [DOCKER_QUICK_REFERENCE.md](./DOCKER_QUICK_REFERENCE.md) - Docker commands reference

### Development
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide
- [SWAGGER_SETUP.md](./backend/SWAGGER_SETUP.md) - API documentation setup
- [CODE_STRUCTURE_ANALYSIS.md](./CODE_STRUCTURE_ANALYSIS.md) - Code structure analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Charts library
