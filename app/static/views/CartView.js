import AbstractView from "../Modules/Views/AbstractView.js";
import { cart } from "../index.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Cart");
        this.cartId = "cart";
        this.cartItemsId = "cart-items";
    }

    render(domObj, html) {
        domObj.innerHTML = html;
        this.setEventListeners();
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
                    <button class="remove-item" >X</button>
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
        event.preventDefault();
        switch (event.target.tagName) {
            case "INPUT":
                this.handleInputChange(event);
            case "BUTTON":
                this.handleButtonClick(event);
            default:

        }
    }

    handleInputChange(event) {
        const cartItem = event.currentTarget;
        const catalogId = parseInt(cartItem.getAttribute("data-id"));
        const inputAmount = parseInt(event.target.value);
        
        if (inputAmount <= 0) {
            this.cart.removeFromCart(catalogId);
            cartItem.remove();
            return;
        }
        cart.updateAmount(inputAmount);
    }

    handleButtonClick(event) {
        const cartItem = event.currentTarget;
        const catalogId = parseInt(cartItem.getAttribute("data-id"));
        const btn = event.target
        const input = cartItem.querySelector(".quantity-input");
        const inputAmount = parseInt(input.value);

        const btnType = ["remove-item", "increment-quantity", "decrement-quantity"]
            .find(action => btn.classList.contains(action));

        switch (btnType) {
            case "remove-item":
                cart.deleteItem(catalogId);
                cartItem.remove();
                break;
            case "increment-quantity":
                cart.addAmount(catalogId, 1);
                input.value = inputAmount + 1;
                break;
            case "decrement-quantity":
                cart.addAmount(catalogId, -1);
                input.value = inputAmount - 1;
                break;
            default:
                throw new Error("Unknown button action");
        }
    }

    setEventListeners() {
        const cartItems = document.getElementById("cart").querySelector(".cart-items");
        const cartItemNodeList = cartItems.querySelectorAll(".cart-item");
        const checkout = document.getElementById("checkout");
        
        cartItemNodeList.forEach(item => item.addEventListener("click", (event) => {
            clearTimeout(this.timeout);
            this.updateCart(event);

            const remainingItems = document.querySelectorAll(".cart-item");
            if (remainingItems.length === 0) cartItems.innerHTML = "<h2>Your cart is empty</h2>";

            this.timeout = setTimeout(() => {
                cart.saveCart();
                console.log("Cart saved...")
            }, 1500);
        }));

        checkout.addEventListener("click", () => {
            alert("Thank you for your purchase!");
        });
    }
}