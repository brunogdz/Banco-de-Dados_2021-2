const Pool = require('pg').Pool

const pool = new Pool({
    user: 'bocauser',
    host: 'localhost',
    database: 'bocadb',
    password: 'boca123',
    port: 5432,
})

module.exports = pool;