const { Pool } = require('pg');

const pool = new Pool({
  host: 'HOST',
  user: 'USER NAME',
  port: PORT,
  password: 'PASSWORD',
  database: 'DATABASE NAME',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};


