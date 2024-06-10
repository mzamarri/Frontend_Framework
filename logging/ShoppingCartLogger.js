const ShoppingCart = require('../app/static/ShoppingCart.js');
const AbstractLogger = require('./AbstractLogger.js');

module.exports = class extends AbstractLogger {
    constructor(isLogging) {
        super(isLogging);
    }

    log() {
        console.log("ShoppingCartLogger.log called");
    }

    addToCart(item) {
        
    }
}