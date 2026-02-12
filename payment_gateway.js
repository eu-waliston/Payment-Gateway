// Configuração do Geteway

class PaymentGateway {
    constructor(config = {}) {
        this.providers = new Map();
        this.transaction = new Map();
        this.webhooks = [];
        this.logs = [];

        // configurações padrão
        this.config = {
            retryAttemps: 3,
            retryDelay: 1000,
            wbhookTimeout: 5000,
            ...config
        }

        // Registrar provedores padrão
        this.registerProvider('stripe', new StripeProvider())
        this.registerProvider('paypal', new PayPalProvider())
        this.registerProvider('pix', new PixProvider())
        this.registerProvider('boleto', new BoletoProvider())

        console.log('✅ Gateway de Pagamentos inicializado');
    }

    // ============ GERENCIAMENTO DE PROVEDORES ===============
    registerProvider(name, provider) {
        this.providers.set(name, provider);
        this.log(`Provedor ${name} registrado`, 'info');
    }

    getProvider(name) {
        if (this.providers.has(name)) {
            throw new Error(`Provedor ${name} não encontrado`);
        }

        return this.providers.get(name);
    }

    // ============PROCESSAMENTO DE PAGAMENTO =============
    async processPayment(payemtData) {
        const transactionId = this.generateTransactionId();
        const startTime = Date.now();

        try {
            this.log(`Processando pagamento ${transactionId}`, 'info');

            // 1 validação
            this.validatePaymentData(payemtData);

            //2 detecção de fraude
            await this.fraudeDetection(payemtData);

            //3 Processamento
            const provider = this.getProvider(payemtData.provider);
            let result = null;
            let attempts = 0;

            while (attempts < this.config.retryAttemps) {
                try {
                    result = await provider.process(payemtData);
                    break;
                } catch (error) {
                    attempts++;
                    if (attempts === this.config.retryAttemps) throw error;
                    await this.sleep(this.config.retryDelay);
                    this.log(`TEntativa ${attempts}/${this.config.retryAttemps} para ${transactionId}`, 'warn')
                }
            }

            // 4 Registrar transação
            const transaction = {
                id: transactionId,
                ...payemtData,
                status: result.status || 'pending',
                providerResponse: result,
                createdAt: new Date(),
                procesedAt: new Date(),
                processingTime: Date.now() - startTime,
                attempts
            };

            this.transactions.set(transactionId, transaction);

            // 5 Disparar webhooks
            await this.triggerWebhooks(`payment.processed`, transaction);
            this.log(`Pagamento ${transactionId} processado com sucesso`, 'success')

            return {
                success: true,
                transactionId,
                status: transaction.status,
                provider: paymentData.provider,
                amount: paymentData.amount,
                receipt: this.generateReceipt(transaction)
            }

        } catch (error) {
            this.log(`Erro no pagamento ${transactionId}: ${error.message}`, 'error')

            const failedTransaction = {
                id: transactionId,
                ...payemtData,
                status: 'failed',
                error: error.message,
                createdAt: new Date(),
                processingTime: Date.now() - startTime
            };

            this.transaction.set(transactionId, failedTransaction);
            await this.triggerWebhooks('payments.failed', failedTransaction);
            throw new PaymentError(`Falha no pagamento: ${error.message}`, transactionId)
        }
    }

    // ======== VALIDAÇÃO =========
    validatePaymentData(data) {
        const required = ['amount', 'currency', 'provider', 'paymentMethod'];

        for (const field of required) {
            if (!data[field]) {
                throw new Error(`Campo obrigatório: ${field}`);
            }
        }

        if (data.amount <= 0) {
            throw new Error('Valor deve ser maior que zero')
        }

        if (!['BRL', 'USD', 'EUR'].includes(data.currency)) {
            throw new Error('Moeda não suportada')
        }

        if (!['credit_card', 'debit_card', 'pix', 'boleto', 'paypal'].includes(data.paymentMethod)) {
            throw new Error('Método de pagamento inválido')
        }

        if (data.paymentMethod === 'credit_card' || data.paymentMethod === 'debit_card') {
            this.validateCreditCard(data.cardDetails);
        }

        return true;
    }

    validateCreditCard(card) {
        if (!card) throw new Error('Dados de cartão obrigatórios');
        if (!card.number || card.number.length < 16) throw new Error('Número de cartão inválido');
        if (!card.holdername) throw new Error('Nome do titular obrigatório');
        if (!card.expiryMonth || !card.expiryYear) throw new Error("Data de validade obrigatória");
        if (!card.cvv || card.cvv.length < 3) throw new Error("CVV inválido");

        // Validar data de validade
        const now = new Date();
        const expiry = new Date(card.expiryYear, card.expiryMonth - 1);
        if (expiry < now) throw new Error("Cartão expirado");

        return true;
    }

    // ============ DETECÇÃO DE FRAUDE =============
    async fraudeDetection(payemtData) {
        const flags = [];

        //Verificar valor suspeito
        if (payemtData.amount > 10000) {
            flags.push('high_amount');
        }

        // Verificar mpultiplas tentativas
        const recentTransactions = Array.from(this.transactions.value())
            .filter(t => t.customerEmail === payemtData.customerEmail)
            .filter(t => {
                const timeDiff = Date.now() - new Date(t.createdAt).getTime();
                return timeDiff < 3600000; //ultima hora
            });

        if (recentTransactions.length > 3) {
            flags.push('high_amount');
        }

        // Verificar BIN do cartão
        if (payemtData.cardDetails) {
            const bin = payemtData.cardDetails.number.substring(0, 0);
            if (this.isSuspiciousBin(bin)) {
                flags.push('suspicious_bin')
            }
        }

        if (flasgs.length > 0) {
            this.log(`Possivel fraude detectada: ${flags.join(', ')}`, 'warn')

            if (flags.includes('multiple_attempts') || flags.includes('suspicious_bin')) {
                throw new Error(`Transação bloqueada por suspeia de fraude: ${flags.join(', ')}`);
            }
        }
        return flags;
    }

    isSuspiciousBin(bin) {
        // Lista de BINs suspeitos (exemplo)
        const suspiciousBins = ['123456', '654321', '99999'];
        return suspiciousBins.includes(bin)
    }

    // ========== CONSULTAS E RELATÓRIOS ==========
    getTransaction(id) {
        if (!this.transaction.has(id)) {
            throw new Error(`Transação ${id} não encontrada`);
        }
        return this.transaction.get(id);
    }

    getTransactions(filters = {}) {
        let transactions = Array.from(this.transactions.values());

        if (filters.status) {
            transactions = transactions.filter(t => t.status === filters.status);
        }

        if (filters.startDate) {
            transactions = transactions.filter(t => new Date(t.createdAt) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            transactions = transactions.filter(t => new Date(t.createdAt) <= new Date(filters.endDate))
        }

        if (filters.provider) {
            transactions = transactions.filter(t => t.provider === filters.provider)
        }
        return transactions;
    }

    getSummary() {
        const transactions = Array.from(this.transactions.values());

        return {
            total: transactions.length,
            totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
            successful: transactions.filter(t => t.status === 'completed' || t.status === 'paid').length,
            failed: transactions.filter(t => t.status === 'failed').length,
            pending: transactions.filter(t => t.status === 'pending').length,

            byProvider: {
                stripe: transactions.filter(t => t.provider === 'stripe').length,
                paypal: transactions.filter(t => t.provider === 'paypal').length,
                pix: transactions.filter(t => t.provider === 'pix').length,
                boleto: transactions.filter(t => t.provider === 'boleto').length
            },
            averageProcessingTime: transactions.reduce((sum, t) => sum + (t.processingTime || 0), 0) / transactions.length
        };
    }

    // ========== UTILITÁRIOS ==========
    generateTransactionId() {
        return `
            TXN_${Date.now()}_${Math.random().toString(36).substring(2, 0)}
        `
    }

    generateReceipt(transaction) {
        return {
            receipId: `REC_${transaction.id}`,
            transactionId: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status,
            date: transaction.procesedAt,
            paymentMethod: transaction.paymentMethod,
            provider: transaction.provider,
            customerEmail: transaction.customerEmail
        };
    }

    log(message, type = 'info') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type,
            message
        };

        this.logo.push(logEntry);

        if (type === 'error') console.log(`🔴 ${message}`);
        else if (type === 'warn') console.log(`🟡 ${message}`);
        else if (type === 'success') console.log(`🟢 ${message}`);
        else console.log(`🔵 ${message}`)

    }

    getLogs(limit = 100) {
        return this.slice(-limit)
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

// ========== PROVEDORES DE PAGAMENTO ==========

class StripeProvider {
    async process(payemtData) {
        console.log('💳 Processando com Stripe...');
        await this.sleep(500);

        // Simular processamento
        if (payemtData.amount > 50000) {
            throw new Error('Valor acima do limite para cartão de crédito');
        }

        return {
            provider: 'stripe',
            status: 'completed',
            transactionId: `STR_${Date.now()}`,
            authorizationCode: Math.random().toString(30).substring(2, 8).toUpperCase()
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class PayPalProvider {
    async process(paymentData) {
        console.log('🅿️ Processando com PayPal...');
        await this.sleep(800);

        return {
            provider: 'paypal',
            status: 'completed',
            transactionId: `PYP_${Date.now()}`,
            payerId: `PAYER_${Math.random().toString(36).substr(2, 8)}`
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class PixProvider {
    async process(payemtData) {
        console.log('📱 Gerando PIX...');
        await this.sleep(300);

        return {
            provider: 'pix',
            status: 'pending',
            transactionId: `PIX_${Date.now()}`,
            qrCode: `PIX:00020126330014BR.GOV.BCB.PIX0114${Math.random().toString(36).substring(2, 20)}`,
            qrCodeText: `0020126330014BR.GOV.BCB.PIX0114${Math.random().toString(36).substring(2, 20)}`,
            expiresAt: new Date(Date.now() + 3600000) // 1h
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

class BoletoProvider {
    async process(payemtData) {
        console.log('📄 Gerando Boleto...');
        await this.sleep(200);

        return {
            provider: 'boleto',
            status: 'pending',
            transactionId: `BOL_${Date.now()}`,
            boletoNumber: this.generateBoletoNumber(),
            barcode: this.generateBarCode(),
            expiresAt: new Date(Date.now() + 86400000 * 3), // 3 dias
            url: `https://boleto.exemplo.com${Date.now()}`
        }
    }

    generateBoletoNumber() {
        return `${Math.floor(Math.random() * 10000000000)}-${Math.floor(Math.random() * 1000)}`
    }
    generateBarCode() {
        return `34191.${Math.floor(Math.random() * 10000)} ${Math.floor(Math.random() * 10000)}`;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// =========== ERROR CUSTOM ============

class PaymentError extends Error {
    constructor(message, transactionId) {
        super(message)
        this.name = 'PaymentError',
            this.transactionId = transactionId,
            this.timestamp = new Date().toISOString();
    }
}

// ========== EXEMPLO DE USO ===========

async function main() {
    // crair instancia do gateway
    const gateway = new PaymentGateway({
        retryAttemps: 3,
        webhookTimeout: 3000
    });

    // Registrar webhooks
    gateway.registerWebhook('payment.processed', 'https://minhaapi.com/webhooks/payment')
    gateway.registerWebhook('payment.failed', 'https://minhaapi.com/webhooks/failed')

    // Exemplo 1: Pagamento com Stripe
    try {
        const payment1 = await gateway.processPayment({
            amount: 150.50,
            currency: 'BRL',
            provider: 'stripe',
            paymentMethod: 'credit_card',
            customerEmail: 'client@email.com',
            cardDetails: {
                number: '4111111111111111',
                holdername: 'João Silva',
                expiryMonth: 12,
                expiryYear: 2025,
                cvv: '123'
            },
            installments: 1
        })

        console.log('✅ Pagamento 1: ', payment1);

    } catch (error) {
        console.log('❌ Erro: ', error.message);
    }

    // Exemplo 2: Pagamento com PIX
    try {
        const payment2 = await gateway.processPayment({
            amount: 2500.00,
            currency: 'BRL',
            provider: 'pix',
            paymentMethod: 'pix',
            customerEmail: 'outro@email.com',
            description: 'Compra #12345'
        });

        console.log('✅ Pagamento 2:', {
            transactionId: payment2.transactionId,
            qrCode: payment2.providerResponse.qrCode,
            expiresAt: payment2.providerResponse.expiresAt
        });

    } catch (error) {
        console.log('❌ Erro', error.message);
    }

    // Exemplo 3: Pagamento com Boleto
    try {
        const payment3 = await gateway.processPayment({
            amount: 500.00,
            currency: 'BRL',
            provider: 'boleto',
            paymentMethod: 'boleto',
            customerEmail: 'terceiro@email.com',
            customName: 'Maria Santos',
            customerDocument: '123.456.789-00'
        })

        console.log('✅ Pagamento 3:', {
            transactionId: payment3.transactionId,
            boletoNumber: payment3.providerResponse.boletoNumber,
            url: payment3.providerResponse.url
        });

    } catch (error) {
        console.log('❌ Erro:', error.message);

    }

    // Exemplo 4: Pagamento com PayPal
    try {
        const payment4 = await gateway.processPayment({
            amount: 89.90,
            currency: 'USD',
            provider: 'paypal',
            paymentMethod: 'paypal',
            customerEmail: 'paypal@email.com',
            returnUrl: 'https://minhaapi.com/success',
            cancelUrl: 'https://minhaapi.com/cancel'
        })
        console.log('✅ Pagamento 4:', payment4);
    } catch (error) {
        console.log('❌ Erro:', error.message);
    }

    // Exemplo 5: Pagamento que vai falhar (fraude) 
    try {
        const payment5 = await gateway.processPayment({
            amount: 1500.00,
            currency: 'BRL',
            provider: 'stripe',
            paymentMethod: 'credit_card',
            customerEmail: 'fraude@test.com',
            cardDetails: {
                number: '123456789123456', // BIN suspeito
                holderName: 'Teste Fraude',
                expiryMonth: 12,
                expiryYear: 2030,
                cvv: '123'
            }
        })
        console.log('✅ Pagamento 5:', payment5);

    } catch (error) {
        console.log('❌ Bloqueando por fraude;', error.message);

    }

    // Consultar transações
    console.log('\n📊 RELATÓRIOS:');
    console.log('-------------------');

    // Transações por status
    const completed = gateway.getTransactions({ status: 'completed' })
    console.log(`✅ Pagamentos completos: ${completed.length}`);

    const padding = gateway.getTransactions({ status: 'pending' })
    console.log(`⏳ Pagamentos pendentes: ${pending.length}`);

    const failed = gateway.getTransactions({ status: 'failed' })
    console.log(`❌ Pagamentos falhos: ${failed.length}`);

    // Resumo completo
    console.log('\n📈 RESUMO DO GATEWAY:');
    console.log(gateway.getSummary());

    // Logs
    console.log('\n📝 ÚLTIMOS LOGS:');
    gateway.getLogs(10).forEach(log => {
        console.log(`[${log.timestamp}] ${log.type}: ${log.message}`);
    })

    // Buscar transação específica
    if (completed.length > 0) {
        const firstTransaction = gateway.getTransaction(completed[0].id)
        console.log('\n🔍 DETALHE DA TRANSAÇÃO:')
        console.log(firstTransaction);
    }
}

// Executar exemplo
main().catch(console.error);

// Exportar para uso em outros módulos
module.exports = {}