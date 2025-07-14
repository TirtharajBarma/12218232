# URL Shortener

A modern, responsive URL shortener application built with React and Material-UI.

## Features

- **URL Shortening**: Create short URLs for long links with custom 6-character codes
- **Multiple URLs**: Support for up to 5 concurrent URLs
- **URL Statistics**: View click analytics and performance metrics
- **Responsive Design**: Mobile-first design with Material-UI components
- **URL Validation**: Comprehensive validation for various URL formats
- **Click Tracking**: Real-time click tracking with redirect handling
- **Logging Integration**: Assignment-compliant logging middleware

## Tech Stack

- **Frontend**: React 19, Material-UI v7, React Router v7
- **Build Tool**: Vite
- **Styling**: Material-UI (only permitted CSS library)
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Development Server**: Configured for localhost:3000

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Fill in your authentication token and other required values in the `.env` file.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:3000

4. **Build for Production**
   ```bash
   npm run build
   ```

## Environment Variables

The following environment variables are required:

- `VITE_AUTH_TOKEN`: Bearer token for logging API authentication
- `VITE_LOG_API_URL`: API endpoint for logging (default: http://20.244.56.144/evaluation-service/logs)
- `VITE_DEV_MODE`: Enable development mode logging (default: true)

## Project Structure

```
src/
├── components/
│   ├── URLShortener.jsx    # Main URL shortening interface
│   └── URLStatistics.jsx   # Analytics dashboard
├── App.jsx                 # Main application with routing
├── main.jsx               # Application entry point
└── assets/                # Static assets
```

## Assignment Compliance

✅ React-based frontend application
✅ Material-UI for styling (only permitted CSS library)
✅ Support for up to 5 concurrent URLs
✅ 6-character short code generation
✅ URL validation and error handling
✅ Click tracking and analytics
✅ Responsive mobile design
✅ Logging middleware integration
✅ localhost:3000 development server

## Key Components

### URLShortener
- URL input with comprehensive validation
- Short code generation and display
- Copy-to-clipboard functionality
- Mobile-responsive grid layout

### URLStatistics
- Click analytics dashboard
- Real-time status indicators
- Detailed click tracking tables
- Performance metrics overview

### Logging Middleware
- Assignment-compliant API integration
- Input validation for all parameters
- Bearer token authentication
- Environment variable configuration

## Development Notes

- Uses React Router v7 for client-side routing
- Implements proper error boundaries and validation
- Follows Material-UI design principles
- Optimized for mobile-first responsive design
- Integrated with evaluation service logging API
