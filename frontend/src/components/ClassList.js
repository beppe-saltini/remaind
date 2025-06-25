import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Avatar,
  Chip,
  IconButton,
  Paper,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Home as HouseIcon,
  Description as DocumentIcon,
  Group as FamilyIcon,
  Add as AddIcon
} from '@mui/icons-material';

const ClassList = () => {
  const { className } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classConfig = {
    person: {
      title: 'People',
      icon: PersonIcon,
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      apiEndpoint: '/api/persons',
      itemRoute: '/persons'
    },
    car: {
      title: 'Vehicles',
      icon: CarIcon,
      color: '#388e3c',
      gradient: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
      apiEndpoint: '/api/cars',
      itemRoute: '/cars'
    },
    house: {
      title: 'Properties',
      icon: HouseIcon,
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
      apiEndpoint: '/api/houses',
      itemRoute: '/houses'
    },
    document: {
      title: 'Documents',
      icon: DocumentIcon,
      color: '#7b1fa2',
      gradient: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)',
      apiEndpoint: '/api/documents',
      itemRoute: '/documents'
    },
    family: {
      title: 'Families',
      icon: FamilyIcon,
      color: '#d32f2f',
      gradient: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
      apiEndpoint: '/api/families',
      itemRoute: '/families'
    }
  };

  const config = classConfig[className];
  const IconComponent = config?.icon || PersonIcon;

  useEffect(() => {
    if (config) {
      loadItems();
    }
  }, [className, config]);

  const loadItems = async () => {
    try {
      setLoading(true);
      
      // For now, only person class works with your existing backend
      if (className === 'person') {
        const response = await fetch('http://localhost:4000/api/persons');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setItems(data.data || data);
      } else {
        // Mock data for other classes
        setItems([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getItemDisplayName = (item) => {
    return item.name || item.title || item.label || 'Unnamed Item';
  };

  const getItemSubtitle = (item) => {
    if (className === 'person') {
      return item.familyRole || item.relationship || 'Family Member';
    }
    return item.description || item.type || '';
  };

  const getItemId = (item) => {
    if (className === 'person') {
      return item.id || 
             item.uri?.split('/').pop() || 
             item.name?.toLowerCase().split(' ')[0];
    }
    return item.id || item.uri?.split('/').pop();
  };

  const handleItemClick = (item) => {
    const itemId = getItemId(item);
    navigate(`${config.itemRoute}/${itemId}`);
  };

  if (!config) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Unknown class: {className}
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading {config.title.toLowerCase()}: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: config.gradient,
                mr: 3
              }}
            >
              <IconComponent sx={{ fontSize: 28 }} />
            </Avatar>
            <Box flexGrow={1}>
              <Typography variant="h4" fontWeight="bold" color={config.color}>
                {config.title}
              </Typography>
              <Breadcrumbs sx={{ mt: 1 }}>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/')}
                  sx={{ textDecoration: 'none' }}
                >
                  Home
                </Link>
                <Typography variant="body2" color="text.primary">
                  {config.title}
                </Typography>
              </Breadcrumbs>
            </Box>
            <Chip
              label={`${items.length} items`}
              sx={{
                background: config.gradient,
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Paper>

        {/* Items Grid */}
        {items.length > 0 ? (
          <Grid container spacing={3}>
            {items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardActionArea onClick={() => handleItemClick(item)}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          sx={{
                            bgcolor: config.color,
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          {getItemDisplayName(item).charAt(0).toUpperCase()}
                        </Avatar>
                        <Box flexGrow={1}>
                          <Typography variant="h6" fontWeight="bold">
                            {getItemDisplayName(item)}
                          </Typography>
                          {getItemSubtitle(item) && (
                            <Chip
                              label={getItemSubtitle(item)}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      {item.email && (
                        <Typography variant="body2" color="text.secondary">
                          📧 {item.email}
                        </Typography>
                      )}
                      {item.birthday && (
                        <Typography variant="body2" color="text.secondary">
                          🎂 {new Date(item.birthday).toLocaleDateString()}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <IconComponent sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No {config.title.toLowerCase()} found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {className === 'person' 
                ? 'Your family members will appear here once added.'
                : `${config.title} functionality is coming soon.`}
            </Typography>
          </Paper>
        )}

        {/* Add Button */}
        <Fab
          color="primary"
          aria-label="add"