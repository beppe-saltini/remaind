const FusekiRepository = require('./FusekiRepository');
const PersonalDataRepository = require('./PersonalDataRepository');

class RepositoryFactory {
  static createRDFRepository(type = 'fuseki') {
    switch (type.toLowerCase()) {
      case 'fuseki':
        return new FusekiRepository();
      case 'stardog':
        // return new StardogRepository(); // Future implementation
        throw new Error('Stardog repository not implemented yet');
      case 'graphdb':
        // return new GraphDBRepository(); // Future implementation
        throw new Error('GraphDB repository not implemented yet');
      default:
        throw new Error(`Unknown repository type: ${type}`);
    }
  }

  static createPersonalDataRepository(rdfStoreType = 'fuseki') {
    const rdfStore = this.createRDFRepository(rdfStoreType);
    return new PersonalDataRepository(rdfStore);
  }
}

module.exports = RepositoryFactory;
