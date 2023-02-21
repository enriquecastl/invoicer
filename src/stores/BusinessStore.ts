import { DB } from 'sqlite';
import { Business, BusinessID, Store } from '../types.ts';

type BusinessRow = Omit<Business, ''>;

export default class BusinessStore implements Store<BusinessID, Business> {
  readonly #db: DB;

  constructor(db: DB) {
    this.#db = db;
  }

  all(): Business[] {
    return this.#db.queryEntries<BusinessRow>(
      'SELECT id, name, emailAddress, website, taxRegime, phoneNumber, address, municipality, province from Business',
    );
  }

  findById(id: BusinessID): Business | null {
    const results = this.#db.queryEntries<BusinessRow>(
      'SELECT id, name, emailAddress, website, taxRegime, phoneNumber, address, municipality, province from Business where id = :id',
      { id },
    );

    if (results.length > 0) {
      return results[0];
    }

    return null;
  }

  update(): number {
    throw new Error("Method not implemented.");
  }

  create(business: Business): number {
    this.#db.query(
      'INSERT INTO business (id, name, emailAddress, website, taxRegime, phoneNumber, address, municipality, province) VALUES (:id, :name, :emailAddress, :website, :taxRegime, :phoneNumber, :address, :municipality, :province)',
      {
        id: business.id,
        name: business.name,
        emailAddress: business.emailAddress,
        website: business.website,
        taxRegime: business.taxRegime,
        phoneNumber: business.phoneNumber,
        address: business.address,
        municipality: business.municipality,
        province: business.province,
      },
    );

    return this.#db.changes;
  }
}
