import AbstractView from "../Modules/Views/AbstractView.js";
import { cart } from "../index.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Cart");
        this.originalValue = "";
    }

    async getHtml() {
        const hostUrl = window.location.origin;
        const cartItems = await cart.getCart();

        const cartHtml = this.getCart(cartItems);
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

    getCart(items) {
        let html = "";
        items.forEach(item => {
            html += `
                <div class="cart-item" data-id=${item.catalogId}>
                    <button class="remove-item">X</button>
                    <img src="${item.imageSrc}" alt="product photo">
                    <div class="product-description">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                    <div class="quantity">
                        <button class="decrement-quantity">-</button>
                        <input type="text" class="quantity-input" name="quantity" min="1" value="${item.amount}">
                        <button class="increment-quantity">+</button>
                    </div>
                    <h3>$${item.price}</h3>
                </div>
            `
        });
        return html !== "" ? html : "<h2>Your cart is empty</h2>";
    }

    updateCart(event) {
        const userInput = event.currentTarget.querySelector(".quantity-input");
        const cartItems = document.getElementById("cart").querySelector(".cart-items");

        switch (event.type) {
            case "click":
                if (event.target === userInput) return;
                this.handleButtonClick(event);
                break;
            case "change":
                this.handleInputChange(event);
                break;
            default:
                console.error("Niether button or input element");
                return;
        }

        if (parseInt(userInput.value) <= 0) event.currentTarget.remove();

        const remainingItems = document.querySelectorAll(".cart-item");
        if (remainingItems.length === 0) cartItems.innerHTML = "<h2>Your cart is empty</h2>";

        cart.saveCartTimeout(1500);
    }

    validateInput(event) {
        const input = event.target;
        const key = event.key;

        switch (key) {
            case "Enter":
                event.preventDefault();
                input.blur();
                return;
        }

        
        const isNumber = /^[1-9]$/.test(key);
        const inputLength = input.value.length;
        const isCharacter = /^.$/.test(key);

        if (isCharacter && (!isNumber || inputLength + 1 > 2)) {
            event.preventDefault();
            return;
        }
    }

    handleInputChange(event) {
        const cartItem = event.currentTarget;
        const catalogId = parseInt(cartItem.getAttribute("data-id"));
        const inputValue = event.target.value;
        const inputAmount = parseInt(inputValue);
        
        if (inputAmount <= 0) {
            cart.deleteItem(catalogId);
            cartItem.remove();
            return;
        } else if (inputValue === "") {
            const item = cart.findItem(catalogId);
            event.target.value = item.amount;
            return;
        }
        cart.updateAmount(catalogId, inputAmount);
    }

    handleButtonClick(event) {
        event.preventDefault();

        const cartItem = event.currentTarget;
        const catalogId = parseInt(cartItem.getAttribute("data-id"));
        const btn = event.target;
        const userInput = cartItem.querySelector(".quantity-input");
        const inputValue = parseInt(userInput.value);

        switch (true) {
            case btn.classList.contains("remove-item"):
                cart.deleteItem(catalogId);
                cartItem.remove();
                break;
            case btn.classList.contains("increment-quantity"):
                cart.addAmount(catalogId, 1);
                userInput.value = inputValue + 1;
                break;
            case btn.classList.contains("decrement-quantity"):
                cart.addAmount(catalogId, -1);
                userInput.value = inputValue - 1;
                break;
            default:
                console.error("Unknown button action");
        }
    }

    setEventListeners() {
        const cartItemNodeList = document.querySelectorAll(".cart-item");
        const checkout = document.getElementById("checkout");
        
        cartItemNodeList.forEach(item => {
            item.addEventListener("change", e => this.updateCart(e));
            item.addEventListener("click", e => this.updateCart(e));
            item.addEventListener("keydown", e => this.validateInput(e));
        });
        // Note: The blur event only triggers when an eventListener is attached to the input
        // element directly, but not the div element ".cart-item". "change" event works when an
        // eventListener is attached to the div or input element.

        checkout.addEventListener("click", () => {
            alert("Thank you for your purchase!");
        });
    }
}