/**
 * Abstract RDF Repository - easily swappable database layer
 */
class RDFRepository {
  constructor() {
    this.prefixes = {
      pd: 'http://personaldata.org/ontology#',
      foaf: 'http://xmlns.com/foaf/0.1/',
      dc: 'http://purl.org/dc/elements/1.1/',
      dct: 'http://purl.org/dc/terms/',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#'
    };
  }

  // Abstract methods - must be implemented
  async query(sparql) {
    throw new Error('query() must be implemented');
  }

  async update(sparql) {
    throw new Error('update() must be implemented');
  }

  async insert(triples) {
    throw new Error('insert() must be implemented');
  }

  // Helper methods - shared across implementations
  buildPrefixes() {
    return Object.entries(this.prefixes)
      .map(([prefix, uri]) => `PREFIX ${prefix}: <${uri}>`)
      .join('\n') + '\n';
  }

  generateUri(type, id) {
    const baseUri = process.env.BASE_URI || 'http://example.com/data#';
    return `${baseUri}${type}_${id || Date.now()}`;
  }

  escapeString(str) {
    return str.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }

  formatValue(value, datatype = 'string') {
    if (value === null || value === undefined) return null;
    
    switch (datatype) {
      case 'string':
        return `"${this.escapeString(value.toString())}"`;
      case 'date':
        return `"${value}"^^xsd:date`;
      case 'dateTime':
        return `"${value}"^^xsd:dateTime`;
      case 'decimal':
        return `"${value}"^^xsd:decimal`;
      case 'integer':
        return `"${value}"^^xsd:integer`;
      case 'uri':
        return `<${value}>`;
      default:
        return `"${this.escapeString(value.toString())}"`;
    }
  }
}

module.exports = RDFRepository;
