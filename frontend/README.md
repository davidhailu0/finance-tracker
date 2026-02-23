# Personal Finance Tracker

A modern web application for tracking income and expenses with detailed financial insights. Built with Next.js, React, and shadcn/ui.

## Features

### Core Features
- **Transaction Management**
  - Create, edit, and delete transactions
  - Support for both income and expense transactions
  - Categorize transactions with predefined categories
  - Add descriptions and dates to transactions

- **Financial Summary**
  - Real-time calculation of total income and expenses
  - Current balance overview
  - Category-based breakdown of spending
  - Visual summary cards with key metrics

- **User Interface**
  - Clean, modern dashboard layout
  - Form validation with detailed error messages
  - Loading indicators for all operations
  - Confirmation dialogs for destructive actions
  - Responsive design for mobile and desktop
  - Dark mode support

### Data Management
- **Local Storage Persistence**
  - Transactions are automatically saved to browser localStorage
  - Data persists across browser sessions
  - Sample data loaded on first visit

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with Toaster
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global styles
├── components/
│   ├── finance/
│   │   ├── transaction-form.tsx      # Form for creating/editing transactions
│   │   ├── transaction-list.tsx      # Table displaying all transactions
│   │   ├── summary-cards.tsx         # Summary statistics cards
│   │   └── category-breakdown.tsx    # Category-based breakdown
│   └── ui/                  # Reusable shadcn/ui components
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── storage.ts          # Storage and data management utilities
│   └── utils.ts            # General utilities
└── public/                 # Static assets
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19 with shadcn/ui components
- **Styling**: Tailwind CSS 4
- **Forms**: react-hook-form with zod validation
- **Date Handling**: date-fns
- **Notifications**: Sonner (toast notifications)
- **State Management**: React hooks (useState, useCallback, useEffect)
- **Storage**: Browser localStorage

## Usage

### Adding a Transaction
1. Click the "Add Transaction" button in the header
2. Fill in the transaction details:
   - Select type (Income or Expense)
   - Enter amount
   - Choose category
   - Add description
   - Select date
3. Click "Add Transaction"

### Editing a Transaction
1. Click the edit icon next to any transaction in the list
2. Update the transaction details in the dialog
3. Click "Update Transaction"

### Deleting a Transaction
1. Click the delete icon next to any transaction
2. Confirm the deletion in the alert dialog

### Viewing Summary
- The top of the dashboard shows:
  - Total income earned
  - Total expenses spent
  - Current balance (income - expenses)
- The right sidebar displays a breakdown of transactions by category

## Data Storage

All transactions are stored in your browser's localStorage. This means:
- Data persists across browser sessions
- Each browser/device has its own data
- Data is not synced to the cloud
- Clearing browser data will remove all transactions

To add cloud persistence, you can integrate with:
- Supabase (PostgreSQL)
- Firebase (Cloud Firestore)
- MongoDB
- Any other backend database service

## Validation

The application includes comprehensive client-side validation:
- Amount must be a positive number
- Category must be selected
- Description is required (max 200 characters)
- Date must be in the past or today
- All fields are validated in real-time

## Accessibility

- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Sufficient color contrast
- Focus management in dialogs

## Future Enhancements

Potential features for future versions:
- Date range filtering
- Chart visualizations (pie/bar charts)
- Search and advanced filtering
- Pagination for large transaction lists
- Budget tracking and alerts
- Recurring transactions
- CSV export functionality
- User authentication (JWT/sessions)
- Backend API with database persistence
- Unit and integration tests
- Performance optimizations

## License

This project is open source and available under the MIT License.
