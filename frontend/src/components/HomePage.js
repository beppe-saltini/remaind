import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Fade,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Home as HouseIcon,
  Description as DocumentIcon,
  Group as FamilyIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  TrendingUp as StatsIcon
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Mock stats for now - you can replace with real API calls
      const mockStats = {
        persons: 4,
        cars: 0,
        houses: 0,
        documents: 0,
        families: 1
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const ontologyClasses = [
    {
      id: 'person',
      title: 'People',
      description: 'Manage family members, contacts, and relationships',
      icon: PersonIcon,
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      count: stats.persons || 0,
      route: '/class/person'
    },
    {
      id: 'car',
      title: 'Vehicles',
      description: 'Track cars, maintenance, and ownership details',
      icon: CarIcon,
      color: '#388e3c',
      gradient: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
      count: stats.cars || 0,
      route: '/class/car'
    },
    {
      id: 'house',
      title: 'Properties',
      description: 'Manage houses, addresses, and property information',
      icon: HouseIcon,
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
      count: stats.houses || 0,
      route: '/class/house'
    },
    {
      id: 'document',
      title: 'Documents',
      description: 'Store and organize important documents and files',
      icon: DocumentIcon,
      color: '#7b1fa2',
      gradient: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)',
      count: stats.documents || 0,
      route: '/class/document'
    },
    {
      id: 'family',
      title: 'Families',
      description: 'Family units and household information',
      icon: FamilyIcon,
      color: '#d32f2f',
      gradient: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
      count: stats.families || 0,
      route: '/class/family'
    }
  ];

  const handleClassClick = (classItem) => {
    navigate(classItem.route);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      {/* Header */}
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>