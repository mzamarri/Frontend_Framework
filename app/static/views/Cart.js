import AbstractView from "../Modules/Views/AbstractView.js";
import { cart } from "../index.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Cart");
    }

    getHtml() {
        let cartHtml = this.getCart();
        return `
            <div class="cart-container">
                <h1>Cart</h1>
                <div class="cart" id="cart">
                    <div class="cart-items">
                        ${cartHtml === "" ? "<h2>Your cart is empty</h2>" : cartHtml}
                    </div>
                    <div class="cart-summary">
                        <h1>Summary</h1>
                        <div class="purchase-summary">
                            <div class="cost-summary">
                                <h3>Subtotal: $Price</h3>
                                <h3>Shipping: $Price</h3>
                            </div>
                            <h3>Total: $Price</h3>
                        </div>
                        <button>Checkout</button>
                    </div>
                </div>
            </div>
        `
    }

    getCart() {
        let html = "";
        cart.getCart().forEach(item => {
            html += `
                <div class="cart-item">
                    <button class="remove-item" data-id=${item.item.id}>X</button>
                    <img src="${item.item.imageSrc}" alt="product photo">
                    <div class="product-description">
                        <h3>${item.item.name}</h3>
                        <p>${item.item.description}</p>
                    </div>
                    <input type="number" id="quantity" name="quantity" min="1" value="${item.amount}">
                    <h3>$${item.item.price}</h3>
                </div>
            `
        })
        console.log("getCart html: " + html)
        return html;
    }

    updateCart() {

    }

    setEventListeners() {

    }
}