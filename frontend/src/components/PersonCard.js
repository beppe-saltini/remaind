import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Cake as CakeIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const PersonCard = ({ person }) => {
  const navigate = useNavigate();
console.log('PersonCard rendered for:', person?.name);
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRelationshipColor = (relationship) => {
    const colors = {
      friend: 'primary',
      family: 'secondary',
      colleague: 'default',
      partner: 'error'
    };
    return colors[relationship?.toLowerCase()] || 'default';
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== CARD CLICKED ===');
    console.log('Full person object:', person);
    console.log('Person name:', person.name);
    console.log('Person id:', person.id);
    console.log('Person uri:', person.uri);
    
    // Try multiple ways to get person identifier
    let personId = null;
    
    if (person.id) {
      personId = person.id;
    } else if (person.uri) {
      personId = person.uri.split('/').pop();
    } else if (person.name) {
      // For Giuseppe, this should create 'giuseppe'
      personId = person.name.toLowerCase().split(' ')[0];
    }
    
    console.log('Final personId for navigation:', personId);
    
    if (personId) {
      console.log(`Navigating to: /persons/${personId}`);
      navigate(`/persons/${personId}`);
    } else {
      console.error('Could not determine person ID for navigation');
      alert('Cannot navigate - no person ID found');
    }
  };

  if (!person) {
    return null;
  }

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        m: 1, 
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: 6,
          borderColor: 'primary.main'
        },
        border: '1px solid',
        borderColor: 'grey.200'
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
            {getInitials(person.name)}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h6" component="div" fontWeight="bold">
              {person.name || 'Unknown Name'}
            </Typography>
            {(person.relationship || person.familyRole) && (
              <Chip
                label={person.relationship || person.familyRole || 'No Role'}
                size="small"
                color={getRelationshipColor(person.relationship || person.familyRole)}
                variant="outlined"
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>
        </Box>

        {person.email && (
          <Box display="flex" alignItems="center" mb={1}>
            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {person.email}
            </Typography>
          </Box>
        )}

        {person.birthday && (
          <Box display="flex" alignItems="center">
            <CakeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(person.birthday)}
            </Typography>
          </Box>
        )}

        {/* Debug info - you can remove this later */}
        <Box mt={2} p={1} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="caption" color="text.secondary">
            Debug: ID={person.id || 'none'} | URI={person.uri || 'none'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PersonCard;