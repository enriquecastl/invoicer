import { beforeEach, describe, it } from 'testing/bdd.ts';
import { assertSpyCall, spy } from 'testing/mock.ts';
import { assertEquals } from 'testing/asserts.ts';
import { DB } from 'sqlite';
import { customer } from '../test_constants.ts';
import { createDB } from '../infra/database.ts';
import CustomerStore from './CustomerStore.ts';

describe('CustomerStore', () => {
  let db: DB;
  let store: CustomerStore;

  beforeEach(async () => {
    db = await createDB({});
    store = new CustomerStore(db);
  });

  it('create', () => {
    const querySpy = spy(db, 'query');
    const changes = store.create(customer);

    assertSpyCall(querySpy, 0, {
      args: [
        'INSERT INTO Customer (id, name, emailAddress, phoneNumber, address) VALUES (:id, :name, :emailAddress, :phoneNumber, :address)',
        {
          id: customer.id,
          name: customer.name,
          emailAddress: customer.emailAddress,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
        },
      ],
    });
    assertEquals(changes, 1);
  });

  it('all', () => {
    store.create(customer);

    const queryEntriesSpy = spy(db, 'queryEntries');
    const results = store.all();

    assertSpyCall(queryEntriesSpy, 0, {
      args: [
        'SELECT id, name, emailAddress, phoneNumber, address from Customer',
      ],
    });
    assertEquals(results.length, 1);
    assertEquals(results[0], customer);
  });

  it('findById', () => {
    const customerID = 'customer';

    const queryEntriesSpy = spy(db, 'queryEntries');

    store.findById(customerID);

    assertSpyCall(queryEntriesSpy, 0, {
      args: [
        'SELECT id, name, emailAddress, phoneNumber, address from Customer where id = :id',
        { id: customerID },
      ],
    });
  });
});
