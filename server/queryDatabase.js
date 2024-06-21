const { Pool, Client } = require('pg');
require('dotenv').config();

const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
}

const pool = new Pool({
    ...config,
    allowExitOnIdle: true
});

const client = new Client({
    ...config
})

exports = module.exports = async function (query, isPool=true) {
    if (!isPool) {
        await client.connect();
        const res = await client.query(query);
        client.end();
        return res;
    }
    const res = await pool.query(query);
    return res;
}