import { DB } from 'sqlite';
import { ensureDir } from 'std/fs/mod.ts';
import { dirname, resolve } from 'std/path/mod.ts';

export interface CreateDBOptions {
  databasePath?: string;
}

export async function createDB(
  { databasePath }: CreateDBOptions = {},
): Promise<DB> {
  let db: DB;
  const schema = await Deno.readTextFile(resolve('.', 'src/infra/schema.sql'));

  if (databasePath) {
    try {
      db = new DB(databasePath, { mode: 'write' });
      console.log('Existing database found. Loading...');
    } catch {
      console.log('The database file does not exist. Creating...');
      ensureDir(dirname(databasePath));
      db = new DB(databasePath);
    }
  } else {
    db = new DB();
  }

  db.execute(schema);

  return db;
}
