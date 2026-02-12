class MetricsCalculator {
    static calculate(transactions) {
        const total = transactions.length;

        return {
            total,
            totalAmount: transactions.reduce((s, t) => s + (t.amount || 0), 0),
            successful: transactions.filter(t => ['completed', 'paid'].includes(t.status)).length,
            failed: transactions.filter(t => t.status === 'failed').length,
            pending: transactions.filter(t => t.status === 'pending').length,
            averageProcessingTime:
                total === 0
                    ? 0
                    : transactions.reduce((s, t) => s + (t.processingTime || 0), 0) / total
        };
    }
}

module.exports = MetricsCalculator;
