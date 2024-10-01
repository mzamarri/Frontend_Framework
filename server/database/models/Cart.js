const queryDatabase = require('../queryDatabase');

// Add Cart model here for saving carts to database


exports = module.exports = class Cart {
    static sessionCarts = {};

    constructor(userId) {
        this.cart = {};
        this.userId = userId;
    }

    addToCart(items) {
        items.forEach(item => 
            this.cart.hasOwnProperty(item.catalogId) ? this.cart[item.catalogId].amount++ : this.cart[item.catalogId] = {amount: item.amount, catalogId: item.catalogId}
        );
        this.saveCartToDatabase();
    }

    removeFromCart(catalogId) {
        if (catalogId in this.cart) {
            delete this.cart[catalogId];
            return;
        }
        console.log("Item not in cart");
        this.saveCartToDatabase();
    }

    updateCart(updatedItem) {
        this.cart[updatedItem.catalogId].amount = updatedItem.amount;
        this.saveCartToDatabase();
    } 

    addAmount(item) {
        if (this.cart[item.catalogId].amount + item.amount > 0) {
            this.cart[item.catalogId].amount += item.amount;
        } else if (this.cart[item.catalogId].amount + item.amount <= 0) {
            this.removeFromCart(catalogId);
        }
        this.saveCartToDatabase();
    } 

    // Need to change object returned from database to a JS object
    getCart() {
        return this.cart;
    }

    async saveCartToDatabase(items) {
        console.log("items: ", this.cart);
        const query = `
            CALL add_to_cart('${this.userId}', '${JSON.stringify(items)}');
        `
        await queryDatabase(query)
        .then(() => {
            console.log("Cart saved...");
        })
        .catch(err => {
            console.error("Error saving to database: ", err);
            throw err;
        });
    }

    async loadCartFromDatabase() {
        console.log("User Id: ", this.userId);
        const query = `
            SELECT * FROM get_cart('${this.userId}')
        `
        return await queryDatabase(query)
        .then(res => {
            console.log("Loaded data...");
            this.cart = res.rows[0]["cart"] || [];
        })
        .catch(err => {
            console.error("Error loading cart from database");
            throw err;
        });
    }

    async updateCart(updatedItems) {
        const query = `
            CALL update_cart('${this.userId}', '${JSON.stringify(updatedItems)}');
        `;

        return await queryDatabase(query)
        .then(res => {
            console.log("Updated Cart...");
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
    }

    async deleteFromCart(deleteItems) {
        const items = Array.from(new Set(deleteItems));
        const query = `
            CALL delete_from_cart('${this.userId}', '${JSON.stringify(items)}');
        `

        return await queryDatabase(query)
        .then(res => console.log("Items deleted"))
        .catch(err => {
            console.error(err);
            throw err;
        });
    }

    static newSession(sessionId) {
        this.sessionCarts[sessionId] = new this(sessionId);
        return this.sessionCarts[sessionId];
    }
}