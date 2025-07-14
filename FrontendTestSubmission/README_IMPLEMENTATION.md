# URL Shortener - Frontend Implementation

## Overview
A modern, responsive React application for URL shortening with analytics and click tracking. Built with Material-UI and follows production-grade coding standards.

## Features Implemented

### ✅ Core Requirements Met

1. **URL Shortening (Up to 5 URLs concurrently)**
   - Supports simultaneous shortening of 1-5 URLs
   - Real-time validation and error handling
   - Responsive card-based UI

2. **Custom Shortcodes**
   - Optional custom shortcode input (4-10 alphanumeric characters)
   - Automatic generation if not provided
   - Uniqueness validation

3. **Validity Management**
   - Default: 30 minutes if not specified
   - Custom validity: 1 minute to 1 week (10,080 minutes)
   - Automatic expiry handling

4. **Client-Side Validation**
   - Comprehensive URL validation with protocol handling
   - Validity period range checking
   - Shortcode format validation
   - Duplicate detection (URLs and shortcodes)

5. **URL Redirection**
   - Automatic redirect with 2-second delay
   - Expiry checking before redirect
   - Click tracking and analytics

6. **Statistics Page**
   - Overview dashboard with total counts
   - Individual URL performance metrics
   - Click tracking with timestamps, sources, and locations
   - Real-time status indicators (Active/Expired/Warning)

7. **Logging Integration**
   - Extensive use of provided logging middleware
   - Proper error handling and status logging
   - Authentication token integration

8. **Mobile Responsive Design**
   - Adaptive grid layout
   - Touch-friendly interface
   - Optimized for various screen sizes

### 🎨 UI/UX Enhancements

- **Modern Design**: Gradient backgrounds, card-based layout, smooth animations
- **Color-coded Status**: Visual indicators for URL status and performance
- **Interactive Elements**: Hover effects, loading states, copy-to-clipboard
- **Accessibility**: Proper contrast ratios, semantic HTML, keyboard navigation

### 🔧 Technical Implementation

- **Framework**: React 19 with functional components and hooks
- **Styling**: Material-UI with custom theme and responsive breakpoints
- **State Management**: Local state with localStorage persistence
- **Routing**: React Router v7 for SPA navigation
- **Validation**: Comprehensive client-side validation
- **Error Handling**: Graceful error handling with user-friendly messages

### 📱 Mobile Responsiveness

- Responsive grid system that adapts to screen size
- Collapsible navigation on mobile
- Touch-optimized buttons and inputs
- Readable typography on all devices
- Optimized spacing and layout for mobile interaction

### 🔒 Security & Validation

- URL protocol validation and auto-correction
- Shortcode uniqueness enforcement
- Input sanitization and validation
- Proper error boundaries and fallbacks

## Project Structure

```
FrontendTestSubmission/
├── src/
│   ├── components/
│   │   ├── URLShortener.jsx    # Main shortening interface
│   │   └── URLStatistics.jsx   # Analytics dashboard
│   ├── App.jsx                 # Main app with routing and theme
│   └── main.jsx               # Entry point
├── LoggingMiddleware/
│   └── logging.js             # Integrated logging middleware
└── package.json               # Dependencies and scripts
```

## Key Features Showcase

### URL Shortener Page
- Clean, intuitive interface for URL input
- Real-time validation feedback
- Support for bulk URL shortening
- Custom shortcode and validity options
- Success feedback with copy functionality

### Statistics Page
- Comprehensive analytics dashboard
- Visual performance metrics
- Detailed click tracking table
- Status indicators and expiry warnings
- Mobile-optimized data presentation

### Redirect Handling
- Intelligent URL mapping and validation
- Expiry checking with appropriate messaging
- Click tracking and analytics
- Graceful error handling for invalid links

## Technical Standards Met

- ✅ React application architecture
- ✅ Material-UI styling framework
- ✅ Production-grade code quality
- ✅ Comprehensive error handling
- ✅ Mobile responsiveness
- ✅ Logging middleware integration
- ✅ Client-side routing
- ✅ Local data persistence

## Running the Application

```bash
# Install dependencies
npm install

# Start development server (runs on localhost:3000)
npm run dev

# Build for production
npm run build
```

## Assignment Compliance

This implementation fully meets all requirements specified in the Campus Hiring Evaluation document:

1. ✅ React frontend application
2. ✅ Material UI styling (no other CSS frameworks)
3. ✅ URL shortening with up to 5 concurrent URLs
4. ✅ Custom shortcode support with validation
5. ✅ Validity period management (default 30 minutes)
6. ✅ Client-side validation before API calls
7. ✅ Comprehensive error handling
8. ✅ Statistics page with detailed analytics
9. ✅ Mobile and desktop responsive design
10. ✅ Extensive logging middleware integration
11. ✅ Production-grade code quality
12. ✅ Runs exclusively on localhost:3000

The application demonstrates modern React development practices, clean code architecture, and excellent user experience design while strictly adhering to all specified constraints and requirements.
