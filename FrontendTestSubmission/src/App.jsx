import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import URLShortener from './components/URLShortener';
import URLStatistics from './components/URLStatistics';
import { Container, AppBar, Toolbar, Typography, Button, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Log from '../../LoggingMiddleware/logging';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

function App() {
  React.useEffect(() => {
    Log("frontend", "info", "app", "Application started");
  }, []);

  const handleRedirect = (shortcode) => {
    try {
      const urlMap = JSON.parse(localStorage.getItem('urlMappings') || '{}');
      const urlData = urlMap[shortcode];
      
      if (urlData) {
        if (urlData.expiry && new Date() > new Date(urlData.expiry)) {
          Log("frontend", "warning", "redirect", `Shortcode ${shortcode} has expired`);
          return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 4, 
                bgcolor: 'background.paper', 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}>
                <Typography variant="h4" color="warning.main" sx={{ mb: 2 }}>
                  ⏰ Link Expired
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  This short link has expired and is no longer valid.
                </Typography>
                <Button 
                  variant="contained" 
                  href="/"
                  sx={{ mt: 3 }}
                >
                  Create New Short Link
                </Button>
              </Box>
            </Container>
          );
        }
        
        const clickData = {
          timestamp: new Date().toISOString(),
          source: document.referrer || 'direct',
          location: 'Unknown', 
          userAgent: navigator.userAgent
        };
        
        // Update click count and data
        urlData.clicks = (urlData.clicks || 0) + 1;
        urlData.clickData = urlData.clickData || [];
        urlData.clickData.push(clickData);
        
        // Save back to storage
        urlMap[shortcode] = urlData;
        localStorage.setItem('urlMappings', JSON.stringify(urlMap));
        
        Log("frontend", "info", "redirect", `Redirecting ${shortcode} to ${urlData.longURL} (Click #${urlData.clicks})`);
        
        setTimeout(() => {
          window.location.href = urlData.longURL;
        }, 2000);
        
        return (
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 4, 
              bgcolor: 'background.paper', 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
                🚀 Redirecting...
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, wordBreak: 'break-all' }}>
                Taking you to: {urlData.longURL}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                You will be redirected in 2 seconds.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => window.location.href = urlData.longURL}
                sx={{ mr: 2 }}
              >
                Go Now
              </Button>
              <Button 
                variant="text" 
                href="/"
              >
                Cancel
              </Button>
            </Box>
          </Container>
        );
      } else {
        Log("frontend", "error", "redirect", `Invalid shortcode attempted: ${shortcode}`);
        return (
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 4, 
              bgcolor: 'background.paper', 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h4" color="error.main" sx={{ mb: 2 }}>
                ❌ Invalid Short Link
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                The requested short link "{shortcode}" does not exist or has been removed.
              </Typography>
              <Button 
                variant="contained" 
                href="/"
                sx={{ mr: 2 }}
              >
                Create Short Link
              </Button>
              <Button 
                variant="outlined" 
                href="/stats"
              >
                View Statistics
              </Button>
            </Box>
          </Container>
        );
      }
    } catch (error) {
      Log("frontend", "error", "redirect", `Error during redirect: ${error.message}`);
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box sx={{ 
            textAlign: 'center', 
            p: 4, 
            bgcolor: 'background.paper', 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h4" color="error.main" sx={{ mb: 2 }}>
              ⚠️ Error
            </Typography>
            <Typography variant="body1" color="text.secondary">
              An error occurred while processing your request. Please try again.
            </Typography>
            <Button 
              variant="contained" 
              href="/"
              sx={{ mt: 3 }}
            >
              Go Home
            </Button>
          </Box>
        </Container>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
          <AppBar 
            position="static" 
            sx={{ 
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                🔗 URL Shortener
              </Typography>
              <Button 
                color="inherit" 
                href="/" 
                sx={{ 
                  mx: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }
                }}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                href="/stats"
                sx={{ 
                  mx: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }
                }}
              >
                Statistics
              </Button>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<URLShortener />} />
              <Route path="/stats" element={<URLStatistics />} />
              <Route 
                path="/:shortcode" 
                element={<RedirectComponent onRedirect={handleRedirect} />} 
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

const RedirectComponent = ({ onRedirect }) => {
  const shortcode = window.location.pathname.slice(1);
  return onRedirect(shortcode);
};

export default App;