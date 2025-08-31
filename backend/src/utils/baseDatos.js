const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'USER NAME',
  port: 5432,
  password: 'PASSWORD',
  database: 'DATABASE NAME',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

