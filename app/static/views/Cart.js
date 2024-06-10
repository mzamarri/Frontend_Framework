import AbstractView from "../Modules/Views/AbstractView.js";
import { cart } from "../index.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Cart");
        this.cart = cart;
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
        this.cart.getCart().forEach(item => {
            html += `
                <div class="cart-item" data-id=${item.id}>
                    <button class="remove-item">X</button>
                    <img src="${item.item.imageSrc}" alt="product photo">
                    <div class="product-description">
                        <h3>${item.item.name}</h3>
                        <p>${item.item.description}</p>
                    </div>
                    <div class="quantity">
                        <button class="decrement-quantity">-</button>
                        <input type="text" class="quantity-input" name="quantity" min="0" value="${item.amount}">
                        <button class="increment-quantity">+</button>
                    </div>
                    <h3>$${item.item.price}</h3>
                </div>
            `
        })
        console.log("getCart html: " + html)
        return html;
    }

    updateCart(event) {
        let id = event.currentTarget.getAttribute("[data-id]");
        console.log("Inside updateCart\nid: " + id);
        switch (event.target.tagName) {
            case "INPUT":
                let amount = parseInt(event.target.value);
                this.cart.addToCart(id, amount);
                break;
            case "BUTTON":
                if (event.target.classList.contains("increment-quantity")) {
                    this.cart.addAmount(id, 1);
                } else if (event.target.classList.contains("decrement-quantity")) {
                    this.cart.addAmount(id, -1);
                } else if (event.target.classList.contains("remove-item")) {
                this.cart.removeFromCart(id);
                }
                break;
        }
    }

    setEventListeners() {
        const cart = document.getElementById("cart");
        console.log("cart: " + cart);
        cart.addEventListener("click", (event) => {
            console.log("event: " + event.target.tagName)
            this.updateCart(event);
        });
    }
}