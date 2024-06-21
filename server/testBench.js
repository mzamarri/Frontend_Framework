const Catalog = require('./Catalog.js');
const itemList = require('./productList.js');
const queryDatabase = require('./queryDatabase.js');

const addToCatalog = async () => {
    const deleteRecordsQuery = `DELETE FROM catalog`
    await queryDatabase(deleteRecordsQuery);

    const catalog = new Catalog();
    await catalog.addToCatalog(itemList);
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
    await getCatalog();
    await removeFromCatalog();
    await getCatalog();
})()