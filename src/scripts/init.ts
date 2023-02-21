import { parse } from 'std/flags/mod.ts';
import { createDB, readConfig } from '../infra/index.ts';
import InitInvoicerService from '../services/InitInvoicerService.ts';

const flags = parse(Deno.args, {
  string: ['config'],
});
const configPath = flags.config || Deno.env.get('INVOICER_CONFIG');

if (!configPath) {
  console.error('Please, provide a config file using the config flag');
  Deno.exit(1);
}

const config = await readConfig({ configPath });
const db = await createDB({ databasePath: config.databasePath });

new InitInvoicerService(db, config).execute();
