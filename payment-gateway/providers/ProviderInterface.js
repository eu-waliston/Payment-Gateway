class ProviderInterface {
    constructor(name) {
        if (!name) {
            throw new Error('Provider deve ter um nome');
        }
        this.name = name;
    }

    /**
     * Processa um pagamento
     * @param {Object} paymentData
     * @returns {Promise<Object>}
     */
    async process(paymentData) {
        throw new Error(`Provider ${this.name} não implementou process()`);
    }
}

module.exports = ProviderInterface;
