const queryDatabase = require('../queryDatabase');

exports = module.exports = class {

    constructor() {
        this.catalog = this.getCatalog();
    }

    async addToCatalog(itemList) {
        const query = `
            INSERT INTO catalog (name, price, image_src, description)
            VALUES ${itemList.map(item => {
                return `('${item.name}', ${item.price}, '${item.imageSrc}', '${item.description}')`
            }).join(",\n")}
        `
        
        await queryDatabase(query)
        .then(console.log("Successfully added items to catalog"))
        .catch(err => {
            console.error("Error getting catalog: ", err);
            throw err;
        });
    }

    async removeFromCatalog(itemList) {
        const query = `DELETE FROM catalog WHERE catalog_id IN (${itemList.map(item => `'${item.catalogId}'`).join(", ")})`
        await queryDatabase(query)
        .then(console.log("Successfully removed items from catalog"))
        .catch(err => {
            console.error("Error getting catalog: ", err);
            throw err;
        });
    }

    async updateCatalog(itemList) {
        const query = `
            CALL update_catalog('${JSON.stringify(itemList)}');
        `
        await queryDatabase(query)
        .then(() => console.log("Successfully updated items in catalog"))
        .catch(err => {
            console.error("Error getting catalog: ", err);
            throw err;
        }); 
    }

    async getCatalog(offset=0) {
        const query = `SELECT * FROM get_catalog() LIMIT 500 OFFSET ${500 * offset}`
        return await queryDatabase(query)
        .then(res => {
            console.log("Successfully fetched catalog");
            return res.rows;
        })
        .catch(err => {
            console.error("Error getting catalog: ", err);
            throw err;
        });
    }

    async getItems(items) {
        const catalogIdList = items.map(item => item.catalogId).join(', ');
        const query = `
            SELECT * FROM get_catalog() WHERE "catalogId" IN (${catalogIdList});
        `
        return await queryDatabase(query)
        .then(res => res.rows)
        .catch(err => {
            console.error(err);
            throw err;
        });
    }
}