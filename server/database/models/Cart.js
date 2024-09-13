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

    getCart() {
        this.loadCartFromDatabase();
        return Object.values(this.cart);
    }

    async saveCartToDatabase() {
        console.log("items: ", this.cart);
        const cart = Object.values(this.cart);
        const query = `
            CALL add_to_cart('${this.userId}', '${JSON.stringify(cart)}');
        `
        await queryDatabase(query)
        .then(() => {
            console.log("Cart saved...");
            this.cart = {};
        })
        .catch(err => {
            console.error("Error saving to database: ", err);
            throw err;
        });
    }

    async loadCartFromDatabase() {
        console.log("User Id: ", this.userId);
        const query = `
            SELECT * FROM get_cart(${this.userId})
        `
        await queryDatabase(query)
        .then(res => res.rows)
        .catch(err => {
            console.error("Error loading cart from database");
            throw err;
        });
        console.log("Loaded data...");
    }

    static newSession(sessionId) {
        this.sessionCarts[sessionId] = new this(sessionId);
        return this.sessionCarts[sessionId];
    }
}