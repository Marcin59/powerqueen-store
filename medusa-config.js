const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
    ENV_FILE_NAME = ".env.development";
    break;
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "/http:\/\/*/";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const MEDUSA_ADMIN_BACKEND_URL = process.env.MEDUSA_ADMIN_BACKEND_URL || "http://localhost:9000";

const plugins = [
  "medusa-fulfillment-manual",
  "medusa-payment-manual",
  {
    resolve: "@medusajs/file-local",
    options: {
      upload_dir: "uploads",
      backend_url: "https://powerqueen-store-backend-ebcddb895514.herokuapp.com",
    },
  },
];

// Conditionally include the Admin plugin only in development
ADD_ADMIN = process.env.ADD_ADMIN || "true";
if (ADD_ADMIN === "true") {
  plugins.push({
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      serve: false,
      backend: MEDUSA_ADMIN_BACKEND_URL
      // other options...
    },
  });
}

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET || "supersecret",
  cookie_secret: process.env.COOKIE_SECRET || "supersecret",
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  database_type: "postgres",
  database_extra:
      process.env.NODE_ENV !== "development"
        ? { ssl: { rejectUnauthorized: false } }
        : {},
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
