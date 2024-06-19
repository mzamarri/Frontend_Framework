const pg = require('pg');

exports = module.exports = class {
    constructor() {
        this.catalog = this.loadCatalogFromDatabase();
    }

    addToCatalog(item) {
        this.catalog.push(item);
        this.saveCatalogToDatabase();
    }

    removeFromCatalog(id) {
        for (let i = 0; i < this.catalog.length; i++) {
            if (this.catalog[i].id === id) {
                this.catalog.splice(i, 1);
                return;
            }
        }
        console.log("Item not in catalog");
    }

    updateCatalog(id, item) {
        for (let i = 0; i < this.catalog.length; i++) {
            if (this.catalog[i].id === id) {
                this.catalog[i] = item;
                this.saveCatalogToDatabase();
                return;
            }
        }
        console.log("Item not in catalog");
    }

    getCatalog() {
        return this.catalog;
    }

    saveCatalogToDatabase() {
        console.log("Saving catalog to database");
        return;
    }

    loadCatalogFromDatabase() {
        console.log("Loading catalog from database");
        return [];
    }
}