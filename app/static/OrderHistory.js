export default class {
    constructor(cart) {
        this.cart = cart;
        this.orderHistory = [];
    }

    /*
    * Adds an order to the order history. The order object should have the following properties:
    * {
    *   orderId: string,
    *   date: string,
    *   totalPrice: number,
    *   items: [{
    *       itemId: {
    *           amount: int,
    *           item: {
    *               name: string,
    *               price: float,
    *               imageSrc: string,
    *               description: string,
    *           }
    *       },
    *   ...]
    *   }
    * }
    */
    addOrder(order) {
        this.orderHistory.push(order);
        this.saveOrderHistoryToSessionStorage();
    }

    saveOrderHistory() {
        // sessionStorage.setItem("orderHistory", JSON.stringify(this.orderHistory));
    }

    async loadOrderHistory() {
        const url = "/order-history/get-orders";
        return await fetch(url)
            .then(res => res.json())
            .then(data => {
                this.orderHistory = data;
                return data;
            })
            .catch(err => console.error(err));

    }

    getOrder() {
        return [
            {
                userId: "123",
                date: "01/01/2021",
                totalPrice: 100.00,
                items: {
                    "1": {
                        amount: 1,
                        item: {
                            name: "Product 1",
                            price: 50.00,
                            imageSrc: "",
                            description: "Product 1 description"
                        }
                    },
                    "2": {
                        amount: 2,
                        item: {
                            name: "Product 2",
                            price: 25.00,
                            imageSrc: "",
                            description: "Product 2 description"
                        }
                    }
                }
            }, 
            {
                userId: "456",
                date: "01/02/2021",
                totalPrice: 75.00,
                items: {
                    "3": {
                        amount: 1,
                        item: {
                            name: "Product 3",
                            price: 75.00,
                            imageSrc: "",
                            description: "Product 3 description"
                        }
                    }
                }
            },
            {
                userId: "657",
                date: "07/04/2023",
                totalPrice: 75.00,
                items: {
                    "3": {
                        amount: 1,
                        item: {
                            name: "Product 3",
                            price: 75.00,
                            imageSrc: "",
                            description: "Product 3 description"
                        }
                    },
                    "2": {
                        amount: 2,
                        item: {
                            name: "Product 2",
                            price: 25.00,
                            imageSrc: "",
                            description: "Product 2 description"
                        }
                    }
                }
            }
        ];
    }
}