# 🚀 Payment Gateway — Sistema Completo de Pagamentos em JavaScript

> Um gateway de pagamentos educacional, moderno e extensível, feito 100% em JavaScript Vanilla.

---

## 📋 Índice

- [🎯 O que é um Gateway de Pagamentos?](#-o-que-é-um-gateway-de-pagamentos)
- [🌟 Visão Geral do Projeto](#-visão-geral-do-projeto)
- [🏗 Arquitetura](#-arquitetura)
- [⚡ Funcionalidades](#-funcionalidades)
- [📦 Instalação](#-instalação)
- [⚙️ Configuração](#️-configuração)
- [📝 Uso](#-uso)
- [📚 API Completa](#-api-completa)
- [🏦 Provedores Suportados](#-provedores-suportados)
- [🔒 Segurança](#-segurança)
- [💡 Exemplos Práticos](#-exemplos-práticos)
- [🚀 Performance](#-performance)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)
- [🌟 Por que usar este Gateway?](#-por-que-usar-este-gateway)

---

## 🎯 O que é um Gateway de Pagamentos?

Um **Gateway de Pagamentos** é a ponte mágica ✨ entre seu sistema e o dinheiro. Ele conecta lojas, apps e APIs aos bancos e adquirentes, cuidando de toda a treta pesada dos pagamentos.

### Funções Principais

 Funções Principais:
 
```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   E-COMMERCE    │ ──► │   GATEWAY    │ ──► │     BANCO      │
│     / APP       │     │  DE PAGAMENTO│     │   / ADQUIRENTE │
└─────────────────┘     └──────────────┘     └─────────────────┘
         │                      │                      │
         │                      ▼                      │
         │              ┌──────────────┐              │
         └─────────────►│   VALIDAÇÃO  │◄─────────────┘
                        │   FRAUDE     │
                        │   PROCESSAR  │
                        └──────────────┘
```
### O que ele faz:

1. Autorização - Verifica se o pagamento pode ser realizado

2. Autenticação - Confirma a identidade do comprador

3. Processamento - Executa a transação financeira

4. Conciliação - Organiza e confirma os pagamentos

5. Relatórios - Gera extratos e históricos

6. Segurança - Criptografa dados sensíveis (PCI Compliance)

7. Prevenção à Fraude - Analisa comportamentos suspeitos

### Tipos de Gateway:

  - Redirecionamento - Cliente sai do site para pagar (PayPal, PagSeguro)

  - Transparente - Pagamento sem sair do site (Stripe, Adyen)

  - Híbrido - Mix dos dois modelos

## 🌟 Visão Geral do Projeto

Este projeto é um Gateway de Pagamentos completo desenvolvido em JavaScript puro, sem dependências externas. Ele simula um ambiente de produção real com todos os componentes necessários para processar pagamentos de forma segura e eficiente.

## Características:

  - ✅ 100% JavaScript Vanilla

  - ✅ Arquitetura modular e extensível

  - ✅ Suporte a múltiplos provedores

  - ✅ Sistema anti-fraude integrado

  - ✅ Webhooks para notificações em tempo real

  - ✅ Logs detalhados e relatórios

  - ✅ Tratamento robusto de erros

  - ✅ Retry automático em falhas

## 🏗 Arquitetura
```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT GATEWAY                          │
├───────────────┬─────────────────────────┬─────────────────┤
│    CORE       │      PROVIDERS          │    UTILITIES    │
├───────────────┼─────────────────────────┼─────────────────┤
│ • Validation  │ • StripeProvider        │ • Logger        │
│ • Fraud       │ • PayPalProvider        │ • ID Generator  │
│ • Webhooks    │ • PixProvider           │ • Receipt       │
│ • Transactions│ • BoletoProvider        │ • Metrics       │
└───────────────┴─────────────────────────┴─────────────────┘
         │                  │                    │
         ▼                  ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                           │
│              (In-memory / Ready for Database)               │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de uma Transação:

1. Cliente inicia pagamento → Dados enviados ao gateway

2. Validação → Verifica campos obrigatórios e formato

3. Anti-fraude → Analisa risco da transação

4. Roteamento → Escolhe o melhor provedor

5. Processamento → Envia para o provedor escolhido

6. Retry (se falhar) → Tenta novamente até 3x

7. Registro → Salva a transação no histórico

8. Webhook → Notifica sistemas externos

9. Resposta → Retorna confirmação ao cliente

## ⚡ Funcionalidades

### 💳 Métodos de Pagamento

| Método              | Descrição                          | Tempo Médio |
|---------------------|------------------------------------|-------------|
| Cartão de Crédito   | Stripe                             | ~500ms      |
| Cartão de Débito    | Débito direto                      | ~500ms      |
| PayPal              | Redirect / API                     | ~800ms      |
| PIX                 | Instantâneo (Brasil)               | ~300ms      |
| Boleto              | Com vencimento                     | ~200ms      |


## 2. 🛡️ Sistema Anti-Fraude

  - Análise de múltiplas tentativas (3+ na última hora)

  - Verificação de valores suspeitos (> R$ 10.000)

  - Blacklist de BINs de cartão

  - Score de risco automático

## 3. 🔄 Resiliência

  - Retry automático: 3 tentativas

  - Delay entre tentativas: 1 segundo

  - Timeout configurável: 5 segundos padrão

  - Fallback automático entre provedores

## 4. 📊 Relatórios e Métricas

```
{
  total: 150,              // Total de transações
  totalAmount: 45000.00,   // Valor total processado
  successful: 142,        // Taxa de sucesso: 94.6%
  failed: 8,              // Taxa de falha: 5.4%
  byProvider: {           // Distribuição por provedor
    stripe: 80,
    paypal: 30,
    pix: 25,
    boleto: 15
  }
}
```
## 📦 Instalação

### Via NPM (quando publicado)
```
npm install payment-gateway-js
```

### Download direto

```
git clone https://github.com/seu-usuario/payment-gateway.git
cd payment-gateway
```

### Importação

```
// CommonJS
const { PaymentGateway } = require('./payment-gateway');

// ES Modules
import { PaymentGateway } from './payment-gateway.js';

// Script tag
<script src="payment-gateway.js"></script>

```

## ⚙️ Configuração

### Configuração Básica
```
const gateway = new PaymentGateway({
  retryAttempts: 3,        // Tentativas em caso de falha
  retryDelay: 1000,        // Delay entre tentativas (ms)
  webhookTimeout: 5000     // Timeout para webhooks (ms)
});
```
### Configuração Avançada
```
const gateway = new PaymentGateway({
  // Performance
  retryAttempts: 5,
  retryDelay: 2000,
  webhookTimeout: 10000,
  
  // Segurança
  fraudThreshold: 5000,     // Valor mínimo para alerta de fraude
  maxAttemptsPerHour: 5,    // Máximo de tentativas por hora
  suspiciousBins: [        // BINs bloqueados
    '123456',
    '654321',
    '999999'
  ],
  
  // Provedores customizados
  customProviders: {
    'mercadopago': new MercadoPagoProvider(),
    'pagseguro': new PagSeguroProvider()
  }
});
```

## 📝 Uso

### Exemplo Rápido

```
// 1. Inicializar
const gateway = new PaymentGateway();

// 2. Configurar webhook (opcional)
gateway.registerWebhook('payment.processed', 'https://api.meusite.com/webhook');

// 3. Processar pagamento
async function realizarPagamento() {
  try {
    const resultado = await gateway.processPayment({
      amount: 199.90,
      currency: 'BRL',
      provider: 'stripe',
      paymentMethod: 'credit_card',
      customerEmail: 'cliente@email.com',
      cardDetails: {
        number: '4111111111111111',
        holderName: 'João Silva',
        expiryMonth: 12,
        expiryYear: 2025,
        cvv: '123'
      }
    });
    
    console.log('✅ Pagamento aprovado!', resultado);
    console.log('ID da transação:', resultado.transactionId);
    console.log('Comprovante:', resultado.receipt);
    
  } catch (error) {
    console.error('❌ Pagamento recusado:', error.message);
  }
}

```

## 📚 API Completa


### PaymentGateway Class

**Construtor**
```
new PaymentGateway(config)
```

## Métodos Principais

#### processPayment(paymentData)

**Processa um pagamento**

```
await gateway.processPayment({
  amount: number,           // Valor (obrigatório)
  currency: string,         // BRL, USD, EUR (obrigatório)
  provider: string,         // stripe, paypal, pix, boleto
  paymentMethod: string,    // credit_card, debit_card, pix, etc
  customerEmail: string,    // Email do cliente
  cardDetails: object,      // Para cartão de crédito/débito
  description: string,      // Descrição da compra
  installments: number      // Número de parcelas
})
```
#### getTransaction(id)
**Busca uma transação específica**
```
const transaction = gateway.getTransaction('TXN_123456789');
```

#### getTransactions(filters)
**Lista transações com filtros**
```
const hoje = new Date();
const ontem = new Date(hoje - 86400000);

const transacoes = gateway.getTransactions({
  status: 'completed',      // completed, pending, failed
  startDate: ontem,        // Data inicial
  endDate: hoje,          // Data final
  provider: 'stripe'      // Filtro por provedor
});
```

#### getSummary()
**Resumo estatístico**

```
const resumo = gateway.getSummary();
console.log(`Total processado: R$ ${resumo.totalAmount}`);
console.log(`Taxa de sucesso: ${(resumo.successful / resumo.total * 100).toFixed(1)}%`);
```

#### registerWebhook(event, url)
**Registra um webhook**
```
gateway.registerWebhook('payment.processed', 'https://api.meusite.com/pagamento-confirmado');
gateway.registerWebhook('payment.failed', 'https://api.meusite.com/pagamento-falhou');
```

#### getLogs(limit)
**Recupera logs do sistema**

```
const ultimosLogs = gateway.getLogs(50);
ultimosLogs.forEach(log => {
  console.log(`[${log.timestamp}] ${log.type}: ${log.message}`);
});
```


## 🏦 Provedores Suportados


1. StripeProvider

```javascript
// Ideal para: Cartões de crédito/débito internacionais
{
  provider: 'stripe',
  paymentMethod: 'credit_card',
  amount: 299.90,
  currency: 'USD',
  cardDetails: { ... }
}
```

3. PayPalProvider
```javascript
// Ideal para: Contas PayPal internacionais
{
  provider: 'paypal',
  paymentMethod: 'paypal',
  amount: 150.00,
  currency: 'EUR',
  returnUrl: 'https://meusite.com/sucesso',
  cancelUrl: 'https://meusite.com/cancelado'
}
```
4. PixProvider
```javascript
// Ideal para: Pagamentos instantâneos no Brasil
{
  provider: 'pix',
  paymentMethod: 'pix',
  amount: 1250.00,
  currency: 'BRL',
  customerEmail: 'cliente@email.com',
  customerName: 'João Silva',
  customerDocument: '123.456.789-00'
}
// Retorna QR Code e código copia e cola
```
5. BoletoProvider
```javascript
// Ideal para: Pagamentos com vencimento no Brasil
{
  provider: 'boleto',
  paymentMethod: 'boleto',
  amount: 450.00,
  currency: 'BRL',
  customerName: 'Maria Santos',
  customerDocument: '987.654.321-00',
  customerEmail: 'maria@email.com'
}
// Retorna número do boleto, código de barras e URL
```
## 🔒 Segurança

### PCI DSS Compliance
**O gateway implementa práticas recomendadas pelo PCI Security Standards Council:**

1. Dados Sensíveis

  - CVV não é armazenado

  - Números de cartão são mascarados nos logs

  - Tokenização de dados

2. Prevenção à Fraude

  - Análise de múltiplas tentativas

  - Verificação de BIN suspeito

  - Limite de transações por hora

  - Blacklist dinâmica

3. Validações

  - Luhn algorithm para cartões

  - Validação de data de expiração

  - Verificação de CPF/CNPJ

  - Sanitização de inputs

## Exemplo de Proteção Anti-Fraude
```javascript
// Tentativa de fraude será bloqueada
{
  amount: 50000,              // Valor muito alto
  customerEmail: 'teste@email.com',
  cardDetails: {
    number: '1234567890123456', // BIN bloqueado
    cvv: '123'
  }
}
// ❌ Error: Transação bloqueada por suspeita de fraude
```

## 💡 Exemplos Práticos
1. Integração com E-commerce
```javascript
class Ecommerce {
  constructor() {
    this.gateway = new PaymentGateway();
  }
  
  async checkout(carrinho, dadosPagamento) {
    // Calcular total
    const total = carrinho.items.reduce((sum, item) => sum + item.price, 0);
    
    // Processar pagamento
    const pagamento = await this.gateway.processPayment({
      amount: total,
      currency: 'BRL',
      provider: dadosPagamento.provider,
      paymentMethod: dadosPagamento.method,
      customerEmail: dadosPagamento.email,
      cardDetails: dadosPagamento.card,
      description: `Compra #${carrinho.id}`
    });
    
    // Atualizar pedido
    carrinho.status = 'paid';
    carrinho.transactionId = pagamento.transactionId;
    
    return pagamento;
  }
}
```
2. Sistema de Assinaturas
```javascript
class SubscriptionManager {
  constructor() {
    this.gateway = new PaymentGateway();
    this.subscriptions = new Map();
  }
  
  async createSubscription(plan, customer) {
    // Pagamento recorrente mensal
    const payment = await this.gateway.processPayment({
      amount: plan.price,
      currency: 'BRL',
      provider: 'stripe',
      paymentMethod: 'credit_card',
      customerEmail: customer.email,
      cardDetails: customer.card,
      description: `Assinatura ${plan.name} - Mensal`,
      recurring: true
    });
    
    const subscription = {
      id: `SUB_${Date.now()}`,
      plan,
      customer,
      nextBilling: new Date(Date.now() + 30 * 86400000),
      status: 'active',
      transactions: [payment]
    };
    
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }
  
  async processRecurring() {
    const now = new Date();
    
    for (const sub of this.subscriptions.values()) {
      if (sub.nextBilling <= now && sub.status === 'active') {
        try {
          const payment = await this.gateway.processPayment({
            ...sub.customer.paymentData,
            description: `Assinatura ${sub.plan.name} - Renovação`
          });
          
          sub.transactions.push(payment);
          sub.nextBilling = new Date(Date.now() + 30 * 86400000);
          
          console.log(`✅ Assinatura ${sub.id} renovada`);
        } catch (error) {
          console.error(`❌ Falha na renovação ${sub.id}:`, error.message);
          sub.status = 'failed';
        }
      }
    }
  }
}
```
3. Dashboard de Análise
```javascript
class PaymentDashboard {
  constructor(gateway) {
    this.gateway = gateway;
  }
  
  generateReport(period) {
    const transactions = this.gateway.getTransactions({
      startDate: period.start,
      endDate: period.end
    });
    
    // Análise por método de pagamento
    const byMethod = {};
    transactions.forEach(t => {
      byMethod[t.paymentMethod] = (byMethod[t.paymentMethod] || 0) + t.amount;
    });
    
    // Taxa de conversão
    const successful = transactions.filter(t => t.status === 'completed').length;
    const conversion = (successful / transactions.length * 100).toFixed(2);
    
    // Ticket médio
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTicket = totalAmount / transactions.length;
    
    return {
      period,
      totalTransactions: transactions.length,
      totalAmount,
      averageTicket,
      conversion,
      byMethod,
      byProvider: this.gateway.getSummary().byProvider
    };
  }
}
```

## 🚀 Performance

| Operação | Tempo Médio | Memória |
| -------- | ----------- | ------- |
| Cartão   | 520ms       | 2.3MB   |
| PIX      | 315ms       | 1.1MB   |
| Boleto   | 210ms       | 0.9MB   |


## Otimizações

  - Cache de provedores

  - Lazy loading de módulos

  - Pool de conexões

  - Compressão de logs

## 🤝 Contribuição
#### Como contribuir:
1. Fork o projeto

2. Crie sua feature branch (git checkout -b feature/AmazingFeature)

3. Commit suas mudanças (git commit -m 'Add some AmazingFeature')

4. Push para a branch (git push origin feature/AmazingFeature)

5. Abra um Pull Request

## Guidelines:

  - Mantenha 100% JavaScript Vanilla

  - Adicione testes para novas funcionalidades

  - Documente a API

  - Siga o estilo de código existente

## 📄 Licença
### MIT License © 2026
  
## 🌟 Por que usar este Gateway?


| Característica     | Este Gateway | Outros |
| ------------------ | ------------ | ------ |
| JS puro            | ✅            | ❌      |
| Anti-fraude nativo | ✅            | ❌      |
| Open Source        | ✅            | ❌      |
| Sem mensalidade    | ✅            | ❌      |


<div align="center"> <h3>Feito com ❤️ para a comunidade JavaScript</h3> <p>Projeto educacional. Para produção, use provedores reais.</p> </div>

