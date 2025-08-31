const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '12345',
  database: 'bd_consultaKPI',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
