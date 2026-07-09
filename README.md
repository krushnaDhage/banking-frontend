# Banking Frontend
![Frontend CI](https://github.com/krushnaDhage/banking-frontend/actions/workflows/frontend-ci.yml/badge.svg)

A modern, responsive frontend for a full-stack Banking Transaction System built with React, Redux Toolkit, Tailwind CSS, Axios, React Router, and Vite.

The application integrates with a Spring Boot REST API and provides JWT-based authentication, protected routes, bank account management, deposits, withdrawals, fund transfers, balance synchronization, and paginated transaction history.

## Features

- User registration
- User login
- JWT-based authentication
- Redux Toolkit authentication state management
- Authentication persistence using localStorage
- Protected routes
- Automatic JWT attachment using Axios
- Banking dashboard
- Total balance summary
- Active account summary
- SAVINGS and CURRENT account creation
- View authenticated user's accounts
- Deposit money
- Withdraw money
- Transfer funds between accounts
- Sender and receiver balance synchronization after transfers
- Transaction history
- Paginated transaction history
- Responsive transaction tables and mobile cards
- Loading states
- API error handling
- Success feedback
- Responsive dark banking interface
- Tailwind CSS styling

## Tech Stack

### Core

- React
- JavaScript
- Vite

### State Management

- Redux Toolkit
- React Redux

### Routing

- React Router

### API Communication

- Axios

### Styling

- Tailwind CSS

### Backend Integration

- Spring Boot REST API
- Spring Security
- JWT Authentication
- MySQL

## Application Architecture

```text
Browser
   |
   v
React Application
   |
   +-----------------------------+
   |                             |
   v                             v
React Router                 Redux Store
   |                             |
   v                             v
Public Routes                Auth State
   |                         JWT Token
   |                         User Data
   |
   +--> /login
   |
   +--> /register

Protected Route
   |
   v
/dashboard
   |
   +--> Account Creation
   |
   +--> Account Management
   |       |
   |       +--> Deposit
   |       |
   |       +--> Withdraw
   |
   +--> Fund Transfer
   |
   +--> Transaction History
   |
   v
Axios Instance
   |
   +--> Attach JWT Token
   |
   v
Spring Boot REST API
```

## Authentication Flow

```text
User Login
    |
    v
POST /api/auth/login
    |
    v
Backend validates credentials
    |
    v
JWT returned to frontend
    |
    v
loginSuccess Redux action
    |
    v
Authentication state updated
    |
    v
JWT and user information persisted
    |
    v
Navigate to /dashboard
    |
    v
ProtectedRoute verifies authentication
    |
    v
Dashboard access granted
```

## Transfer Synchronization Flow

A fund transfer modifies two bank accounts.

```text
User submits transfer
        |
        v
POST /api/accounts/transfer
        |
        v
Backend transaction completes
        |
        +---------------------+
        |                     |
        v                     v
Sender Balance          Receiver Balance
Decreased               Increased
        |                     |
        +----------+----------+
                   |
                   v
Frontend calls GET /api/accounts/my
                   |
                   v
Replace accounts state with latest data
                   |
                   v
Sender and receiver balances update
                   |
                   v
Refresh transaction history
```

This refetch strategy prevents stale receiver balances when the transfer endpoint returns only the updated sender account.

## Project Structure

```text
src
|
+-- api
|   +-- axiosInstance.js
|
+-- components
|   +-- AccountActions.jsx
|   +-- CreateAccountForm.jsx
|   +-- TransactionHistory.jsx
|   +-- TransferForm.jsx
|
+-- features
|   +-- auth
|       +-- authSlice.js
|
+-- pages
|   +-- DashboardPage.jsx
|   +-- LoginPage.jsx
|   +-- RegisterPage.jsx
|
+-- routes
|   +-- ProtectedRoute.jsx
|
+-- store
|   +-- store.js
|
+-- App.jsx
+-- index.css
+-- main.jsx
```

## Main Components

### LoginPage

Handles user authentication.

Responsibilities:

- Collect login credentials
- Send login request
- Handle authentication errors
- Store authentication response in Redux
- Navigate authenticated users to the dashboard

### RegisterPage

Handles new user registration.

Responsibilities:

- Collect user registration information
- Send registration request
- Display API validation errors
- Redirect successful registration to login

### DashboardPage

Acts as the main orchestration layer for authenticated banking operations.

Responsibilities:

- Fetch authenticated user's accounts
- Display total balance
- Display active account count
- Create accounts
- Update account state after deposits and withdrawals
- Refetch account state after transfers
- Trigger transaction-history refresh
- Handle logout

### CreateAccountForm

Creates SAVINGS or CURRENT accounts using the authenticated backend API.

### AccountActions

Handles:

- Deposits
- Withdrawals
- Amount validation
- Loading states
- API success and error feedback

### TransferForm

Handles:

- Sender account selection
- Receiver account ID input
- Transfer amount input
- Client-side transfer validation
- Transfer summary
- Transfer request
- Dashboard synchronization after successful transfer

### TransactionHistory

Handles:

- Fetching account transactions
- Pagination
- Loading states
- Empty states
- API errors
- Transaction-type presentation
- Responsive desktop tables
- Responsive mobile cards

### ProtectedRoute

Prevents unauthenticated users from accessing protected application routes.

## Routes

| Route | Access | Description |
|---|---|---|
| `/login` | Public | User login page |
| `/register` | Public | User registration page |
| `/dashboard` | Protected | Main banking dashboard |

## Backend API Integration

The frontend communicates with these backend endpoints.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Authenticate user |

### Accounts and Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts` | Create bank account |
| GET | `/api/accounts/my` | Get authenticated user's accounts |
| GET | `/api/accounts/{accountId}` | Get account details |
| PATCH | `/api/accounts/{accountId}/deposit` | Deposit funds |
| PATCH | `/api/accounts/{accountId}/withdraw` | Withdraw funds |
| POST | `/api/accounts/transfer` | Transfer funds |
| GET | `/api/accounts/{accountId}/transactions` | Get paginated transaction history |

## Prerequisites

Install:

- Node.js
- npm
- Git

The Spring Boot backend must also be running for complete application functionality.

## Running the Frontend Locally

### 1. Clone the repository

```bash
git clone <frontend-repository-url>
cd banking-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend

Configure and run the Banking Transaction System backend before using the frontend.

By default, the frontend expects the backend API configuration defined in:

```text
src/api/axiosInstance.js
```

### 4. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

## Building for Production

```bash
npm run build
```

The generated production files are created in:

```text
dist/
```

The `dist` directory is excluded from Git source control.

## Environment Configuration

For production deployment, the backend API base URL should be configured using a Vite environment variable instead of being hard-coded.

Recommended configuration:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Example `.env.example`:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Then `axiosInstance.js` can read:

```javascript
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

Do not commit real environment configuration or secrets.

## Security Considerations

The frontend currently implements:

- JWT-based authentication
- Protected client-side routes
- Authorization header attachment
- Authentication persistence
- Form validation
- Server-side API error presentation
- Disabled controls during active requests

Client-side route protection is not a security boundary. Authorization and account-ownership checks are enforced by the Spring Boot backend.

For stronger production security, future versions should consider secure HttpOnly cookies instead of long-lived JWT storage in localStorage.

## Responsive UI

The application uses Tailwind CSS to provide:

- Responsive authentication pages
- Responsive banking dashboard
- Account summary cards
- Account action panels
- Responsive transfer form
- Desktop transaction tables
- Mobile transaction cards
- Loading indicators
- Error messages
- Success feedback
- Empty states

## Current End-to-End Flow

```text
Register
   |
   v
Login
   |
   v
JWT Authentication
   |
   v
Protected Dashboard
   |
   v
Create Bank Account
   |
   +--> Deposit
   |
   +--> Withdraw
   |
   +--> Transfer Funds
   |
   v
Account Balances Synchronize
   |
   v
Transaction History Refreshes
```

## Future Improvements

- Centralized Axios response interceptor for expired JWT handling
- Standardized frontend API error handling
- Environment-based backend API URL
- Refresh-token authentication
- Password visibility toggle
- Form validation library integration
- Toast notification system
- Confirmation dialog for fund transfers
- Transaction filtering and search
- Transaction date-range filtering
- Account-number-based transfer workflow
- Skeleton loading states
- React Error Boundary
- Frontend unit tests
- Component tests
- End-to-end tests
- Docker support
- CI/CD pipeline
- Cloud deployment

## Related Backend Repository

This frontend is designed to work with the Banking Transaction System Spring Boot backend.

Backend repository:

`krushnaDhage/banking-transaction-system`

## Author

**Krushna Dhage**

Information Technology Student  
Walchand College of Engineering, Sangli

## License

This project is intended for educational and portfolio purposes.