module.exports = class {
    constructor (isLogging) {
        if (new.target === module.exports) {
            throw new TypeError("Cannot construct Abstract instances directly")
        }
        this.isLogging = isLogging;
    }

    log(level, message) {
        if (this.constructor.prototype.Log === module.exports.prototype.Log) {
            throw new TypeError("Method Log must be implemented by subclass");
        }
        const timeStamp = new Date().toISOString();
        const logEntry = JSON.stringify({
            timeStamp,
            level,
            message
        })
        console.log(logEntry);
    }
}