const queryDatabase = require('../queryDatabase');

function randomInt(max, min=0) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function setupDatabaseTables() {
    const query = `
        CALL clear_tables();
        CALL create_tables();
    `

    return await queryDatabase(query)
    .then(() => console.log("Database tables setup successfully"))
    .catch(err => {
        console.error("Error setting up table: ", err);
        throw err;
    });
}

module.exports = { randomInt, setupDatabaseTables }