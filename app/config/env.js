require("dotenv/config");

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PRODUCT_NAME: process.env.PRODUCT_NAME,
  PORT: process.env.PORT,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
};
