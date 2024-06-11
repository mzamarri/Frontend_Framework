import Catalog from "./views/Catalog.js";
import Cart from "./views/Cart.js";
import OrderHistory from "./views/OrderHistory.js";

export default  [
    {path: "/", view: Catalog},
    {path: "/cart", view: Cart},
    {path: "/orderhistory", view: OrderHistory}
]