export default class {
    constructor() {
        this.items = []
    }

    findItem(catalogId) {
        return this.items.find(item => item.catalogId === catalogId);
    }

    addItem(catalogId) {
        const item = this.findItem(catalogId);
        item !== undefined ? item.amount++ : this.items.push({ catalogId: catalogId, amount: 1 , method: "ADD" });
    }

    updateAmount(catalogId, quantity) {
        const item = this.findItem(catalogId);
        try {
            item.amount = quantity;
            item.method = "UPDATE";
        } catch {
            console.error("Item does not exist. Cannot update amount");
        }
    }

    addAmount(catalogId, quantity) {
        const item = this.findItem(catalogId);
        try {
            if (item.amount + quantity > 0) {
                item.amount += quantity;
                if (!item.hasOwnProperty("method")) item.method = "ADD";
            } else if (item.amount + quantity <= 0) {
                item.method = "DELETE";
            }
        } catch {
            console.error("Item does not exist. Cannot add amount");
        }
    }

    deleteItem(catalogId) {
        const item = this.findItem(catalogId);
        item === undefined ? item.method = "DELETE" : this.items.push({catalogId: catalogId, method: "DELETE"});
    }

    async saveCart() {
        const deleteItems = this.items
            .filter(item => item.method === "DELETE")
            .map(item => parseInt(item.catalogId));
        const addItems = this.items.filter(item => item.method === "ADD");
        const updateItems = this.items.filter(item => item.method === "UPDATE");

        for (const items of [deleteItems, addItems, updateItems]) {
            if (items.length === 0) continue;
            switch (items) {
                case deleteItems:
                    await this.deleteFromCart(deleteItems);
                    break;
                case addItems:
                    await this.addToCart(items);
                    break;
                case updateItems:
                    await this.updateCart(items);
                    break;
            }
        }
    }

    async getCart() {
        const url = "/cart/get-cart";
        return await fetch(url)
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
    }

    async addToCart(items) {
        const url = "/cart/add-items";
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message);
            this.cart = {};
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
    }

    async updateCart(items) {
        const url = "/cart/update-cart";
        return await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        })
        .then(res => res.json())
        .then(data => data.message)
        .catch(err => {
            console.error(err);
            throw err;
        });
    }

    async deleteFromCart(items) {
        const url = "/cart/delete-items";
        return await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(items)
        })
        .then(res => res.json())
        .then(data => data.message)
        .catch(err => {
            console.error(err);
            throw err;
        });
    }
}