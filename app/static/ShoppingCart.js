export default class {
    constructor() {
        this.cart = {};
    }

    addToCart(item) {
        this.cart.hasOwnProperty(item.id) ? this.cart[item.id].amount++ : this.cart[item.id] = {amount: 1, item: item};
        this.saveCartToSessionStorage();
    }

    removeFromCart(item) {
        this.cart.hasOwnProperty(item.id) ? this.cart[item.id].amount-- : delete this.cart[item.id];
        this.saveCartToSessionStorage();
    }

    getCart() {
        let cart = Object.values(this.cart);
        console.log("cart: " + cart);
        return cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + item.price, 0);
    }

    getCartQuantity() {
        return this.cart.length;
    }

    saveCartToSessionStorage() {
        sessionStorage.setItem("cart", JSON.stringify(this.cart));
    }

    loadCartFromSessionStorage() {
        this.cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    }
}