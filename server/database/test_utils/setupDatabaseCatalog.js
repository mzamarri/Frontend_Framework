const queryDatabase = require('../queryDatabase');

// Description: This file contains the list of products that are available in the store. Will evetually be fetched from a database.

function createItem(name, price, image, description) {
    return {
        name: name,
        price: price,
        imageSrc: image,
        description: description
    }
}

const generateCatalog = (numOfItems) => {
    let tempItems = [];
    for (let i = 1; i <= numOfItems; i++) {
        tempItems.push(createItem(`Item ${i}`, i*10, "", `This is item ${i}`));
    }
    return tempItems;
}

const populateDatabaseCatalog = async (catalogList, returnCatalog=false) => {
    const postQuery = `
        CALL add_to_catalog('${JSON.stringify(catalogList)}');
    `

    await queryDatabase(postQuery)
    .then(() => console.log("Successfully Setup catalog table..."))
    .catch(err => console.error(err));

    if (returnCatalog) {
        const getQuery = `
            SELECT * FROM get_catalog();
        ` 

        return await queryDatabase(getQuery)
        .then(res => res.rows)
        .catch(err => {
            console.error("Error getting catalog from database: ", err);
            throw err;
        })
    };
}

module.exports = { createItem, generateCatalog, populateDatabaseCatalog }
