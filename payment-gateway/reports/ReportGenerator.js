const MetricsCalculator = require('./MetricsCalculator');

class ReportGenerator {
    static summary(transactions) {
        const metrics = MetricsCalculator.calculate(transactions);

        return {
            ...metrics,
            byProvider: transactions.reduce((acc, t) => {
                acc[t.provider] = (acc[t.provider] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

module.exports = ReportGenerator;
