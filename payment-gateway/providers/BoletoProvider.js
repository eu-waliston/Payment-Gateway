const ProviderInterface = require('./ProviderInterface');

class PixProvider extends ProviderInterface {
    constructor() {
        super('pix');
    }

    async process(paymentData) {
        console.log('📱 Gerando PIX...');
        await this.sleep(300);

        const code = Math.random().toString(36).substring(2, 22);

        return {
            provider: this.name,
            status: 'pending',
            transactionId: `PIX_${Date.now()}`,
            qrCode: `PIX:${code}`,
            qrCodeText: code,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = PixProvider;
