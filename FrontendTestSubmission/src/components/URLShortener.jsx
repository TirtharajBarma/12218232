import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  Card, 
  CardContent, 
  IconButton,
  Grid
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import Log from '../../../LoggingMiddleware/logging';

const URLShortener = () => {
  const [urls, setUrls] = useState([{ longURL: '', validity: '', shortcode: '' }]);
  const [shortenedURLs, setShortenedURLs] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateURL = (url) => {
    try {
      const urlObj = new URL(url);
      const validProtocols = ['http:', 'https:'];
      
      if (!validProtocols.includes(urlObj.protocol)) {
        return false;
      }
      
      if (!urlObj.hostname || urlObj.hostname.length < 4) {
        return false;
      }
      
      if (!urlObj.hostname.includes('.')) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const generateShortcode = (customCode = '', existingCodes = []) => {
    if (customCode) {
      if (customCode.length < 4 || customCode.length > 10) {
        return null;
      }
      if (!/^[a-zA-Z0-9]+$/.test(customCode)) {
        return null;
      }
      if (existingCodes.includes(customCode)) {
        return null;
      }
      return customCode;
    }
    
    let code;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      code = Math.random().toString(36).substr(2, 6);
      attempts++;
    } while (existingCodes.includes(code) && attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
      code = Date.now().toString(36).substr(-6);
    }
    
    return code;
  };

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);

    const newErrors = { ...errors };
    delete newErrors[`${index}-${field}`];
    setErrors(newErrors);
  };

  const addURL = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longURL: '', validity: '', shortcode: '' }]);
    }
  };

  const removeURL = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    let isValid = true;

    urls.forEach((url, index) => {
      if (!url.longURL.trim()) {
        newErrors[`${index}-longURL`] = 'URL is required';
        isValid = false;
      } else {
        let urlToValidate = url.longURL.trim();
        if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
          urlToValidate = 'https://' + urlToValidate;
        }
        
        if (!validateURL(urlToValidate)) {
          newErrors[`${index}-longURL`] = 'Please enter a valid URL (e.g., https://example.com)';
          isValid = false;
        } else {
          const newUrls = [...urls];
          newUrls[index].longURL = urlToValidate;
          setUrls(newUrls);
        }
      }

      if (url.validity) {
        const validityNum = parseInt(url.validity);
        if (isNaN(validityNum) || validityNum <= 0 || validityNum > 10080) { // Max 1 week
          newErrors[`${index}-validity`] = 'Validity must be between 1 and 10080 minutes (1 week max)';
          isValid = false;
        }
      }

      if (url.shortcode) {
        if (url.shortcode.length < 4 || url.shortcode.length > 10) {
          newErrors[`${index}-shortcode`] = 'Shortcode must be 4-10 characters';
          isValid = false;
        } else if (!/^[a-zA-Z0-9]+$/.test(url.shortcode)) {
          newErrors[`${index}-shortcode`] = 'Shortcode can only contain letters and numbers';
          isValid = false;
        }
      }
    });

    const customCodes = urls.filter(url => url.shortcode).map(url => url.shortcode);
    const duplicates = customCodes.filter((code, index) => customCodes.indexOf(code) !== index);
    if (duplicates.length > 0) {
      urls.forEach((url, index) => {
        if (duplicates.includes(url.shortcode)) {
          newErrors[`${index}-shortcode`] = 'Duplicate shortcode - must be unique';
          isValid = false;
        }
      });
    }

    const urlsToCheck = urls.map(url => url.longURL.trim().toLowerCase());
    const duplicateUrls = urlsToCheck.filter((url, index) => urlsToCheck.indexOf(url) !== index);
    if (duplicateUrls.length > 0) {
      urls.forEach((url, index) => {
        if (duplicateUrls.includes(url.longURL.trim().toLowerCase())) {
          newErrors[`${index}-longURL`] = 'Duplicate URL - each URL must be unique';
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      Log("frontend", "error", "component", "Form validation failed");
      return;
    }

    setIsSubmitting(true);

    try {
      const existingMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
      const existingCodes = Object.keys(existingMappings);

      const newShortened = [];
      
      for (const url of urls) {
        const shortcode = generateShortcode(url.shortcode, [...existingCodes, ...newShortened.map(s => s.shortcode)]);
        
        if (!shortcode) {
          setErrors(prev => ({
            ...prev,
            general: 'Failed to generate unique shortcode. Please try again.'
          }));
          setIsSubmitting(false);
          return;
        }

        const validityMinutes = url.validity ? parseInt(url.validity) : 30;
        const expiryDate = new Date(Date.now() + validityMinutes * 60000);

        const shortenedURL = {
          longURL: url.longURL,
          shortcode: shortcode,
          created: new Date().toISOString(),
          expiry: expiryDate.toISOString(),
          clicks: 0,
          clickData: []
        };

        newShortened.push(shortenedURL);
        existingMappings[shortcode] = shortenedURL;
      }

      localStorage.setItem('urlMappings', JSON.stringify(existingMappings));
      
      setShortenedURLs(newShortened);
      
      newShortened.forEach(url => 
        Log("frontend", "info", "component", `Shortened ${url.longURL} to ${url.shortcode}`)
      );

      setUrls([{ longURL: '', validity: '', shortcode: '' }]);
      setErrors({});

    } catch (error) {
      Log("frontend", "error", "component", `Error shortening URLs: ${error.message}`);
      setErrors({ general: 'An error occurred while shortening URLs. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: { xs: 3, md: 4 },
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <Typography variant="h3" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          fontSize: { xs: '2rem', md: '3rem' }
        }}>
          🔗 URL Shortener
        </Typography>
        
        <Typography variant="h6" sx={{ 
          mb: 2, 
          color: 'text.secondary',
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}>
          Transform your long URLs into short, shareable links
        </Typography>
        
        <Typography variant="body1" sx={{ 
          color: 'text.secondary',
          maxWidth: 600,
          mx: 'auto'
        }}>
          Shorten up to 5 URLs at once with custom shortcodes and validity periods. 
          Default validity is 30 minutes if not specified.
        </Typography>
      </Box>

      {errors.general && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)'
          }}
        >
          {errors.general}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        {urls.map((url, index) => (
          <Card 
            key={index} 
            sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(25, 118, 210, 0.1)',
              '&:hover': {
                borderColor: 'primary.main',
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                flexWrap: { xs: 'wrap', md: 'nowrap' }
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    flexGrow: 1, 
                    color: 'primary.main',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    mb: { xs: 1, md: 0 }
                  }}
                >
                  URL #{index + 1}
                </Typography>
                <IconButton
                  onClick={() => removeURL(index)}
                  disabled={urls.length === 1}
                  color="error"
                  size="small"
                  sx={{ 
                    bgcolor: urls.length > 1 ? 'error.light' : 'transparent',
                    color: urls.length > 1 ? 'white' : 'disabled',
                    '&:hover': {
                      bgcolor: urls.length > 1 ? 'error.main' : 'transparent',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Long URL *"
                    value={url.longURL}
                    onChange={(e) => handleInputChange(index, 'longURL', e.target.value)}
                    fullWidth
                    error={!!errors[`${index}-longURL`]}
                    helperText={errors[`${index}-longURL`] || 'Enter the URL you want to shorten'}
                    placeholder="https://example.com/very-long-url"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(25, 118, 210, 0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Validity (minutes)"
                    value={url.validity}
                    onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                    fullWidth
                    type="number"
                    error={!!errors[`${index}-validity`]}
                    helperText={errors[`${index}-validity`] || 'Default: 30 minutes'}
                    placeholder="30"
                    variant="outlined"
                    InputProps={{
                      inputProps: { min: 1, max: 10080 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Custom Shortcode"
                    value={url.shortcode}
                    onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
                    fullWidth
                    error={!!errors[`${index}-shortcode`]}
                    helperText={errors[`${index}-shortcode`] || 'Optional: 4-10 characters'}
                    placeholder="mycode123"
                    variant="outlined"
                    InputProps={{
                      inputProps: { maxLength: 10 }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center'
        }}>
          <Button
            onClick={addURL}
            startIcon={<AddIcon />}
            disabled={urls.length >= 5}
            variant="outlined"
            size="large"
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' },
              borderRadius: 3,
              py: 1.5,
              px: 3,
              background: urls.length < 5 ? 'linear-gradient(45deg, #e3f2fd, #bbdefb)' : 'transparent',
              borderColor: 'primary.main',
              '&:hover': {
                background: urls.length < 5 ? 'linear-gradient(45deg, #bbdefb, #90caf9)' : 'transparent',
                transform: urls.length < 5 ? 'translateY(-2px)' : 'none',
              }
            }}
          >
            Add URL ({urls.length}/5)
          </Button>
          
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            size="large"
            sx={{ 
              minWidth: { xs: '100%', sm: 200 },
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              borderRadius: 3,
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #bdbdbd, #e0e0e0)',
              }
            }}
          >
            {isSubmitting ? '🔄 Shortening...' : '✨ Shorten URLs'}
          </Button>
        </Box>
      </Box>

      {shortenedURLs.length > 0 && (
        <Card sx={{ 
          background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
          border: '2px solid rgba(76, 175, 80, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(76, 175, 80, 0.15)',
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                color: 'success.dark',
                fontWeight: 600,
                fontSize: { xs: '1.3rem', md: '1.5rem' }
              }}>
                🎉 Successfully Shortened URLs!
              </Typography>
              <Typography variant="body1" color="success.dark">
                Your URLs are ready to share
              </Typography>
            </Box>
            
            {shortenedURLs.map((url, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 2, 
                  p: { xs: 2, md: 3 }, 
                  bgcolor: 'white', 
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Original URL:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        wordBreak: 'break-all',
                        bgcolor: 'grey.50',
                        p: 1.5,
                        borderRadius: 1,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        mb: 2
                      }}
                    >
                      {url.longURL}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Short URL:
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1
                    }}>
                      <Box 
                        component="span" 
                        sx={{ 
                          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          color: 'white',
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontFamily: 'monospace',
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          fontWeight: 500,
                          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                        }}
                      >
                        {window.location.origin}/{url.shortcode}
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/${url.shortcode}`);
                        }}
                        sx={{ ml: 1 }}
                      >
                        📋 Copy
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      textAlign: { xs: 'left', md: 'center' },
                      p: 2,
                      bgcolor: 'primary.light',
                      color: 'white',
                      borderRadius: 2,
                    }}>
                      <Typography variant="body2" gutterBottom>
                        ⏰ Expires:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(url.expiry).toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default URLShortener;