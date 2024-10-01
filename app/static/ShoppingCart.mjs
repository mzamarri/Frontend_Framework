export default class {
    constructor() {
        this.cart = [];
    }

    findItem(catalogId) {
        return this.cart.find(item => item.catalogId === catalogId);
    }

    addItem(catalogId) {
        const item = this.findItem(catalogId);
        
        if (item === undefined) {
            this.cart.push({ catalogId: catalogId, updateAmount: 1 , method: "ADD"});
            return;
        }

        item.updateAmount === undefined
            ? item.updateAmount = ++item.amount
            : item.updateAmount++;
        item.method = "UPDATE";
    }

    updateAmount(catalogId, quantity) {
        const item = this.findItem(catalogId);
        try {
            if (quantity <= 0) {
                item.method = 'DELETE';
                return;
            }
            item.updateAmount = quantity;
            item.method =  "UPDATE";
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
                item.updateAmount = newAmount;
                item.method = "UPDATE";
            } else if (newAmount <= 0) {
                item.method = "DELETE";
            }
        } catch {
            console.error("Item does not exist. Cannot add amount");
        }
    }

    deleteItem(catalogId) {
        const item = this.findItem(catalogId);
        item !== undefined ? item.method = "DELETE" : this.cart.push({catalogId: catalogId, method: "DELETE"});
    }

    async getCart() {
        const url = "/cart/get-cart";
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
        this.timeout = setTimeout(this.saveCart.bind(this), timeoutDuration);
    }

    async saveCart() {
        clearTimeout(this.timeout); // Must clear any timeout to prevent double saving

        const saveCart = this.cart.map(item => ({
            catalogId: item.catalogId,
            amount: item.updateAmount,
            method: item.method
        }));

        const deleteItems = saveCart
            .filter(item => item.method === "DELETE")
            .map(item => parseInt(item.catalogId));
        const addItems = saveCart.filter(item => item.method === "ADD");
        const updateItems = saveCart.filter(item => item.method === "UPDATE");

        const operations = [
            {item: deleteItems, method: this.deleteFromCart.bind(this)},
            {item: addItems, method: this.addToCart.bind(this)},
            {item: updateItems, method: this.updateCart.bind(this)},
        ]

        for (const { items, method } of operations) {
            if (items.length === 0) continue;
            await method(items);
        }

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