module.exports = {
    PaymentGateway: require('./core/Gateway'),
    Providers: {
        Stripe: require('./providers/StripeProvider'),
        PayPal: require('./providers/PayPalProvider'),
        Pix: require('./providers/PixProvider'),
        Boleto: require('./providers/BoletoProvider')
    },
    Errors: require('./core/Errors')
};
