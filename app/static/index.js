import navigateTo, { router } from "./Modules/Routing/Router.js";
import ShoppingCart from "./ShoppingCart.mjs";

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", async () => {
    await cart.getCart();
    router();
});

document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});

const cart = new ShoppingCart();
export { cart };