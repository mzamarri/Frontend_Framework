import AbstractView from "../Modules/Views/AbstractView.js";
import { cart } from "../index.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Cart");
        this.cart = cart;
        this.cartId = "cart";
        this.cartItemsId = "cart-items";
    }

    render(domObj, html) {
        domObj.innerHTML = html;
        this.setEventListeners();
    }

    getHtml() {
        const cartHtml = this.getCart();
        const hostUrl = window.location.origin;
        return `
            <div class="cart-container">
                <h1>Cart</h1>
                <form class="cart" id="cart" action="${hostUrl}/checkout/" method="post">
                    <div class="cart-items" id="cart-items">
                        ${cartHtml}
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
                        <button type="submit" id="checkout">Checkout</button>
                    </div>
                </form>
            </div>
        `
    }

    async getCart() {
        let html = "";
        let cartUrl = window.location.origin + "/cart";
        const response = await fetch("/cat");
        cart.getCart().forEach(([id, item]) => {
            html += `
                <div class="cart-item" data-id=${id}>
                    <button class="remove-item" >X</button>
                    <img src="${item.cartItem.imageSrc}" alt="product photo">
                    <div class="product-description">
                        <h3>${item.cartItem.name}</h3>
                        <p>${item.cartItem.description}</p>
                    </div>
                    <div class="quantity">
                        <button class="decrement-quantity">-</button>
                        <input type="text" class="quantity-input" name="quantity" min="0" value="${item.amount}">
                        <button class="increment-quantity">+</button>
                    </div>
                    <h3>$${item.cartItem.price}</h3>
                </div>
            `
        })
        return html !== "" ? html : "<h2>Your cart is empty</h2>";
    }

    updateCart(event) {
        let domObj, id = event.currentTarget.getAttribute("data-id");
        switch (event.target.tagName) {
            case "INPUT":{
                let amount = parseInt(event.target.value);
                if (amount <= 0) {
                    this.cart.removeFromCart(id);
                    domObj = document.getElementById(this.cartItemsId);
                } else {
                    this.cart.updateCart(id, amount);
                }
                this.render(domObj, this.getCart());
                break;
            }
            case "BUTTON": {
                domObj = document.getElementById(this.cartItemsId);
                let itemAmount = event.currentTarget.querySelector(".quantity-input");
                if (event.target.classList.contains("remove-item")) {
                   cart.removeFromCart(id);
                } else {
                    if (event.target.classList.contains("increment-quantity")) {
                        cart.addAmount(id, 1);
                    } else if (event.target.classList.contains("decrement-quantity")) {
                        cart.addAmount(id, -1);
                    }
                    }
                cart.cart.hasOwnProperty(id) ? itemAmount.value = cart.cart[id].amount : this.render(domObj, this.getCart());
            }
        }
    }



    setEventListeners() {
        const cartItems = document.getElementById("cart").querySelector(".cart-items").querySelectorAll(".cart-item");
        const checkout = document.getElementById("checkout");
        
        cartItems.forEach(item => item.addEventListener("click", (event) => {
            this.updateCart(event);
        }));

        checkout.addEventListener("click", () => {
            alert("Thank you for your purchase!");
            cart.cart = {};
            cart.saveCartToSessionStorage();
        });
    }
}