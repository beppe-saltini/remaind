const RDFRepository = require('./RDFRepository');

class PersonalDataRepository extends RDFRepository {
  constructor(rdfStore) {
    super();
    this.store = rdfStore;
  }

  // === PERSON OPERATIONS ===
  
  async createPerson(personData) {
    const personUri = this.generateUri('person', personData.id);
    const triples = [
      {
        subject: personUri,
        predicate: 'rdf:type',
        object: 'pd:Person'
      },
      {
        subject: personUri,
        predicate: 'foaf:name',
        object: this.formatValue(personData.name)
      }
    ];

    // Add optional fields
    if (personData.email) {
      triples.push({
        subject: personUri,
        predicate: 'foaf:mbox',
        object: this.formatValue(personData.email)
      });
    }
    
    if (personData.birthday) {
      triples.push({
        subject: personUri,
        predicate: 'pd:birthday',
        object: this.formatValue(personData.birthday, 'date')
      });
    }
    
    if (personData.relationship) {
      triples.push({
        subject: personUri,
        predicate: 'pd:relationship',
        object: this.formatValue(personData.relationship)
      });
    }

    await this.store.insert(triples);
    return personUri;
  }

  async getUpcomingBirthdays(daysAhead = 30) {
    const sparql = `
      SELECT ?name ?birthday ?relationship WHERE {
        ?person a pd:Person ;
                foaf:name ?name ;
                pd:birthday ?birthday ;
                pd:relationship ?relationship .
        
        FILTER(
          ?birthday >= NOW() && 
          ?birthday <= (NOW() + "P${daysAhead}D"^^xsd:duration)
        )
      }
      ORDER BY ?birthday
    `;
    
    return this.store.query(sparql);
  }

  // === INSURANCE OPERATIONS ===
  
  async createInsurancePolicy(policyData) {
    const policyUri = this.generateUri('policy', policyData.policyNumber);
    const insuranceType = this.getInsuranceType(policyData.type);
    
    const triples = [
      {
        subject: policyUri,
        predicate: 'rdf:type',
        object: insuranceType
      },
      {
        subject: policyUri,
        predicate: 'pd:policyNumber',
        object: this.formatValue(policyData.policyNumber)
      }
    ];

    // Add common insurance fields
    const commonFields = [
      { field: 'premium', predicate: 'pd:premium', datatype: 'decimal' },
      { field: 'renewalDate', predicate: 'pd:renewalDate', datatype: 'date' },
      { field: 'insurer', predicate: 'pd:insurer', datatype: 'string' }
    ];

    commonFields.forEach(({ field, predicate, datatype }) => {
      if (policyData[field]) {
        triples.push({
          subject: policyUri,
          predicate: predicate,
          object: this.formatValue(policyData[field], datatype)
        });
      }
    });

    // Add type-specific fields
    if (policyData.type === 'car') {
      if (policyData.vehicleModel) {
        triples.push({
          subject: policyUri,
          predicate: 'pd:vehicleModel',
          object: this.formatValue(policyData.vehicleModel)
        });
      }
      if (policyData.licensePlate) {
        triples.push({
          subject: policyUri,
          predicate: 'pd:licensePlate',
          object: this.formatValue(policyData.licensePlate)
        });
      }
    }

    if (policyData.type === 'home') {
      if (policyData.propertyAddress) {
        triples.push({
          subject: policyUri,
          predicate: 'pd:propertyAddress',
          object: this.formatValue(policyData.propertyAddress)
        });
      }
      if (policyData.propertyValue) {
        triples.push({
          subject: policyUri,
          predicate: 'pd:propertyValue',
          object: this.formatValue(policyData.propertyValue, 'decimal')
        });
      }
    }

    // Add metadata if extracted from document
    if (policyData.sourceDocument) {
      triples.push({
        subject: policyUri,
        predicate: 'pd:extractedFrom',
        object: this.formatValue(policyData.sourceDocument, 'uri')
      });
    }

    if (policyData.confidence) {
      triples.push({
        subject: policyUri,
        predicate: 'pd:confidence',
        object: this.formatValue(policyData.confidence, 'decimal')
      });
    }

    await this.store.insert(triples);
    return policyUri;
  }

  async getExpiringPolicies(daysAhead = 60) {
    const sparql = `
      SELECT ?policyType ?policyNumber ?renewalDate ?insurer WHERE {
        ?policy a ?policyType ;
                pd:policyNumber ?policyNumber ;
                pd:renewalDate ?renewalDate ;
                pd:insurer ?insurer .
        
        FILTER(?policyType != pd:InsurancePolicy)
        FILTER(?renewalDate <= (NOW() + "P${daysAhead}D"^^xsd:duration))
        FILTER(?renewalDate >= NOW())
      }
      ORDER BY ?renewalDate
    `;
    
    return this.store.query(sparql);
  }

  // === DOCUMENT OPERATIONS ===
  
  async createDocument(documentData) {
    const documentUri = this.generateUri('document', documentData.id);
    const triples = [
      {
        subject: documentUri,
        predicate: 'rdf:type',
        object: 'pd:Document'
      },
      {
        subject: documentUri,
        predicate: 'dc:title',
        object: this.formatValue(documentData.title)
      },
      {
        subject: documentUri,
        predicate: 'dct:created',
        object: this.formatValue(documentData.created || new Date().toISOString(), 'dateTime')
      }
    ];

    if (documentData.filePath) {
      triples.push({
        subject: documentUri,
        predicate: 'pd:filePath',
        object: this.formatValue(documentData.filePath)
      });
    }

    await this.store.insert(triples);
    return documentUri;
  }

  // === UTILITY METHODS ===
  
  getInsuranceType(type) {
    const typeMap = {
      'car': 'pd:CarInsurance',
      'auto': 'pd:CarInsurance',
      'home': 'pd:HomeInsurance',
      'house': 'pd:HomeInsurance',
      'health': 'pd:HealthInsurance',
      'medical': 'pd:HealthInsurance'
    };
    
    return typeMap[type.toLowerCase()] || 'pd:InsurancePolicy';
  }

  async searchByText(searchTerm) {
    const sparql = `
      SELECT DISTINCT ?subject ?predicate ?object WHERE {
        ?subject ?predicate ?object .
        FILTER(CONTAINS(LCASE(STR(?object)), LCASE("${this.escapeString(searchTerm)}")))
      }
      LIMIT 100
    `;
    
    return this.store.query(sparql);
  }

  async getAllData() {
    const sparql = `
      SELECT ?subject ?predicate ?object WHERE {
        ?subject ?predicate ?object .
      }
    `;
    
    return this.store.query(sparql);
  }
}

module.exports = PersonalDataRepository;
