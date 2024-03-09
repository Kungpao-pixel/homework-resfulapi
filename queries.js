const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movies-data',
    password: 'luthfi12',
    port: 5432
})


module.exports = pool