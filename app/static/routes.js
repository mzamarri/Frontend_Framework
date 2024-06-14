import Catalog from "./views/CatalogView.js";
import Cart from "./views/CartView.js";
import OrderHistory from "./views/OrderHistoryView.js";

export default  [
    {path: "/", view: Catalog},
    {path: "/cart", view: Cart},
    {path: "/orderhistory", view: OrderHistory}
]