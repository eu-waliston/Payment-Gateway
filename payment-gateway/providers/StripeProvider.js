const ProviderInterface = require('./ProviderInterface');

class StripeProvider extends ProviderInterface {
    constructor() {
        super('stripe');
    }

    async process(paymentData) {
        console.log('💳 Processando com Stripe...');
        await this.sleep(500);

        if (paymentData.amount > 50000) {
            throw new Error('Valor acima do limite do Stripe');
        }

        return {
            provider: this.name,
            status: 'completed',
            transactionId: `STR_${Date.now()}`,
            authorizationCode: Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = StripeProvider;
