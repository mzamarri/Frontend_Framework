export default class {
    constructor() {
        this.cart = {};
    }

    addToCart(item) {
        this.cart.hasOwnProperty(item.id) ? this.cart[item.id].amount++ : this.cart[item.id] = {amount: 1, cartItem: item};
        this.saveCartToSessionStorage();
    }

    removeFromCart(id) {
        this.cart.hasOwnProperty(id) ? this.cart[id].amount-- : delete this.cart[id];
        this.saveCartToSessionStorage();
    }

    updateCart(id, quantity) {
        this.cart[id].amount = quantity;
        this.saveCartToSessionStorage();
    }

    addAmount(id, quantity) {
        this.cart[id].amount += quantity;
        this.saveCartToSessionStorage();
    }

    getCart() {
        let cart = Object.values(this.cart);
        console.log("cart: " + cart);
        return cart;
    }

    saveCartToSessionStorage() {
        sessionStorage.setItem("cart", JSON.stringify(this.cart));
    }

    loadCartFromSessionStorage() {
        this.cart = JSON.parse(sessionStorage.getItem("cart")) || {};
    }
}