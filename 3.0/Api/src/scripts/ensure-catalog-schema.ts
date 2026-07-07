import 'dotenv/config';
import { ensureSchemaExists } from '../shared/database/ensure-schema';
import { CATALOG_SCHEMA } from '../shared/database/typeorm-options';

ensureSchemaExists(CATALOG_SCHEMA)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
