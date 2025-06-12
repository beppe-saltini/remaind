const express = require('express');
const personController = require('../controllers/personController');

const router = express.Router();

// GET routes
router.get('/', personController.getAllPersons.bind(personController));
router.get('/stats', personController.getPersonStats.bind(personController));
router.get('/birthdays', personController.getUpcomingBirthdays.bind(personController));
router.get('/relationship/:relationship', personController.getPersonsByRelationship.bind(personController));

// POST routes
router.post('/', personController.addPerson.bind(personController));

module.exports = router;
