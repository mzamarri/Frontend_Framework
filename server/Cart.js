exports = module.exports = class {
    constructor(cart) {
        this.cart = cart || {};
    }

    addToCart(items) {
        items.forEach(item => 
            this.cart.hasOwnProperty(item.catalogId) ? this.cart[catalogId].amount++ : this.cart[item.catalogId] = {amount: item.amount, catalogId: item.catalogId}
        );
    }

    removeFromCart(catalogId) {
        if (catalogId in this.cart) {
            delete this.cart[catalogId];
            return;
        }
        console.log("Item not in cart");
    }

    updateCart(updatedItem) {
        this.cart[updatedItem.catalogId].amount = updatedItem.amount;
    } 

    addAmount(item) {
        if (this.cart[item.catalogId].amount + item.amount > 0) {
            this.cart[item.catalogId].amount += item.amount;
        } else if (this.cart[item.catalogId].amount + item.amount <= 0) {
            this.removeFromCart(catalogId);
        }
    }

    getCart() {
        return Object.entries(this.cart);
    }

    saveCartToDatabase() {
        sessionStorage.setItem("cart", JSON.stringify(this.cart));
    }

    loadCartFromDatabase() {
        this.cart = JSON.parse(sessionStorage.getItem("cart")) || {};
    }

    returnName() {
        return "Mr Cart" 
    }
}