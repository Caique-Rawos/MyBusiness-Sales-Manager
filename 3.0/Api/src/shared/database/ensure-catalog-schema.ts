import 'dotenv/config';
import { ensureSchemaExists } from './ensure-schema';
import { CATALOG_SCHEMA } from './typeorm-options';

ensureSchemaExists(CATALOG_SCHEMA)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
