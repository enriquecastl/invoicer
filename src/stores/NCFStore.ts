import { DB } from 'sqlite';
import { NCF, NCFCode, NCFType } from '../types.ts';
import { Store } from '../types.ts';

type NCFRow = {
  code: number;
  type: NCFType;
  used: number;
};

export default class NCFStore implements Store<NCFCode, NCF> {
  readonly #db: DB;

  constructor(db: DB) {
    this.#db = db;
  }

  all(): NCF[] {
    return this.#db.queryEntries<NCFRow>(
      'SELECT code, type, used FROM NCF',
    ).map((ncfRow) => this.#mapNCFRowToNCF(ncfRow));
  }

  findById(code: NCFCode): NCF | null {
    const results = this.#db.queryEntries<NCFRow>(
      'SELECT code, type, used FROM NCF where code=:code',
      { code },
    );

    if (results.length > 0) {
      return this.#mapNCFRowToNCF(results[0]);
    }

    return null;
  }

  update(ncf: NCF): number {
    this.#db.query(
      'UPDATE NCF set type = :type, used = :used where code = :code',
      {
        code: ncf.code,
        type: ncf.type,
        used: ncf.used ? 1 : 0,
      },
    );

    return this.#db.changes;
  }

  create(ncf: NCF): number {
    this.#db.query(
      'INSERT INTO NCF (code, type, used) VALUES (:code, :type, :used)',
      {
        code: ncf.code,
        type: ncf.type,
        used: ncf.used ? 1 : 0,
      },
    );

    return this.#db.changes;
  }

  #mapNCFRowToNCF(ncfData: NCFRow): NCF {
    return {
      code: ncfData.code,
      type: ncfData.type,
      used: Boolean(ncfData.used),
    };
  }
}
