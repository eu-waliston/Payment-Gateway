class TransactionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TransactionError';
    }
}

module.exports = { TransactionError };
