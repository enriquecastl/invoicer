import { DB } from 'sqlite';
import { Customer, CustomerID } from '../types.ts';
import { Store } from '../types.ts';

type CustomerRow = Omit<Customer, ''>;

export default class CustomerStore implements Store<CustomerID, Customer> {
  readonly #db: DB;

  constructor(db: DB) {
    this.#db = db;
  }

  all(): Customer[] {
    return this.#db.queryEntries<CustomerRow>(
      'SELECT id, name, emailAddress, phoneNumber, address from Customer',
    );
  }

  findById(id: CustomerID): Customer | null {
    const results = this.#db.queryEntries<CustomerRow>(
      'SELECT id, name, emailAddress, phoneNumber, address from Customer where id = :id',
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

  create(customer: Customer): number {
    this.#db.query(
      'INSERT INTO Customer (id, name, emailAddress, phoneNumber, address) VALUES (:id, :name, :emailAddress, :phoneNumber, :address)',
      {
        id: customer.id,
        name: customer.name,
        emailAddress: customer.emailAddress,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
      },
    );

    return this.#db.changes;
  }
}
