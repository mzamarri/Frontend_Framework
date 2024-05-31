import AbstractView from "../Modules/Views/AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Catalog");
    }

    getHtml() {
        return `
            <div class="catalog">
                <div class="result-filter">
                    <h2># of Items</h2>
                    <div>
                        Filter goes here
                    </div>
                </div>
                <div class="game-catalog">
                    <div class="item">
                        <img src="" alt="product photo">
                        <p>Product Details</p>
                        <h3>Product Price</h3>
                        <button>Add to Cart</button>
                    </div>
                    <div class="item">
                        <img src="" alt="product photo">
                        <p>Product Details</p>
                        <h3>Product Price</h3>
                        <button>Add to Cart</button>
                    </div>
                    <div class="item">
                        <img src="" alt="product photo">
                        <p>Product Details</p>
                        <h3>Product Price</h3>
                        <button>Add to Cart</button>
                    </div>
                    <div class="item">
                        <img src="" alt="product photo">
                        <p>Product Details</p>
                        <h3>Product Price</h3>
                        <button>Add to Cart</button>
                    </div>
                    <div class="item">
                        <img src="" alt="product photo">
                        <p>Product Details</p>
                        <h3>Product Price</h3>
                        <button>Add to Cart</button>
                    </div>
                    <div class="item">
                        <img src="" alt="product photo">
                        <p>Product Details</p>
                        <h3>Product Price</h3>
                        <button>Add to Cart</button>
                    </div>
                </div>
                <div class="pagination" id="catalog-pagination">
                    <ul>
                        <li><a href="#" class="active">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#">...</a></li>
                    </ul>
                </div>
            </div>
        `
    }
}