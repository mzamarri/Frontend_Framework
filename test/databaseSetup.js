const queryDatabase = require('../server/queryDatabase');
const catalog = require('../server/productList');
// const orderHistoryList = require('../server/orderHistoryList');

exports = module.exports = async function () {
    // Setting up catalog data
    const catalogQuery = `
        CALL clear_tables();
        CALL create_tables();

        CALL add_to_catalog('${JSON.stringify(catalog)}');
    `

    return await queryDatabase(catalogQuery)
    .then(res => console.log("Successfully Setup database for testing..."))
    .catch(err => console.error(err));

    // Setting up order data
    const orderQuery = `
        CALL add_to_order_history()
    `
}