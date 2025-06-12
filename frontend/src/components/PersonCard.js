import React from 'react';
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
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card sx={{ maxWidth: 345, m: 1, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {getInitials(person.name)}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h6" component="div">
              {person.name}
            </Typography>
            {person.relationship && (
              <Chip
                label={person.relationship}
                size="small"
                color={getRelationshipColor(person.relationship)}
                variant="outlined"
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
      </CardContent>
    </Card>
  );
};

export default PersonCard;
