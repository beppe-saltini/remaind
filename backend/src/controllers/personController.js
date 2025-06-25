const RepositoryFactory = require('../repositories/RepositoryFactory');

class PersonController {
  constructor() {
    this.repository = RepositoryFactory.createPersonalDataRepository();
  }

  // Get all persons
  async getAllPersons(req, res) {
  try {
    const sparql = `
      SELECT ?person ?name ?birthday ?relationship ?role ?gender WHERE {
        ?person a <http://xmlns.com/foaf/0.1/Person> ;
                <http://xmlns.com/foaf/0.1/name> ?name .
        OPTIONAL { ?person <http://personaldata.org/ontology#birthday> ?birthday }
        OPTIONAL { ?person <http://personaldata.org/ontology#relationshipType> ?relationship }
        OPTIONAL { ?person <http://personaldata.org/ontology#familyRole> ?role }
        OPTIONAL { ?person <http://personaldata.org/ontology#gender> ?gender }
      }
    `;
    
    console.log('Executing SPARQL:', sparql); // Debug log
    const results = await this.repository.store.query(sparql);
    console.log('Query results:', results); // Debug log
    
    const persons = results.map(result => ({
      id: result.person.split('#')[1], // Extract ID from URI
      uri: result.person,
      name: result.name,
      birthday: result.birthday,
      relationship: result.relationship,
      role: result.role,
      gender: result.gender
    }));
    
    res.json({ success: true, data: persons });
    
  } catch (error) {
    console.error('Query error:', error);
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
// get person by id
async getPersonById(req, res) {
  try {
    const { id } = req.params;
    
    const sparql = `
      SELECT ?name ?birthday ?age ?gender ?role ?email ?phone ?address ?occupation WHERE {
        <http://example.com/data#${id}> a <http://xmlns.com/foaf/0.1/Person> ;
                                        <http://xmlns.com/foaf/0.1/name> ?name .
        OPTIONAL { <http://example.com/data#${id}> <http://personaldata.org/ontology#birthday> ?birthday }
        OPTIONAL { <http://example.com/data#${id}> <http://personaldata.org/ontology#age> ?age }
        OPTIONAL { <http://example.com/data#${id}> <http://personaldata.org/ontology#gender> ?gender }
        OPTIONAL { <http://example.com/data#${id}> <http://personaldata.org/ontology#familyRole> ?role }
        OPTIONAL { <http://example.com/data#${id}> <http://xmlns.com/foaf/0.1/mbox> ?email }
        OPTIONAL { <http://example.com/data#${id}> <http://personaldata.org/ontology#phone> ?phone }
        OPTIONAL { <http://example.com/data#${id}> <http://personaldata.org/ontology#address> ?address }
        OPTIONAL { <http://example.com/data#${id}> <http://personaldata.org/ontology#occupation> ?occupation }
      }
    `;
    
    const results = await this.repository.store.query(sparql);
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Person not found' 
      });
    }
    
    // Get family relationships
    const relationshipsSparql = `
      SELECT ?relationshipType ?relatedPerson ?relatedName WHERE {
        {
          <http://example.com/data#${id}> ?relationshipType ?relatedPerson .
          ?relatedPerson <http://xmlns.com/foaf/0.1/name> ?relatedName .
          FILTER(?relationshipType IN (
            <http://personaldata.org/ontology#spouse>,
            <http://personaldata.org/ontology#parent>,
            <http://personaldata.org/ontology#child>,
            <http://personaldata.org/ontology#sibling>
          ))
        }
        UNION
        {
          ?relatedPerson ?relationshipType <http://example.com/data#${id}> .
          ?relatedPerson <http://xmlns.com/foaf/0.1/name> ?relatedName .
          FILTER(?relationshipType IN (
            <http://personaldata.org/ontology#parent>,
            <http://personaldata.org/ontology#child>
          ))
        }
      }
    `;
    
    const relationships = await this.repository.store.query(relationshipsSparql);
    
    const personData = {
      id: id,
      uri: `http://example.com/data#${id}`,
      ...results[0],
      relationships: relationships.map(rel => ({
        type: rel.relationshipType.split('#')[1],
        person: rel.relatedPerson.split('#')[1],
        name: rel.relatedName
      }))
    };
    
    res.json({ success: true, data: personData });
    
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
