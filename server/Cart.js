exports = module.exports = class {
    constructor() {
        this.cart = {};
    }

    addToCart(item) {
        this.cart.hasOwnProperty(item.id) ? this.cart[item.id].amount++ : this.cart[item.id] = {amount: 1, cartItem: item};
    }

    removeFromCart(id) {
        if (id in this.cart) {
            delete this.cart[id];
            return;
        }
        console.log("Item not in cart");
    }

    updateCart(id, quantity) {
        this.cart[id].amount = quantity;
    }

    addAmount(id, quantity) {
        if (this.cart[id].amount + quantity > 0) {
            this.cart[id].amount += quantity;
        } else if (this.cart[id].amount + quantity <= 0) {
            this.removeFromCart(id);
        }
    }

    getCart() {
        let cart = Object.entries(this.cart);
        return cart;
    }

    saveCartToDatabase() {
        sessionStorage.setItem("cart", JSON.stringify(this.cart));
    }

    loadCartFromDatabase() {
        this.cart = JSON.parse(sessionStorage.getItem("cart")) || {};
    } 
}