const Transaction = require('./Transaction');
const TransactionStatus = require('./TransactionStatus');

class TransactionFactory {
    static create({ id, paymentData }) {
        return new Transaction({
            id,
            amount: paymentData.amount,
            currency: paymentData.currency,
            provider: paymentData.provider,
            paymentMethod: paymentData.paymentMethod,
            customerEmail: paymentData.customerEmail,
            status: TransactionStatus.PENDING,
            createdAt: new Date()
        });
    }
}

module.exports = TransactionFactory;
