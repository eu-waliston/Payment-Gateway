const {
    PaymentGateway,
    Providers
} = require('../index');

const Logger = require('../utils/Logger');
const MemoryStorage = require('../storage/MemoryStorage');
const Blacklist = require('../security/Blacklist');
const FraudDetector = require('../security/FraudDetector');
const WebhookManager = require('../webhooks/WebhookManager');
const WebhookSender = require('../webhooks/WebhookSender');

const logger = new Logger();
const storage = new MemoryStorage();
const blacklist = new Blacklist();

const fraud = new FraudDetector(blacklist, storage, logger);
const webhooks = new WebhookManager(new WebhookSender(), logger);

const gateway = new PaymentGateway({
    providers: [
        new Providers.Stripe(),
        new Providers.PayPal(),
        new Providers.Pix(),
        new Providers.Boleto()
    ],
    repository: storage,
    fraudDetector: fraud,
    webhookManager: webhooks,
    logger
});

webhooks.register('payment.processed', 'https://minhaapi.com/webhook');

(async () => {
    const tx = await gateway.processPayment({
        amount: 199.9,
        currency: 'BRL',
        provider: 'stripe',
        paymentMethod: 'credit_card',
        customerEmail: 'cliente@email.com',
        cardDetails: {
            number: '4111111111111111',
            holderName: 'João',
            expiryMonth: 12,
            expiryYear: 2026,
            cvv: '123'
        }
    });

    console.log(tx);
})();
