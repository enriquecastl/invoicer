import { parse } from 'std/flags/mod.ts';
import { createDB, readConfig } from '../infra/index.ts';
import CreateInvoiceService from '../services/CreateInvoiceService.ts';
import { displayInvoiceNCFCode } from '../viewHelpers/displayInvoiceNCF.ts';

const flags = parse(Deno.args, {
  string: ['config', 'invoiceData'],
});
const configPath = flags.config || Deno.env.get('INVOICER_CONFIG');

if (!configPath) {
  console.error('Please, provide a config file using the config flag');
  Deno.exit(1);
}

if (!flags.invoiceData) {
  console.error('Please, provide invoice data file using the invoiceData flag');
}

const config = await readConfig({ configPath });
const db = await createDB({ databasePath: config.databasePath });

try {
  const invoice = new CreateInvoiceService(db, config)
    .execute(JSON.parse(Deno.readTextFileSync(flags.invoiceData as string)));

  console.log(`Invoice with NCF ${displayInvoiceNCFCode(invoice.ncf)} created successfully.`);
} catch (e) {
  console.error(e.message);
  Deno.exit(1);
}
