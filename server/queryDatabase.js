const { Pool, Client } = require('pg');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});

const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE_TEST,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
}

const pool = new Pool({
    ...config,
    allowExitOnIdle: true
});

exports = module.exports = async function (query, isPool=true) {
    if (!isPool) {
        const client = new Client({
            ...config
        })
        await client.connect();
        const res = await client.query(query);
        await client.end();
        return res;
    }
    const res = await pool.query(query);
    return res;
}