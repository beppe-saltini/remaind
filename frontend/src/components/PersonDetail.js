import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Cake as CakeIcon,
  ArrowBack as ArrowBackIcon,
  People as FamilyIcon,  // ← Changed to People
  Edit as EditIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  Call as CallIcon,
  Message as MessageIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPersonData();
  }, [id]);

  const loadPersonData = async () => {
    try {
      setLoading(true);
      console.log('Loading person:', id); // Debug log
      
      const response = await fetch(`http://localhost:4000/api/persons/${id}`);
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Person data received:', data); // Debug log
      
      if (data.success) {
        setPerson(data.data);
      } else {
        throw new Error(data.error || 'Failed to load person');
      }
    } catch (err) {
      console.error('Error loading person:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRelationshipColor = (type) => {
    const colors = {
      spouse: 'error',
      parent: 'primary',
      child: 'secondary', 
      sibling: 'success'
    };
    return colors[type] || 'default';
  };

  const getRelationshipIcon = (type) => {
    const icons = {
      spouse: '💑',
      parent: '👨‍👩‍👧‍👦',
      child: '👶',
      sibling: '👫'
    };
    return icons[type] || '👤';
  };

  const getRoleColor = (role) => {
    const colors = {
      father: '#1976d2',
      mother: '#d32f2f', 
      daughter: '#9c27b0',
      son: '#388e3c'
    };
    return colors[role] || theme.palette.primary.main;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading person: {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/persons')}
          variant="contained"
        >
          Back to Persons List
        </Button>
      </Container>
    );
  }

  if (!person) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Alert severity="warning">Person not found</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'grey.50',
      pb: 4
    }}>
      {/* Header Bar */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'grey.200',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" py={2}>
            <IconButton 
              onClick={() => navigate('/persons')}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Person Details
            </Typography>
            <IconButton color="primary">
              <ShareIcon />
            </IconButton>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ mt: 0 }}>
        {/* Hero Section */}
        <Fade in timeout={600}>
          <Paper 
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${getRoleColor(person.role || person.familyRole)}15 0%, ${getRoleColor(person.role || person.familyRole)}25 100%)`,
              borderRadius: 3,
              overflow: 'hidden',
              mb: 3,
              mt: 3
            }}
          >
            <Box p={4}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm="auto">
                  <Box display="flex" justifyContent={isSmall ? 'center' : 'flex-start'}>
                    <Avatar 
                      sx={{ 
                        width: { xs: 100, sm: 120, md: 140 },
                        height: { xs: 100, sm: 120, md: 140 },
                        bgcolor: getRoleColor(person.role || person.familyRole),
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 'bold',
                        boxShadow: 4
                      }}
                    >
                      {getInitials(person.name)}
                    </Avatar>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm>
                  <Box textAlign={isSmall ? 'center' : 'left'}>
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        mb: 1,
                        color: 'grey.900'
                      }}
                    >
                      {person.name}
                    </Typography>
                    
                    <Stack 
                      direction={isSmall ? "column" : "row"} 
                      spacing={1} 
                      alignItems={isSmall ? "center" : "flex-start"}
                      sx={{ mb: 2 }}
                    >
                      <Chip 
                        label={person.role || person.familyRole || 'Family Member'} 
                        sx={{
                          bgcolor: getRoleColor(person.role || person.familyRole),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          height: 32
                        }}
                      />
                      <Chip 
                        label={person.gender === 'M' ? 'Male' : 'Female'} 
                        variant="outlined"
                        sx={{ height: 32 }}
                      />
                      {(person.age || person.birthday) && (
                        <Chip 
                          label={`${calculateAge(person.birthday) || person.age} years old`}
                          variant="outlined"
                          sx={{ height: 32 }}
                        />
                      )}
                    </Stack>

                    {/* Quick Actions */}
                    <Stack direction="row" spacing={1} justifyContent={isSmall ? "center" : "flex-start"}>
                      {person.phone && (
                        <IconButton 
                          size="large"
                          sx={{ 
                            bgcolor: 'white', 
                            boxShadow: 2,
                            '&:hover': { bgcolor: 'grey.100' }
                          }}
                        >
                          <CallIcon color="primary" />
                        </IconButton>
                      )}
                      {person.email && (
                        <IconButton 
                          size="large"
                          sx={{ 
                            bgcolor: 'white', 
                            boxShadow: 2,
                            '&:hover': { bgcolor: 'grey.100' }
                          }}
                        >
                          <MessageIcon color="primary" />
                        </IconButton>
                      )}
                      <IconButton 
                        size="large"
                        sx={{ 
                          bgcolor: 'white', 
                          boxShadow: 2,
                          '&:hover': { bgcolor: 'grey.100' }
                        }}
                      >
                        <FavoriteIcon color="error" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Fade>

        {/* Contact Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Slide direction="up" in timeout={800}>
              <Card 
                elevation={2}
                sx={{ 
                  borderRadius: 3,
                  mb: 3
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Contact Information
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {person.email && (
                      <Grid item xs={12} sm={6}>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 3, 
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': { 
                              boxShadow: 4,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={1}>
                            <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="subtitle2" color="text.secondary">
                              Email
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="medium">
                            {person.email}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    <Grid item xs={12} sm={person.email ? 6 : 12}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 3, 
                          borderRadius: 2,
                          transition: 'all 0.3s',
                          '&:hover': { 
                            boxShadow: 4,
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box display="flex" alignItems="center" mb={1}>
                          <CakeIcon sx={{ mr: 2, color: 'secondary.main' }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Birthday
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(person.birthday)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Family Relationships */}
          <Grid item xs={12} md={4}>
            <Slide direction="left" in timeout={1000}>
              <Card 
                elevation={2}
                sx={{ 
                  borderRadius: 3,
                  height: 'fit-content'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <FamilyIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Family
                    </Typography>
                  </Box>
                  
                  {person.relationships && person.relationships.length > 0 ? (
                    <Stack spacing={2}>
                      {person.relationships.map((rel, index) => (
                        <Paper
                          key={index}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: 3,
                              transform: 'translateX(4px)',
                              borderColor: getRelationshipColor(rel.type) + '.main'
                            }
                          }}
                          onClick={() => navigate(`/persons/${rel.person}`)}
                        >
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                              <Box
                                sx={{
                                  fontSize: '1.5rem',
                                  mr: 2,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {getRelationshipIcon(rel.type)}
                              </Box>
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {rel.name}
                                </Typography>
                                <Chip 
                                  label={rel.type} 
                                  size="small"
                                  color={getRelationshipColor(rel.type)}
                                  variant="outlined"
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary" textAlign="center" py={4}>
                      No family relationships recorded
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Fade in timeout={1200}>
          <Box mt={4} display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate(`/persons/${id}/edit`)}
              sx={{ 
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              Edit Person
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/persons')}
              sx={{ 
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              View All Persons
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default PersonDetail;