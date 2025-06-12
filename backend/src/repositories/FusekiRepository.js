const SparqlClient = require('sparql-http-client');
const RDFRepository = require('./RDFRepository');

class FusekiRepository extends RDFRepository {
  constructor() {
    super();
    const baseUrl = process.env.RDF_ENDPOINT || 'http://localhost:3030';
    const dataset = process.env.RDF_DATASET || 'personal-data';
    
    this.selectClient = new SparqlClient({
      endpointUrl: `${baseUrl}/${dataset}/sparql`
    });
    
    this.updateClient = new SparqlClient({
      updateUrl: `${baseUrl}/${dataset}/update`
    });
  }

  async query(sparql) {
    try {
      const fullQuery = this.buildPrefixes() + sparql;
      const stream = await this.selectClient.query.select(fullQuery);
      const results = [];
      
      return new Promise((resolve, reject) => {
        stream.on('data', (row) => {
          // Convert RDF terms to plain objects
          const cleanRow = {};
          for (const [key, value] of Object.entries(row)) {
            cleanRow[key] = value.value;
          }
          results.push(cleanRow);
        });
        stream.on('end', () => resolve(results));
        stream.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  async update(sparql) {
    try {
      const fullQuery = this.buildPrefixes() + sparql;
      await this.updateClient.query.update(fullQuery);
      return { success: true };
    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  async insert(triples) {
    if (!Array.isArray(triples) || triples.length === 0) {
      throw new Error('Triples must be a non-empty array');
    }

    const tripleStrings = triples.map(triple => {
      const subject = triple.subject.startsWith('<') ? triple.subject : `<${triple.subject}>`;
      const predicate = triple.predicate.includes(':') ? triple.predicate : `<${triple.predicate}>`;
      const object = triple.object.startsWith('<') || triple.object.startsWith('"') || triple.object.includes(':') 
        ? triple.object 
        : `"${this.escapeString(triple.object)}"`;
      
      return `${subject} ${predicate} ${object} .`;
    }).join('\n');

    const sparql = `INSERT DATA {\n${tripleStrings}\n}`;
    return this.update(sparql);
  }

  // Health check
  async isConnected() {
    try {
      await this.query('SELECT (1 as ?test) WHERE { }');
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = FusekiRepository;
