const express = require('express');
const router = express.Router();

// Simple test route first
router.get('/', async (req, res) => {
  try {
    // Return test data for now
    const testData = [
      {
        id: 'giuseppe',
        name: 'Giuseppe',
        role: 'father',
        birthday: '1973-01-08',
        relationship: 'family'
      },
      {
        id: 'simona', 
        name: 'Simona',
        role: 'mother',
        birthday: '1977-04-28',
        relationship: 'family'
      },
      {
        id: 'marta',
        name: 'Marta', 
        role: 'daughter',
        birthday: '2006-09-13',
        relationship: 'family'
      },
      {
        id: 'emma',
        name: 'Emma',
        role: 'daughter', 
        birthday: '2010-08-05',
        relationship: 'family'
      }
    ];
    
    res.json({ success: true, data: testData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Individual person route
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Test data for specific person
    const testPersons = {
      giuseppe: {
        id: 'giuseppe',
        name: 'Giuseppe',
        role: 'father',
        birthday: '1973-01-08',
        age: 52,
        gender: 'M',
        email: 'giuseppe@saltini.family',
        relationships: [
          { type: 'spouse', person: 'simona', name: 'Simona' },
          { type: 'parent', person: 'marta', name: 'Marta' },
          { type: 'parent', person: 'emma', name: 'Emma' }
        ]
      },
      simona: {
        id: 'simona',
        name: 'Simona',
        role: 'mother',
        birthday: '1977-04-28',
        age: 48,
        gender: 'F'
      },
      marta: {
        id: 'marta',
        name: 'Marta',
        role: 'daughter',
        birthday: '2006-09-13',
        age: 18,
        gender: 'F'
      },
      emma: {
        id: 'emma',
        name: 'Emma',
        role: 'daughter',
        birthday: '2010-08-05',
        age: 14,
        gender: 'F'
      }
    };
    
    const person = testPersons[id];
    if (!person) {
      return res.status(404).json({ success: false, error: 'Person not found' });
    }
    
    res.json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;