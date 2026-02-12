const TransactionRepository = require('./TransactionRepository');

class MemoryStorage extends TransactionRepository {
    constructor() {
        super();
        this.transactions = new Map();
    }

    save(transaction) {
        this.transactions.set(transaction.id, transaction);
        return transaction;
    }

    findById(id) {
        return this.transactions.get(id);
    }

    findAll() {
        return Array.from(this.transactions.values());
    }

    findByCustomer(email, timeWindowMs) {
        const now = Date.now();
        return this.findAll().filter(t =>
            t.customerEmail === email &&
            now - new Date(t.createdAt).getTime() < timeWindowMs
        );
    }
}

module.exports = MemoryStorage;
