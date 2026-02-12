const MemoryStorage = require('../../storage/MemoryStorage');
const MetricsCalculator = require('../../reports/MetricsCalculator');

describe('Dashboard integration', () => {
    it('gera métricas a partir do storage', () => {
        const repo = new MemoryStorage();

        repo.save({ id: '1', amount: 100, status: 'completed', processingTime: 200 });
        repo.save({ id: '2', amount: 200, status: 'failed', processingTime: 300 });

        const transactions = repo.findAll();
        const metrics = MetricsCalculator.calculate(transactions);

        expect(metrics.total).toBe(2);
        expect(metrics.totalAmount).toBe(300);
        expect(metrics.failed).toBe(1);
    });
});
