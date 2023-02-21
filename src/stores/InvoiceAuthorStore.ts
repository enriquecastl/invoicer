import { DB } from 'sqlite';
import { InvoiceAuthor, InvoiceAuthorID } from '../types.ts';
import { Store } from '../types.ts';

type InvoiceAuthorRow = {
  id: number;
  name: string;
  signature: string;
};

export default class InvoiceAuthorStore implements Store<InvoiceAuthorID, InvoiceAuthor> {
  readonly #db: DB;

  constructor(db: DB) {
    this.#db = db;
  }

  all(): InvoiceAuthor[] {
    return this.#db.queryEntries<InvoiceAuthorRow>(
      'SELECT id, name, signature FROM InvoiceAuthor',
    );
  }

  findById(id: InvoiceAuthorID): InvoiceAuthor | null {
    const results = this.#db.queryEntries<InvoiceAuthorRow>(
      'SELECT id, name, signature FROM InvoiceAuthor where id = :id',
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

  create(author: InvoiceAuthor): number {
    this.#db.query(
      'INSERT INTO InvoiceAuthor (name, signature) VALUES (:name, :signature)',
      {
        name: author.name,
        signature: author.signature,
      },
    );

    return this.#db.changes;
  }
}
