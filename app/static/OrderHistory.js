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
        sessionStorage.setItem("orderHistory", JSON.stringify(this.orderHistory));
    }

    loadOrderHistory() {
        return JSON.parse(sessionStorage.getItem("orderHistory")) || [];
    }
}