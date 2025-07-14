import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import { 
  Link as LinkIcon,
  Schedule as ScheduleIcon,
  Mouse as MouseIcon,
  Language as LanguageIcon 
} from '@mui/icons-material';
import Log from '../../../LoggingMiddleware/logging';

const URLStatistics = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
      const statsData = Object.values(urlMappings);
      setStats(statsData);
      Log("frontend", "info", "component", `Statistics page loaded with ${statsData.length} URLs`);
    } catch (error) {
      Log("frontend", "error", "component", `Error loading statistics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiryDate) => {
    return new Date() > new Date(expiryDate);
  };

  const getStatusColor = (expiryDate) => {
    if (isExpired(expiryDate)) return 'error';
    const timeLeft = new Date(expiryDate) - new Date();
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    if (hoursLeft < 1) return 'warning';
    return 'success';
  };

  const getStatusText = (expiryDate) => {
    if (isExpired(expiryDate)) return 'Expired';
    const timeLeft = new Date(expiryDate) - new Date();
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m left`;
    } else {
      return `${minutesLeft}m left`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          p: 4, 
          bgcolor: 'background.paper', 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
            📊 Loading Statistics...
          </Typography>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            border: '4px solid #e3f2fd',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            mx: 'auto',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />
        </Box>
      </Box>
    );
  }

  if (stats.length === 0) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ 
          p: { xs: 3, md: 5 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxWidth: 600,
          mx: 'auto'
        }}>
          <Typography variant="h3" gutterBottom sx={{ 
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            📊 URL Statistics
          </Typography>
          
          <Box sx={{ fontSize: '4rem', mb: 2 }}>📈</Box>
          
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              fontSize: '1.1rem',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            No shortened URLs found. Create some URLs first to see statistics here!
          </Alert>
          
          <Button 
            variant="contained" 
            href="/"
            sx={{ 
              mt: 3,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              borderRadius: 3,
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            🔗 Create Short URLs
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
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
          📊 URL Statistics
        </Typography>
        
        <Typography variant="h6" sx={{ 
          mb: 2, 
          color: 'text.secondary',
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}>
          Analytics and performance overview
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Track clicks, monitor performance, and analyze your shortened URLs
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '1px solid rgba(25, 118, 210, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                {stats.length}
              </Typography>
              <Typography variant="body2" color="primary.dark">
                Total URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                {stats.reduce((total, stat) => total + (stat.clicks || 0), 0)}
              </Typography>
              <Typography variant="body2" color="success.dark">
                Total Clicks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
            border: '1px solid rgba(255, 152, 0, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                {stats.filter(stat => !isExpired(stat.expiry)).length}
              </Typography>
              <Typography variant="body2" color="warning.dark">
                Active URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
            border: '1px solid rgba(233, 30, 99, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                {stats.filter(stat => isExpired(stat.expiry)).length}
              </Typography>
              <Typography variant="body2" color="secondary.dark">
                Expired URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(25, 118, 210, 0.1)',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
              },
              transition: 'all 0.3s ease',
            }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <LinkIcon sx={{ mr: 1, color: 'primary.main', fontSize: '1.5rem' }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontFamily: 'monospace',
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: { xs: '1.2rem', md: '1.5rem' }
                      }}
                    >
                      /{stat.shortcode}
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusText(stat.expiry)}
                    color={getStatusColor(stat.expiry)}
                    size="medium"
                    sx={{ 
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        px: 2
                      }
                    }}
                  />
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        📎 Original URL:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          wordBreak: 'break-all',
                          bgcolor: 'grey.50',
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                      >
                        {stat.longURL}
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'primary.light', 
                          borderRadius: 2,
                          color: 'white',
                          textAlign: 'center'
                        }}>
                          <ScheduleIcon sx={{ mb: 1, fontSize: '1.5rem' }} />
                          <Typography variant="body2" gutterBottom>
                            Created:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDate(stat.created)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: getStatusColor(stat.expiry) === 'error' ? 'error.light' : 
                                  getStatusColor(stat.expiry) === 'warning' ? 'warning.light' : 'success.light',
                          borderRadius: 2,
                          color: 'white',
                          textAlign: 'center'
                        }}>
                          <ScheduleIcon sx={{ mb: 1, fontSize: '1.5rem' }} />
                          <Typography variant="body2" gutterBottom>
                            Expires:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDate(stat.expiry)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 3, 
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      borderRadius: 3,
                      color: 'white',
                      boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
                    }}>
                      <MouseIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {stat.clicks || 0}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Total Clicks
                      </Typography>
                      {stat.clicks > 0 && (
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                          {((stat.clicks || 0) / Math.max(1, stats.reduce((total, s) => total + (s.clicks || 0), 0)) * 100).toFixed(1)}% of total
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                {stat.clickData && stat.clickData.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'primary.main',
                      mb: 2
                    }}>
                      📊 Click Details
                    </Typography>
                    <TableContainer 
                      component={Paper} 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                              ⏰ Timestamp
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                              🔗 Source
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                              🌍 Location
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stat.clickData.slice(-10).reverse().map((click, clickIndex) => (
                            <TableRow 
                              key={clickIndex}
                              sx={{ 
                                '&:nth-of-type(odd)': { 
                                  backgroundColor: 'rgba(25, 118, 210, 0.02)' 
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                }
                              }}
                            >
                              <TableCell sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                                {formatDate(click.timestamp)}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={click.source || 'Direct'} 
                                  size="small" 
                                  variant="outlined"
                                  color="primary"
                                  sx={{ fontWeight: 500 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LanguageIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                                  <Typography variant="body2">
                                    {click.location || 'Unknown'}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {stat.clickData.length > 10 && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 2, 
                          textAlign: 'center', 
                          color: 'text.secondary',
                          fontStyle: 'italic'
                        }}
                      >
                        📈 Showing latest 10 clicks out of {stat.clickData.length} total
                      </Typography>
                    )}
                  </Box>
                )}

                {(!stat.clickData || stat.clickData.length === 0) && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: '1.5rem'
                      }
                    }}
                  >
                    🔍 No clicks recorded yet for this URL. Share it to start tracking!
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default URLStatistics;