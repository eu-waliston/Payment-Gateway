const Validator = require('./Validator');
const { PaymentError } = require('./Errors');
const IdGenerator = require('../utils/IdGenerator');
const ReportGenerator = require('../reports/ReportGenerator');

class PaymentGateway {
    constructor({
        providers = [],
        repository,
        fraudDetector,
        webhookManager,
        logger,
        config = {}
    }) {
        this.providers = new Map();
        providers.forEach(p => this.providers.set(p.name, p));

        this.repository = repository;
        this.fraudDetector = fraudDetector;
        this.webhookManager = webhookManager;
        this.logger = logger;

        this.config = {
            retryAttempts: 3,
            retryDelay: 1000,
            ...config
        };

        this.logger.log('Gateway inicializado', 'success');
    }

    getProvider(name) {
        const provider = this.providers.get(name);
        if (!provider) throw new PaymentError(`Provedor ${name} não encontrado`);
        return provider;
    }

    async processPayment(data) {
        const transactionId = IdGenerator.transaction();
        const start = Date.now();

        try {
            Validator.validatePayment(data);
            await this.fraudDetector.analyze(data);

            const provider = this.getProvider(data.provider);
            let result;
            let attempts = 0;

            while (attempts < this.config.retryAttempts) {
                try {
                    result = await provider.process(data);
                    break;
                } catch (err) {
                    attempts++;
                    if (attempts >= this.config.retryAttempts) throw err;
                    await new Promise(r => setTimeout(r, this.config.retryDelay));
                }
            }

            const transaction = {
                id: transactionId,
                ...data,
                status: result.status,
                providerResponse: result,
                createdAt: new Date(),
                processedAt: new Date(),
                processingTime: Date.now() - start,
                attempts
            };

            this.repository.save(transaction);
            await this.webhookManager.trigger('payment.processed', transaction);

            return transaction;
        } catch (err) {
            const failed = {
                id: transactionId,
                ...data,
                status: 'failed',
                error: err.message,
                createdAt: new Date(),
                processingTime: Date.now() - start
            };

            this.repository.save(failed);
            await this.webhookManager.trigger('payment.failed', failed);

            throw err;
        }
    }

    getTransaction(id) {
        return this.repository.findById(id);
    }

    getTransactions() {
        return this.repository.findAll();
    }

    getSummary() {
        return ReportGenerator.summary(this.repository.findAll());
    }
}

module.exports = PaymentGateway;
