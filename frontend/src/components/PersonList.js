import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PersonCard from './PersonCard';
import { personAPI } from '../services/api';

const PersonList = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [stats, setStats] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    email: '',
    birthday: '',
    relationship: ''
  });

  const relationships = ['friend', 'family', 'colleague', 'partner', 'other'];

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    setLoading(true);
    // Remove the stats call - only get persons data
    const personsResponse = await personAPI.getAll();
    
    setPersons(personsResponse.data || personsResponse);
    
    // Calculate stats from the persons data
    const personsData = personsResponse.data || personsResponse;
    const calculatedStats = {
      totalPersons: personsData.length,
      friends: personsData.filter(p => p.relationship === 'friend').length,
      family: personsData.filter(p => p.relationship === 'family' || p.familyRole).length,
      colleagues: personsData.filter(p => p.relationship === 'colleague').length,
    };
    setStats(calculatedStats);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const filterPersons = () => {
    switch (selectedTab) {
      case 0: return persons; // All
      case 1: return persons.filter(p => p.relationship === 'friend');
      case 2: return persons.filter(p => p.relationship === 'family');
      case 3: return persons.filter(p => p.relationship === 'colleague');
      default: return persons;
    }
  };

  const handleAddPerson = async () => {
    try {
      await personAPI.add(newPerson);
      setOpenDialog(false);
      setNewPerson({ name: '', email: '', birthday: '', relationship: '' });
      loadData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading persons: {error}
        </Alert>
      </Container>
    );
  }

  const filteredPersons = filterPersons();

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Personal Contacts
        </Typography>
        
        {/* Stats */}
        <Box mb={3}>
          <Typography variant="body1" color="text.secondary">
            Total: {stats.totalPersons || 0} | 
            Friends: {stats.friends || 0} | 
            Family: {stats.family || 0} | 
            Colleagues: {stats.colleagues || 0}
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label={`All (${persons.length})`} />
          <Tab label={`Friends (${persons.filter(p => p.relationship === 'friend').length})`} />
          <Tab label={`Family (${persons.filter(p => p.relationship === 'family').length})`} />
          <Tab label={`Colleagues (${persons.filter(p => p.relationship === 'colleague').length})`} />
        </Tabs>

{/* Person Grid - SIMPLE TEST WITH PROPER KEYS */}
<Grid container>
  {filteredPersons.map((person, index) => {
    const uniqueKey = person.uri || person.id || `${person.name}-${index}`;
    return (
      <Grid item xs={12} sm={6} md={4} key={uniqueKey}>
        <div 
          onClick={() => {
            console.log('=== CLICKED TEST ===');
            console.log('Person name:', person.name);
            console.log('Person object:', person);
            alert(`Clicked ${person.name}!`);
          }}
          style={{ 
            border: '3px solid red', 
            padding: '20px', 
            cursor: 'pointer',
            backgroundColor: 'yellow',
            margin: '10px',
            borderRadius: '8px'
          }}
        >
          <h2 style={{ margin: '0 0 10px 0' }}>{person.name}</h2>
          <p style={{ margin: '0' }}><strong>CLICK ME TO TEST!</strong></p>
          <small>ID: {person.id || 'none'} | URI: {person.uri || 'none'}</small>
        </div>
      </Grid>
    );
  })}
</Grid>

        {filteredPersons.length === 0 && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No persons found
            </Typography>
          </Box>
        )}

        {/* Add Person FAB */}
        <Fab
          color="primary"
          aria-label="add person"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>

        {/* Add Person Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Person</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              value={newPerson.name}
              onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={newPerson.email}
              onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Birthday"
              type="date"
              value={newPerson.birthday}
              onChange={(e) => setNewPerson({ ...newPerson, birthday: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Relationship"
              select
              value={newPerson.relationship}
              onChange={(e) => setNewPerson({ ...newPerson, relationship: e.target.value })}
            >
              {relationships.map((rel) => (
                <MenuItem key={rel} value={rel}>
                  {rel.charAt(0).toUpperCase() + rel.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPerson} variant="contained" disabled={!newPerson.name}>
              Add Person
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PersonList;
