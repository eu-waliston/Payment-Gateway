class PaymentError extends Error {
    constructor(message, transactionId = null, code = 'PAYMENT_ERROR') {
        super(message);
        this.name = 'PaymentError';
        this.code = code;
        this.transactionId = transactionId;
        this.timestamp = new Date().toISOString();
    }
}

class ValidationError extends PaymentError {
    constructor(message) {
        super(message, null, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

class FraudError extends PaymentError {
    constructor(message) {
        super(message, null, 'FRAUD_ERROR');
        this.name = 'FraudError';
    }
}

class ProviderError extends PaymentError {
    constructor(message, provider) {
        super(message, null, 'PROVIDER_ERROR');
        this.provider = provider;
        this.name = 'ProviderError';
    }
}

module.exports = {
    PaymentError,
    ValidationError,
    FraudError,
    ProviderError
};
