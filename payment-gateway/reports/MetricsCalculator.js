const TransactionStatus = require('../core/TransactionStatus');

class MetricsCalculator {
    static calculate(transactions) {
        const total = transactions.length;

        let totalAmount = 0;
        let successful = 0;
        let failed = 0;
        let pending = 0;

        let totalProcessingTime = 0;
        let processedCount = 0;

        const byProvider = {};

        for (const t of transactions) {
            totalAmount += t.amount || 0;

            if (
                t.status === TransactionStatus.COMPLETED ||
                t.status === TransactionStatus.PAID
            ) {
                successful++;
            } else if (t.status === TransactionStatus.FAILED) {
                failed++;
            } else {
                pending++;
            }

            if (typeof t.processingTime === 'number') {
                totalProcessingTime += t.processingTime;
                processedCount++;
            }

            if (t.provider) {
                if (!byProvider[t.provider]) {
                    byProvider[t.provider] = { count: 0, amount: 0 };
                }
                byProvider[t.provider].count++;
                byProvider[t.provider].amount += t.amount || 0;
            }
        }

        return {
            total,
            totalAmount,
            successful,
            failed,
            pending,
            averageProcessingTime:
                processedCount === 0
                    ? 0
                    : totalProcessingTime / processedCount,
            byProvider
        };
    }
}

module.exports = MetricsCalculator;
