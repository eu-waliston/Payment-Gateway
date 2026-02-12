js
const ProviderInterface = require('./ProviderInterface');

class PayPalProvider extends ProviderInterface {
    constructor() {
        super('paypal');
    }

    async process(paymentData) {
        console.log('🅿️ Processando com PayPal...');
        await this.sleep(800);

        return {
            provider: this.name,
            status: 'completed',
            transactionId: `PYP_${Date.now()}`,
            payerId: `PAYER_${Math.random().toString(36).substring(2, 10)}`
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = PayPalProvider;
