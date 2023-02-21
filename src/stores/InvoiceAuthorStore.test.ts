import { DB } from 'sqlite';
import { beforeEach, describe, it } from 'testing/bdd.ts';
import { assertSpyCall, spy } from 'testing/mock.ts';
import { assertEquals } from 'testing/asserts.ts';
import { invoiceAuthor } from '../test_constants.ts';
import { createDB } from '../infra/database.ts';
import InvoiceAuthorStore from './InvoiceAuthorStore.ts';

describe('InvoiceAuthorStore', () => {
  let db: DB;
  let store: InvoiceAuthorStore;

  beforeEach(async () => {
    db = await createDB({});
    store = new InvoiceAuthorStore(db);
  });

  it('create', () => {
    const querySpy = spy(db, 'query');
    const changes = store.create(invoiceAuthor);

    assertSpyCall(querySpy, 0, {
      args: [
        'INSERT INTO InvoiceAuthor (name, signature) VALUES (:name, :signature)',
        {
          name: invoiceAuthor.name,
          signature: invoiceAuthor.signature,
        },
      ],
    });
    assertEquals(changes, 1);
  });

  it('all', () => {
    store.create(invoiceAuthor);

    const queryEntriesSpy = spy(db, 'queryEntries');
    const results = store.all();

    assertSpyCall(queryEntriesSpy, 0, {
      args: [
        'SELECT id, name, signature FROM InvoiceAuthor',
      ],
    });
    assertEquals(results.length, 1);
    assertEquals(results[0], invoiceAuthor);
  });

  it('findById', () => {
    const invoiceAuthorId = 2;

    const queryEntriesSpy = spy(db, 'queryEntries');

    store.findById(invoiceAuthorId);

    assertSpyCall(queryEntriesSpy, 0, {
      args: [
        'SELECT id, name, signature FROM InvoiceAuthor where id = :id',
        { id: invoiceAuthorId },
      ],
    });
  });
});
