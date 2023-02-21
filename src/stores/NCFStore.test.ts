import { DB } from 'sqlite';
import { beforeEach, describe, it } from 'testing/bdd.ts';
import { assertSpyCall, spy } from 'testing/mock.ts';
import { assertEquals } from 'testing/asserts.ts';
import { ncf } from '../test_constants.ts';
import { createDB } from '../infra/database.ts';
import NCFStore from './NCFStore.ts';
import { NCF } from '../types.ts';

describe('NCFStore', () => {
  let db: DB;
  let store: NCFStore;

  beforeEach(async () => {
    db = await createDB({});
    store = new NCFStore(db);
  });

  it('create', () => {
    const querySpy = spy(db, 'query');
    const changes = store.create(ncf);

    assertSpyCall(querySpy, 0, {
      args: [
        'INSERT INTO NCF (code, type, used) VALUES (:code, :type, :used)',
        {
          code: ncf.code,
          type: ncf.type,
          used: 1,
        },
      ],
    });
    assertEquals(changes, 1);
  });

  it('all', () => {
    const ncfUnused: NCF = { type: 'B02', code: 3, used: false };

    store.create(ncf);
    store.create(ncfUnused);

    const queryEntriesSpy = spy(db, 'queryEntries');

    const results = store.all();

    assertSpyCall(queryEntriesSpy, 0, {
      args: ['SELECT code, type, used FROM NCF'],
    });
    assertEquals(results.length, 2);
    assertEquals(results, [ncf, ncfUnused]);
  });

  it('findById', () => {
    const ncfCode = 2;

    const queryEntriesSpy = spy(db, 'queryEntries');

    store.findById(ncfCode);

    assertSpyCall(queryEntriesSpy, 0, {
      args: ['SELECT code, type, used FROM NCF where code=:code', {
        code: ncfCode,
      }],
    });
  });
});
