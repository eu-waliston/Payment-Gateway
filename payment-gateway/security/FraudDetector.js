const { FraudError } = require('../core/Errors');

class FraudDetector {
    constructor(blacklist, transactionRepository, logger) {
        this.blacklist = blacklist;
        this.transactionRepository = transactionRepository;
        this.logger = logger;
    }

    async analyze(paymentData) {
        const flags = [];

        if (paymentData.amount > 10000) {
            flags.push('high_amount');
        }

        const recent = this.transactionRepository
            .findByCustomer(paymentData.customerEmail, 60 * 60 * 1000);

        if (recent.length > 3) {
            flags.push('multiple_attempts');
        }

        if (paymentData.cardDetails) {
            const bin = paymentData.cardDetails.number.substring(0, 6);
            if (this.blacklist.isBinBlocked(bin)) {
                flags.push('suspicious_bin');
            }
        }

        if (flags.length) {
            this.logger.log(
                `Fraude suspeita: ${flags.join(', ')}`,
                'warn'
            );

            if (flags.includes('multiple_attempts') || flags.includes('suspicious_bin')) {
                throw new FraudError(`Transação bloqueada: ${flags.join(', ')}`);
            }
        }

        return flags;
    }
}

module.exports = FraudDetector;
