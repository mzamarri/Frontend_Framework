import AbstractView from "../Modules/Views/AbstractView.js";
import { cart } from "../index.js";

export default class extends AbstractView {
    constructor(cart) {
        super();
        super.setTitle("Cart");
        this.cart = cart;
    }

    getHtml() {
        return `
            <div class="cart-container">
                <h1>Cart</h1>
                <div class="cart" id="cart">
                    <div class="cart-items">
                        <div class="cart-item">
                            <button class="remove-item">X</button>
                            <img src-"#" alt="product photo">
                            <div class="product-description">
                                <h3>Product Name</h3>
                                <p>Product Description (Optional)</p>
                            </div>
                            <input type="number" id="quantity" name="quantity" min="0">
                            <h3>$Price</h3>
                        </div>
                        <div class="cart-item">
                        <button class="remove-item">X</button>
                            <img src-"#" alt="product photo">
                            <div class="product-description">
                                <h3>Product Name</h3>
                                <p>Product Description (Optional)</p>
                            </div>
                            <input type="number" id="quantity" name="quantity" min="0">
                            <h3>$Price</h3>
                        </div>
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
        this.cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <button class="remove-item">X</button>
                    <img src="${item.imageSrc}" alt="product photo">
                    <div class="product-description">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                    <input type="number" id="quantity" name="quantity" min="0">
                    <h3>$${item.price}</h3>
                </div>
            `
        })
    }

    updateCart() {

    }

    setEventListeners() {

    }
}