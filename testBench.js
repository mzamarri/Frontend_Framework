const Catalog = require('./server/Catalog.js');
const itemList = require('./server/productList.js');
const queryDatabase = require('./server/queryDatabase.js');

const addToCatalog = async () => {
    const deleteRecordsQuery = `DELETE FROM catalog`
    await queryDatabase(deleteRecordsQuery);

    const catalog = new Catalog();
    await catalog.addToCatalog(itemList.splice(0, 10));
}

const getCatalog = async () => {
    const catalog = new Catalog();
    const res = await catalog.getCatalog();
    console.log("res: ", res);
}

const removeFromCatalog = async () => {
    const catalog = new Catalog();
    await catalog.removeFromCatalog(itemList.splice(0, 3));
}

(async () => {
    await addToCatalog();
})()