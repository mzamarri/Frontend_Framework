export default class {
    constructor(cart) {
        this.cart = cart;
        this.orderHistory = [];
    }

    addOrder(order) {
        this.orderHistory.push(order);
        this.saveOrderHistoryToSessionStorage();
    }

    renderOrderHistory() {
        const orderHistory = this.loadOrderHistory();
        return `
            <div class="order-history-container">
                <h1>Order History</h1>
                <div class="order-history">
                    ${orderHistory.map(order => `
                            <div class="order">
                                <h2>Order ID: ${order.id}</h2>
                                <h3>Order Date: ${order.date}</h3>
                                <h3>Order Total: $${order.total}</h3>
                                <div class="order-items">
                                    ${order.items.map(item => `
                                            <div class="order-item">
                                                <img src="${item.imageSrc}" alt="product photo">
                                                <h3>${item.name}</h3>
                                                <h3>$${item.price}</h3>
                                                <h3>Quantity: ${item.amount}</h3>
                                                <h3>Subtotal: $${item.price * item.amount}</h3>
                                            </div>
                                        `)}
                                </div>
                        `)}
                </div>
            </div>
            
        `
    }

    saveOrderHistory() {
        sessionStorage.setItem("orderHistory", JSON.stringify(this.orderHistory));
    }

    loadOrderHistory() {
        return JSON.parse(sessionStorage.getItem("orderHistory")) || [];
    }
}