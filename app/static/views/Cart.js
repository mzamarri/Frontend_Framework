import AbstractView from "../Modules/Views/AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Cart");
    }

    getHtml() {
        return `
            <h1>Cart</h1>
        `
    }
}