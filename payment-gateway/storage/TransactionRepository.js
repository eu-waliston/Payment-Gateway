class TransactionRepository {
    save(transaction) {
        throw new Error('save() não implementado');
    }

    findById(id) {
        throw new Error('findById() não implementado');
    }

    findAll() {
        throw new Error('findAll() não implementado');
    }

    findByCustomer(email, timeWindowMs) {
        throw new Error('findByCustomer() não implementado');
    }
}

module.exports = TransactionRepository;
