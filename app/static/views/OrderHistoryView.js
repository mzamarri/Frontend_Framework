import AbstractView from "../Modules/Views/AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Order History");
        this.orderHistory = [
            {
                id: "123",
                date: "01/01/2021",
                totalPrice: 100.00,
                items: {
                    "1": {
                        amount: 1,
                        item: {
                            name: "Product 1",
                            price: 50.00,
                            imageSrc: "#",
                            description: "Product 1 description"
                        }
                    },
                    "2": {
                        amount: 2,
                        item: {
                            name: "Product 2",
                            price: 25.00,
                            imageSrc: "#",
                            description: "Product 2 description"
                        }
                    }
                }
            }, 
            {
                id: "456",
                date: "01/02/2021",
                totalPrice: 75.00,
                items: {
                    "3": {
                        amount: 1,
                        item: {
                            name: "Product 3",
                            price: 75.00,
                            imageSrc: "#",
                            description: "Product 3 description"
                        }
                    }
                }
            },
            {
                id: "657",
                date: "07/04/2023",
                totalPrice: 75.00,
                items: {
                    "3": {
                        amount: 1,
                        item: {
                            name: "Product 3",
                            price: 75.00,
                            imageSrc: "#",
                            description: "Product 3 description"
                        }
                    },
                    "2": {
                        amount: 2,
                        item: {
                            name: "Product 2",
                            price: 25.00,
                            imageSrc: "#",
                            description: "Product 2 description"
                        }
                    }
                }
            }
        ];
    }

    getHtml() {
        // const orderHistory = this.loadOrderHistory();
        let orderHistory = this.orderHistory;
        return `
            <div class="order-history-container">
                <h1>Order History</h1>
                <div class="order-history" id="order-history">
                    ${orderHistory.map(order => `
                            <div class="order">
                                <div class="order-summary">
                                    <h2>Order ID: ${order.id}</h2>
                                    <h3>Order Date: ${order.date}</h3>
                                    <h3>Order Total: $${order.totalPrice}</h3>
                                </div>
                                <div class="order-items">
                                    ${Object.entries(order.items).map(([id, orderItem]) => `
                                        <div class="item" data-id="${id}">
                                            <img src="${orderItem.item.imageSrc}" alt="product photo">
                                            <a href="#">${orderItem.item.name}</a>
                                            <h3>$${orderItem.item.price}</h3>
                                            <h3>Quantity: ${orderItem.amount}</h3>
                                            <h3>Subtotal: $${orderItem.item.price * orderItem.amount}</h3>
                                        </div>
                                    `).join(" ")}
                                </div>
                            </div>
                        `).join(" ")}
                </div>
            </div>
        `
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