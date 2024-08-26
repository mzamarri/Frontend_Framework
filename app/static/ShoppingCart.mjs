export default class {
    constructor() {
        this.cart = {};
    }

    addToCart(item) {
        this.cart.hasOwnProperty(item.catalogId) ? this.cart[item.catalogId].amount++ : this.cart[item.catalogId] = {amount: 1, catalogId: item.catalogId};
        this.saveCartToSessionStorage();
    }

    removeFromCart(item) {
        if (item.catalogId in this.cart) {
            delete this.cart[catalogId];
            this.saveCartToSessionStorage();
        }
    }

    updateCart(item, quantity) {
        if (!this.cart.hasOwnProperty(item.catalogId)) return console.log("Item not in cart!");
        this.cart[item.catalogId].amount = quantity;
        this.saveCartToSessionStorage();
    }

    addAmount(item, quantity) {
        if (this.cart[item.catalogId].amount + quantity > 0) {
            this.cart[item.catalogId].amount += quantity;
            this.saveCartToSessionStorage();
        } else if (this.cart[item.catalogId].amount + quantity <= 0) {
            this.removeFromCart(item.catalogId);
        }
    }

    getCart() {
        const cart = Object.values(this.cart);
        return cart;
    }

    saveCartToSessionStorage() {
        sessionStorage.setItem("cart", JSON.stringify(this.cart));
    }

    loadCartFromSessionStorage() {
        this.cart = JSON.parse(sessionStorage.getItem("cart")) || {};
    } 
}