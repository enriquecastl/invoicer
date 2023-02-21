import { beforeEach, describe, it } from 'testing/bdd.ts';
import { assertSpyCall, spy } from 'testing/mock.ts';
import { DB } from 'sqlite';
import { assertEquals } from 'testing/asserts.ts';
import { business } from '../test_constants.ts';
import { createDB } from '../infra/database.ts';
import BusinessStore from './BusinessStore.ts';

describe('BusinessStore', () => {
  let db: DB;
  let store: BusinessStore;

  beforeEach(async () => {
    db = await createDB({});
    store = new BusinessStore(db);
  });

  it('create', () => {
    const querySpy = spy(db, 'query');
    const changes = store.create(business);

    assertSpyCall(querySpy, 0, {
      args: [
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
      ],
    });
    assertEquals(changes, 1);
  });

  it('all', () => {
    store.create(business);

    const queryEntriesSpy = spy(db, 'queryEntries');
    const results = store.all();

    assertSpyCall(queryEntriesSpy, 0, {
      args: [
        'SELECT id, name, emailAddress, website, taxRegime, phoneNumber, address, municipality, province from Business',
      ],
    });
    assertEquals(results.length, 1);
    assertEquals(results[0], business);
  });

  it('findById', () => {
    const businessID = '123';

    const queryEntriesSpy = spy(db, 'queryEntries');

    store.findById(businessID);

    assertSpyCall(queryEntriesSpy, 0, {
      args: [
        'SELECT id, name, emailAddress, website, taxRegime, phoneNumber, address, municipality, province from Business where id = :id',
        { id: businessID },
      ],
    });
  });
});
