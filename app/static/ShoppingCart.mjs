export default class {
    constructor() {
        this.cart = {};
    }

    addToCart(item) {
        this.cart.hasOwnProperty(item.id) ? this.cart[item.id].amount++ : this.cart[item.id] = {amount: 1, cartItem: item};
        this.saveCartToSessionStorage();
    }

    removeFromCart(id) {
        if (id in this.cart) {
            delete this.cart[id];
            this.saveCartToSessionStorage();
        }
    }

    updateCart(id, quantity) {
        this.cart[id].amount = quantity;
        this.saveCartToSessionStorage();
    }

    addAmount(id, quantity) {
        if (this.cart[id].amount + quantity > 0) {
            this.cart[id].amount += quantity;
            this.saveCartToSessionStorage();
        } else if (this.cart[id].amount + quantity <= 0) {
            this.removeFromCart(id);
        }
    }

    getCart() {
        let cart = Object.entries(this.cart);
        return cart;
    }

    saveCartToSessionStorage() {
        sessionStorage.setItem("cart", JSON.stringify(this.cart));
    }

    loadCartFromSessionStorage() {
        this.cart = JSON.parse(sessionStorage.getItem("cart")) || {};
    } 
}