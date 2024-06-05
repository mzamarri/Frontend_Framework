import AbstractView from "../Modules/Views/AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Cart");
    }

    getHtml() {
        return `
            <div class="cart">
                <h2>Cart</h2>
                <div class="cart-items">
                    <div class="cart-item">
                        <img src-"#" alt="product photo">
                        <h3>Product Name</h3>
                        <p>Product Description (Optional)</p>
                        <input type="number" id="quantity" name="quantity" min="0">
                        <h3>$Price</h3>
                    </div>
                    <div class="cart-item">
                        <img src-"#" alt="product photo">
                        <h3>Product Name</h3>
                        <p>Product Description (Optional)</p>
                        <input type="number" id="quantity" name="quantity" min="0">
                        <h3>$Price</h3>
                    </div>
                </div>
                <div class="cart-summary">
                    <h1>Summary</h1>
                    <h3>Subtotal: $Price</h3>
                    <h3>Shipping: $Price</h3>
                    <h3>Total: $Price</h3>
                    <button>Checkout</button>
                </div>
            </div>
        `
    }
}