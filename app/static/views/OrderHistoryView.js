import AbstractView from "../Modules/Views/AbstractView.js";
import OrderHistory from "../OrderHistory.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Order History");
        this.orderHistory = new OrderHistory();
    }

    async getHtml() {
        const orders = await this.orderHistory.loadOrderHistory();
        let orderHistory = this.orderHistory.getOrder();
        return `
            <div class="order-history-container">
                <h1>Order History</h1>
                <div class="order-history" id="order-history">
                    ${this.getOrders(orders)}
                </div>
            </div>
        `
    }

    getOrders(orders) {
        return orders.map(order => `
            <div class="order">
                <div class="order-summary">
                    <h2>Order ID: ${order.userId}</h2>
                    <h3>Order Date: ${order.date}</h3>
                    <h3>Order Total: $${order.totalPrice}</h3>
                </div>
                <div class="order-items">
                    ${this.getOrderItems(order.items)}
                </div>
            </div>
        `).join(" ");
    }

    getOrderItems(orderItems) {
        return orderItems.map(item => `
            <div class="item" data-id="${item.catalogId}">
                <img src="${item.imageSrc}" alt="product photo">
                <a href="#">${item.name}</a>
                <h3>$${item.price}</h3>
                <h3>Quantity: ${item.amount}</h3>
                <h3>Subtotal: $${item.price * item.amount}</h3>
            </div>
        `).join(" ");
    }

    showItems(event) {

    }

    setEventListeners() {
        const orders = document.getElementById("order-history").querySelectorAll(".order");
        orders.forEach(order => {
            order.querySelector(".order-summary").addEventListener("click", (e) => {
                const orderItems = e.currentTarget.parentNode.querySelector(".order-items");
                orderItems.classList.toggle("show-items");
            });
        });
    }
}