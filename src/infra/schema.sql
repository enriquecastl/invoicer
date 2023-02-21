PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Business (
  id CHAR(11) PRIMARY KEY,
  name TEXT NOT NULL,
  emailAddress TEXT NOT NULL UNIQUE,
  website TEXT NOT NULL UNIQUE,
  taxRegime CHAR(3) NOT NULL CHECK (taxRegime IN ('RST')),
  phoneNumber TEXT NOT NULL,
  address TEXT NOT NULL,
  municipality TEXT NOT NULL,
  province TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Customer (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  emailAddress TEXT NOT NULL,
  phoneNumber TEXT NOT NUll
);

CREATE TABLE IF NOT EXISTS NCF (
  code INTEGER PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('B02')),
  used INTEGER NOT NULL CHECK (used IN (0,1)) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS InvoiceAuthor (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  signature TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Invoice (
  ncf INTEGER PRIMARY KEY,
  customer TEXT NOT NULL,
  business TEXT NOT NULL,
  author INTEGER NOT NULL,
  creationDate INTEGER NOT NULL,
  dopExchangeRate INTEGER NOT NULL,
  paymentDeadline INTEGER NOT NULL CHECK (paymentDeadline in (15, 30, 45)),
  footnotes TEXT,
  termsAndConditions TEXT,
  notes TEXT,
  FOREIGN KEY (ncf) REFERENCES NCF (code),
  FOREIGN KEY (customer) REFERENCES Customer (id),
  FOREIGN KEY (business) REFERENCES Business (id),
  FOREIGN KEY (author) REFERENCES InvoiceAuthor (id)
);

CREATE TABLE IF NOT EXISTS InvoiceEntry (
  id INTEGER PRIMARY KEY,
  invoice INTEGER NOT NULL,
  productOrService TEXT NOT NULL,
  price FLOAT NOT NULL,
  discount FLOAT NOT NULL DEFAULT 0,
  quantity FLOAT NOT NULL DEFAULT 1,
  tax FLOAT NOT NULL DEFAULT 0,
  FOREIGN KEY (invoice) REFERENCES Invoice (ncf)
);
