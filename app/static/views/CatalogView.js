import AbstractView from "../Modules/Views/AbstractView.js";
import { cart } from "../index.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Catalog");
        this.currentPage = 1;
        this.cart = cart;
    }

    async getHtml() {
        this.catalog = await fetch('/catalog/get-catalog')
        .then(res => res.json());

        let productListHTML = this.createProductList();
        let paginationHTML = this.createPagination();
        return `
            <div class="catalog">
                <div class="result-filter">
                    <h2>${this.catalog.length} of Items</h2>
                    <div>
                        Filter goes here
                    </div>
                </div>
                <div class="game-catalog" id="game-catalog">
                    ${productListHTML}
                </div>
                <div class="pagination" id="catalog-pagination">
                    <ul>
                        ${paginationHTML}
                    </ul>
                </div>
            </div>
        `
    }

    createProductList() {
        let html = "";
        const startIndex = (this.currentPage - 1) * 60;
        const itemsToDisplay = [...this.catalog].splice(startIndex, 60);
        itemsToDisplay.forEach(item => {
            html += `
                <div class="item">
                    <img src="${item.imageSrc}" alt="product photo">
                    <p>${item.description}</p>
                    <h3>$${item.price}</h3>
                    <button class="add-cart" data-id="${item.catalogId}">Add to Cart</button>
                </div>
            `
        })
        return html;
    }

    createPagination() {
        let numOfPages = Math.ceil(this.catalog.length / 60);
        let html = "";
        for (let i = 1; i <= numOfPages; i++) {
            if (i === this.currentPage) {
                html += `<li><a href="/catalog/${i}" class="active">${i}</a></li>`
            } else {
                html += `<li><a href="/catalog/${i}">${i}</a></li>`
            }
        }
        return html;
    }

    selectPageEventListener() {
        const pagination = document.getElementById("catalog-pagination");
        pagination.addEventListener("click", e => {
            e.preventDefault();
            if (e.target.tagName === "A") {
                e.currentTarget.querySelector("a.active").classList.remove("active");
                e.target.classList.add("active");
                this.currentPage = parseInt(e.target.innerText);
                this.catalogList.innerHTML = this.createProductList();
                this.setAddToCartEventListener();
                this.catalogList.scrollTo(0, 0);
            }
        })
    }

    addToCartEventListener() {
        this.catalogList.querySelectorAll("button.add-cart").forEach(btn => {
            btn.addEventListener("click", e => {
                const catalogId = e.target.getAttribute("data-id")
                cart.addItem(parseInt(catalogId));
                cart.saveCartTimeout(1500);
            });
        });
    }

    setEventListeners() {
        this.catalogList = document.getElementById("game-catalog");
        
        this.addToCartEventListener();
        this.selectPageEventListener();
    }
}