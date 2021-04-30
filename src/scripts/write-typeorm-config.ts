import { typeOrmCliConfig } from "../app/config/database/typeorm.config";
import fs = require("fs");

fs.writeFileSync('ormconfig.json', JSON.stringify(typeOrmCliConfig, null, 2));
