const TransactionRepository = require('../storage/TransactionRepository');
const MetricsCalculator = require('../reports/MetricsCalculator');
const Formatter = require('../utils/Formatter');

// Repositório (em memória)
const MemoryStorage = require('../storage/MemoryStorage');
const repo = new MemoryStorage();


// Seed fake de transações
repo.save({
    id: 'TXN_1',
    amount: 150,
    status: 'completed',
    provider: 'stripe',
    processingTime: 420,
    createdAt: new Date()
});

repo.save({
    id: 'TXN_2',
    amount: 2500,
    status: 'pending',
    provider: 'pix',
    processingTime: 120,
    createdAt: new Date()
});

repo.save({
    id: 'TXN_3',
    amount: 500,
    status: 'failed',
    provider: 'boleto',
    processingTime: 300,
    createdAt: new Date()
});

repo.save({
    id: 'TXN_4',
    amount: 89.9,
    status: 'completed',
    provider: 'paypal',
    processingTime: 600,
    createdAt: new Date()
});

// Buscar tudo
const transactions = repo.findAll();

// Calcular métricas
const metrics = MetricsCalculator.calculate(transactions);

// ===== DASHBOARD =====
console.log('\n📊 DASHBOARD — PAYMENT GATEWAY');
console.log('='.repeat(40));

console.log('📦 Total de transações:', metrics.total);
console.log('💰 Valor total:', Formatter.currency(metrics.totalAmount));
console.log('✅ Sucesso:', metrics.successful);
console.log('❌ Falhas:', metrics.failed);
console.log('⏳ Pendentes:', metrics.pending);
console.log(
    '⚡ Tempo médio:',
    Formatter.duration(metrics.averageProcessingTime)
);

console.log('\n🏦 Por provedor:');
for (const provider in metrics.byProvider) {
    console.log(
        `• ${provider}: ${metrics.byProvider[provider].count} transações — ${Formatter.currency(
            metrics.byProvider[provider].amount
        )}`
    );
}

console.log('\n📉 Fim do relatório\n');
