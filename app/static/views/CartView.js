import AbstractView from "../Modules/Views/AbstractView.js";
import { cart, orderHistory } from "../index.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Cart");
        this.originalValue = "";
    }

    async getHtml() {
        const cartItems = await cart.getCart();

        const cartHtml = this.getCart(cartItems);
        return `
            <div class="cart-container">
                <h1>Cart</h1>
                <form class="cart" id="checkout-form" action="/order-history/submit-order" method="post">
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
                <div class="cart-item">
                    <button class="remove-item">X</button>
                    <img src="${item.imageSrc}" alt="product photo">
                    <div class="product-description">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                    <div class="quantity">
                        <button class="decrement-quantity">-</button>
                        <input 
                            type="text" 
                            class="quantity-input" 
                            name="quantity" 
                            value="${item.amount}"
                        >
                        <button class="increment-quantity">+</button>
                    </div>
                    <input 
                        type="hidden" 
                        name="catalogId" 
                        value="${item.catalogId}"
                    >
                    <h3>$${item.price}</h3>
                </div>
            `
        });
        return html !== "" ? html : "<h2>Your cart is empty</h2>";
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

    updateCart(event, cartItem) {
        switch (event.target.tagName) {
            case 'BUTTON':
                this.handleButtonClick(event, cartItem);
                break;
            case 'INPUT':
                this.handleInputChange(event, cartItem);
                break;
        }

        const cartItems = document.getElementById("cart-items");
        const remainingItems = cartItems.querySelectorAll(".cart-item");
        if (remainingItems.length === 0) cartItems.innerHTML = "<h2>Your cart is empty</h2>";

        cart.saveCartTimeout(60000); // 60000 ms timer to save cart
    }

    handleInputChange(event, cartItem) {
        const catalogId = parseInt(cartItem.querySelector('input[name="catalogId"]').value);
        const userInput = event.target;
        const inputValue = userInput.value;
        const itemAmount = parseInt(inputValue);
        
        if (itemAmount <= 0) {
            cart.deleteItem(catalogId);
            cartItem.remove();
            return;
        } else if (inputValue === "") {
            const item = cart.findItem(catalogId);
            event.target.value = item.amount;
            return;
        }
        cart.updateAmount(catalogId, itemAmount);
    }

    handleButtonClick(event, cartItem) {
        event.preventDefault();

        const catalogId = parseInt(cartItem.querySelector('input[name="catalogId"]').value);
        const btn = event.target;
        const userInput = cartItem.querySelector('input[name="quantity"]');

        switch (btn.getAttribute("class")) {
            case "remove-item":
                cart.deleteItem(catalogId);
                cartItem.remove();
                return;
            case "increment-quantity":
                cart.addAmount(catalogId, 1);  
                break;
            case "decrement-quantity":
                cart.addAmount(catalogId, -1);
                break;
            default:
                console.error("Unknown button action");
                return;
        }

        const item = cart.findItem(catalogId);
        userInput.value = item.amount;
        if (item.amount <= 0) cartItem.remove();
    }

    async submitOrder(event) {
        event.preventDefault();

        const cartItems = [];
        const cartItemElements = event.currentTarget.querySelectorAll(".cart-item");

        cartItemElements.forEach(item => {
            const catalogId = item.querySelector('input[name="catalogId"]').value;
            const amount = item.querySelector('input[name="quantity"]').value;

            cartItems.push({
                catalogId: parseInt(catalogId),
                amount: parseInt(amount)
            });
        });

        await orderHistory.submitOrder(cartItems);
    }

    setEventListeners() {
        const cartItemNodeList = document.querySelectorAll(".cart-item");
        const checkoutForm = document.getElementById("checkout-form");
        
        cartItemNodeList.forEach(item => {
            const btns = item.querySelectorAll("button")
            const userInput = item.querySelector('input[name="quantity"]');
            
            btns.forEach(btn => btn.addEventListener("click", e => this.updateCart(e, item)));
            userInput.addEventListener("change", e => this.updateCart(e, item));
            userInput.addEventListener("keydown", e => this.validateInput(e));
        });
        // Note: The blur event only triggers when an eventListener is attached to the input
        // element directly, but not the div element ".cart-item". "change" event works when an
        // eventListener is attached to the div or input element.

        checkoutForm.addEventListener("submit", async e => this.submitOrder(e));
    }
}