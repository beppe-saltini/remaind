const RepositoryFactory = require('../repositories/RepositoryFactory');

class PersonController {
  constructor() {
    this.repository = RepositoryFactory.createPersonalDataRepository();
  }

  // Get all persons
  async getAllPersons(req, res) {
    try {
      const sparql = `
        SELECT ?person ?name ?email ?birthday ?relationship WHERE {
          ?person a pd:Person ;
                  foaf:name ?name .
          OPTIONAL { ?person foaf:mbox ?email }
          OPTIONAL { ?person pd:birthday ?birthday }
          OPTIONAL { ?person pd:relationship ?relationship }
        }
        ORDER BY ?name
      `;
      
      const results = await this.repository.store.query(sparql);
      
      // Group by person URI to handle multiple optional fields
      const personsMap = new Map();
      
      results.forEach(row => {
        if (!personsMap.has(row.person)) {
          personsMap.set(row.person, {
            uri: row.person,
            name: row.name,
            email: row.email || null,
            birthday: row.birthday || null,
            relationship: row.relationship || null
          });
        }
      });
      
      const persons = Array.from(personsMap.values());
      res.json({ success: true, data: persons });
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  // Get upcoming birthdays
  async getUpcomingBirthdays(req, res) {
    try {
      const daysAhead = parseInt(req.query.days) || 30;
      const results = await this.repository.getUpcomingBirthdays(daysAhead);
      
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  // Get persons by relationship type
  async getPersonsByRelationship(req, res) {
    try {
      const { relationship } = req.params;
      
      const sparql = `
        SELECT ?person ?name ?email ?birthday WHERE {
          ?person a pd:Person ;
                  foaf:name ?name ;
                  pd:relationship "${relationship}" .
          OPTIONAL { ?person foaf:mbox ?email }
          OPTIONAL { ?person pd:birthday ?birthday }
        }
        ORDER BY ?name
      `;
      
      const results = await this.repository.store.query(sparql);
      res.json({ success: true, data: results });
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  // Add new person
  async addPerson(req, res) {
    try {
      const { name, email, birthday, relationship } = req.body;
      
      if (!name) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name is required' 
        });
      }

      const personData = {
        id: Date.now().toString(),
        name,
        email: email || null,
        birthday: birthday || null,
        relationship: relationship || null
      };

      const personUri = await this.repository.createPerson(personData);
      
      res.status(201).json({ 
        success: true, 
        data: { uri: personUri, ...personData }
      });
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  // Get person stats
  async getPersonStats(req, res) {
    try {
      const sparql = `
        SELECT 
          (COUNT(DISTINCT ?person) as ?totalPersons)
          (COUNT(DISTINCT ?friend) as ?friends)
          (COUNT(DISTINCT ?family) as ?family)
          (COUNT(DISTINCT ?colleague) as ?colleagues)
        WHERE {
          ?person a pd:Person .
          OPTIONAL { 
            ?friend a pd:Person ; 
                    pd:relationship "friend" 
          }
          OPTIONAL { 
            ?family a pd:Person ; 
                    pd:relationship "family" 
          }
          OPTIONAL { 
            ?colleague a pd:Person ; 
                       pd:relationship "colleague" 
          }
        }
      `;
      
      const results = await this.repository.store.query(sparql);
      res.json({ success: true, data: results[0] || {} });
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

module.exports = new PersonController();
