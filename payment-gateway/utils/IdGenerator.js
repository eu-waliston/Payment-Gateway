class IdGenerator {
    static transaction() {
        return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    }

    static receipt(transactionId) {
        return `REC_${transactionId}`;
    }
}

module.exports = IdGenerator;
