export default class {
    constructor() {
        this.cart = {};
    }

    addToCart(item) {
        this.cart.hasOwnProperty(item.catalogId) ? this.cart[item.catalogId].amount++ : this.cart[item.catalogId] = {amount: 1, catalogId: item.catalogId};
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

    async saveCart() {
        const url = "/cart/add-items";
        const cartItems = this.getCart();
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItems)
        })
        .then(res => res.json())
        .then(data => {
            console.log("fetch api data received...");
            // if (data.inStock) return console.log("Item in Cart");
            // const updatedItems = data.updatedItems;
            // updatedItems.forEach(item => cart.updateCart(item, item.newAmount));
        })
        .catch(err => {
            console.error(err);
            throw err;
        })
        .finally(() => {console.log("Finally called")});
    }

    loadCart() {
        console.log("CartLoaded");
    }
}