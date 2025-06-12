const RepositoryFactory = require('../repositories/RepositoryFactory');

class DataService {
  constructor() {
    this.repository = RepositoryFactory.createPersonalDataRepository(
      process.env.RDF_STORE_TYPE || 'fuseki'
    );
  }

  async addPerson(personData) {
    try {
      const personUri = await this.repository.createPerson(personData);
      return { success: true, uri: personUri };
    } catch (error) {
      throw new Error(`Failed to add person: ${error.message}`);
    }
  }

  async addInsurancePolicy(policyData) {
    try {
      const policyUri = await this.repository.createInsurancePolicy(policyData);
      return { success: true, uri: policyUri };
    } catch (error) {
      throw new Error(`Failed to add insurance policy: ${error.message}`);
    }
  }

  async getUpcomingReminders() {
    const [birthdays, policies] = await Promise.all([
      this.repository.getUpcomingBirthdays(30),
      this.repository.getExpiringPolicies(60)
    ]);

    return {
      birthdays,
      expiringPolicies: policies
    };
  }
}

module.exports = DataService;
