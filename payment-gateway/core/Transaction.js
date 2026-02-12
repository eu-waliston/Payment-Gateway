class Transaction {
    constructor({
        id,
        amount,
        currency,
        provider,
        paymentMethod,
        customerEmail,
        status,
        providerResponse = null,
        attempts = 0,
        createdAt = new Date(),
        processedAt = null,
        processingTime = null,
        error = null
    }) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.provider = provider;
        this.paymentMethod = paymentMethod;
        this.customerEmail = customerEmail;
        this.status = status;
        this.providerResponse = providerResponse;
        this.attempts = attempts;
        this.createdAt = createdAt;
        this.processedAt = processedAt;
        this.processingTime = processingTime;
        this.error = error;
    }

    isFinal() {
        return ['completed', 'failed', 'paid'].includes(this.status);
    }

    markCompleted(response) {
        this.status = 'completed';
        this.providerResponse = response;
        this.processedAt = new Date();
    }

    markFailed(error) {
        this.status = 'failed';
        this.error = error;
        this.processedAt = new Date();
    }
}

module.exports = Transaction;
