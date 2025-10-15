# Library Management System

A modern, responsive web application for managing library operations including books, members, and loans.

## Features

- **User Authentication**: Secure login and signup for members and librarians
- **Dashboard**: Overview of library statistics with interactive charts
- **Book Management**: Add, edit, and manage book records
- **Member Management**: Manage library members
- **Loan Management**: Issue and return books, track active loans
- **Password Reset**: Secure password change functionality

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Yup validation
- **Routing**: React Router
- **HTTP Client**: Axios (via custom API utilities)
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   VITE_API_BASE_URL=https://your-api-endpoint.com/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthContext.tsx  # Authentication state management
│   ├── Header.tsx       # App header
│   ├── SideNavbar.tsx   # Navigation sidebar
│   └── Pagelayout.tsx   # Main layout wrapper
├── config/
│   └── api.ts           # API configuration and utilities
├── pages/               # Page components
│   ├── Login.tsx        # Login page
│   ├── SignupPage.tsx   # Registration page
│   ├── ResetPassword.tsx # Password reset page
│   ├── DashboardPage.tsx # Main dashboard
│   └── ...              # Other pages
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## API Integration

The app integrates with a Django REST API backend. Key endpoints include:

- Authentication: `/auth/login/`, `/auth/logout/`, `/auth/change-password/`
- Books: `/books/`, `/books/available/`
- Members: `/members/`
- Loans: `/loans/`, `/loans/active/`

## Development Guidelines

- Use TypeScript for type safety
- Follow React best practices and hooks
- Use Material-UI components for consistent UI
- Implement proper error handling and loading states
- Write clean, maintainable code with proper comments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
