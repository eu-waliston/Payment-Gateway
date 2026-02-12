const { ValidationError } = require('./Errors');

class Validator {
    static validatePayment(data) {
        const required = ['amount', 'currency', 'provider', 'paymentMethod'];

        for (const field of required) {
            if (!data[field]) {
                throw new ValidationError(`Campo obrigatório: ${field}`);
            }
        }

        if (data.amount <= 0) {
            throw new ValidationError('Valor deve ser maior que zero');
        }

        if (!['BRL', 'USD', 'EUR'].includes(data.currency)) {
            throw new ValidationError('Moeda não suportada');
        }

        if (!['credit_card', 'debit_card', 'pix', 'boleto', 'paypal'].includes(data.paymentMethod)) {
            throw new ValidationError('Método de pagamento inválido');
        }

        if (['credit_card', 'debit_card'].includes(data.paymentMethod)) {
            this.validateCreditCard(data.cardDetails);
        }

        return true;
    }

    static validateCreditCard(card) {
        if (!card) throw new ValidationError('Dados do cartão obrigatórios');
        if (!card.number || card.number.length < 16) throw new ValidationError('Número do cartão inválido');
        if (!card.holderName) throw new ValidationError('Nome do titular obrigatório');
        if (!card.expiryMonth || !card.expiryYear) throw new ValidationError('Data de validade obrigatória');
        if (!card.cvv || card.cvv.length < 3) throw new ValidationError('CVV inválido');

        const now = new Date();
        const expiry = new Date(card.expiryYear, card.expiryMonth - 1);

        if (expiry < now) {
            throw new ValidationError('Cartão expirado');
        }
    }
}

module.exports = Validator;
