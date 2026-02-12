const TransactionStatus = require('./TransactionStatus');
const { TransactionError } = require('./TransactionErrors');

class TransactionValidator {
    static canTransition(from, to) {
        const allowed = {
            [TransactionStatus.PENDING]: [
                TransactionStatus.PROCESSING,
                TransactionStatus.FAILED
            ],
            [TransactionStatus.PROCESSING]: [
                TransactionStatus.COMPLETED,
                TransactionStatus.FAILED
            ],
            [TransactionStatus.COMPLETED]: [],
            [TransactionStatus.FAILED]: []
        };

        if (!allowed[from]?.includes(to)) {
            throw new TransactionError(
                `Transição inválida: ${from} → ${to}`
            );
        }
    }
}

module.exports = TransactionValidator;
