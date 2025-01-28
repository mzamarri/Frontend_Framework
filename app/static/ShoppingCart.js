export default class {
    constructor() {
        this.cart = [];
        this.deleteItems = [];
        this.addItems = [];
        this.updateItems = [];
    }

    findItem(catalogId) {
        return this.cart.find(item => item.catalogId === catalogId);
    }

    updateCartChanges(item, operation) {
        const cartChanges = [
            this.deleteItems,
            this.addItems,
            this.updateItems
        ];

        cartChanges.forEach(array => {
            const index = array.indexOf(item);
            if (index !== -1) array.splice(index, 1);
        });

        switch (operation) {
            case "DELETE":
                this.deleteItems.push(item.catalogId);
                return;
            case "UPDATE":
                this.updateItems.push(item);
                return;
            case "ADD":
                this.addItems.push(item);
                return;
        }
    }

    addItem(catalogId) {
        const item = this.findItem(catalogId);
        
        if (item === undefined) {
            const newItem = {
                catalogId: catalogId,
                addAmount: 1
            }
            this.cart.push(newItem);
            this.addItems.push(newItem);
            return;
        }

        item.addAmount === undefined
            ? item.addAmount = 1
            : item.addAmount++;
        item.amount++;
        this.updateCartChanges(item, "ADD");
    }

    updateAmount(catalogId, quantity) {
        const item = this.findItem(catalogId);
        try {
            if (quantity <= 0) {
                this.updateCartChanges(item, "DELETE");
                return;
            }

            item.updateAmount = quantity;
            item.amount = quantity;

            this.updateCartChanges(item, "UPDATE")
        } catch {
            console.error("Item does not exist. Cannot update amount");
        }
    }

    addAmount(catalogId, quantity) {
        const item = this.findItem(catalogId);
        try {
            const newAmount = item.amount + quantity;
            if (newAmount > 0) {
                item.amount = newAmount;
                item.addAmount === undefined 
                    ? item.addAmount = quantity
                    : item.addAmount += quantity;
                this.updateCartChanges(item, "ADD");
            } else if (newAmount <= 0) {
                item.amount = 0;
                this.updateCartChanges(item, "DELETE");
            }
        } catch {
            console.error("Item does not exist. Cannot add amount");
        }
    }

    deleteItem(catalogId) {
        const item = this.findItem(catalogId);
        this.updateCartChanges(item, "DELETE");
    }

    async getCart() {
        const url = "/api/cart/get-cart";
        return await fetch(url)
            .then(res => res.json())
            .then(data => {
                this.cart = data;
                return data;
            })
            .catch(err => {
                console.error(err);
                throw err;
            });
    }

    saveCartTimeout(timeoutDuration) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.saveCart(), timeoutDuration);
    }

    async saveCart() {
        clearTimeout(this.timeout); // Must clear any timeout to prevent double saving

        const operations = [
            {items: [...new Set(this.deleteItems)], method: deleteItems => this.deleteFromCart(deleteItems)},
            {items: [...new Set(this.addItems)], method: addItems => this.addToCart(addItems)},
            {items: [...new Set(this.updateItems)], method: updateItems => this.updateCart(updateItems)},
        ]

        for (const { items, method } of operations) {
            if (items.length === 0) continue;
            await method(items);
        }

        
        this.cart.forEach(item => {
            delete item.addAmount;
            delete item.updateAmount;
        })
        this.addItems = [];
        this.updateItems = [];
        this.deleteItems = [];

        this.cart = await this.getCart();
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