import AbstractView from "../Modules/Views/AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Order History");
    }

    getHtml() {
        return `
            <h1>Order History</h1>
        `
    }
}