const MetricsCalculator = require('../../reports/MetricsCalculator');

describe('MetricsCalculator', () => {
    it('calcula métricas corretamente', () => {
        const transactions = [
            { amount: 100, status: 'completed', processingTime: 200, provider: 'stripe' },
            { amount: 50, status: 'failed', processingTime: 100, provider: 'pix' },
            { amount: 300, status: 'pending', provider: 'boleto' }
        ];

        const result = MetricsCalculator.calculate(transactions);

        expect(result.total).toBe(3);
        expect(result.totalAmount).toBe(450);
        expect(result.successful).toBe(1);
        expect(result.failed).toBe(1);
        expect(result.pending).toBe(1);
        expect(result.averageProcessingTime).toBe(150);
        expect(result.byProvider.stripe.count).toBe(1);
    });

    it('lida com lista vazia', () => {
        const result = MetricsCalculator.calculate([]);

        expect(result.total).toBe(0);
        expect(result.totalAmount).toBe(0);
        expect(result.averageProcessingTime).toBe(0);
    });
});
