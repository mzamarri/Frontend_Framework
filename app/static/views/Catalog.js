import AbstractView from "../Modules/Views/AbstractView.js";
import itemList from "../productList.js";

export default class extends AbstractView {
    constructor() {
        super();
        super.setTitle("Catalog");
        this.items = itemList;
        this.currentPage = 1;
    }

    getHtml() {
        let productListHTML = this.createProductList();
        let paginationHTML = this.createPagination();
        return `
            <div class="catalog">
                <div class="result-filter">
                    <h2>${this.items.length} of Items</h2>
                    <div>
                        Filter goes here
                    </div>
                </div>
                <div class="game-catalog">
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
        let html = ""
        let itemList = this.items.slice((this.currentPage - 1) * 50, this.currentPage * 50);
        itemList.forEach(item => {
            html += `
                <div class="item">
                    <img src="${item.imageSrc}" alt="product photo">
                    <p>${item.description}</p>
                    <h3>$${item.price}</h3>
                    <button>Add to Cart</button>
                </div>
            `
        })
        return html;
    }

    createPagination() {
        let numOfPages = Math.ceil(this.items.length / 50);
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

    selectPage() {
        let pagination = document.getElementById("catalog-pagination");
        pagination.addEventListener("click", (e) => {
            e.preventDefault();
            this.currentPage = parseInt(e.target.innerText);
            pagination.querySelector("a.active").classList.remove("active");
            e.target.classList.add("active");
        });
    }

    setEventListeners() {
        this.selectPage();
    }
}