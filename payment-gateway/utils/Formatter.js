class Formatter {
    static currency(value, currency = 'BRL', locale = 'pt-BR') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(value);
    }

    static date(date, locale = 'pt-BR') {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: 'short',
            timeStyle: 'medium'
        }).format(new Date(date));
    }

    static percentage(value, decimals = 2) {
        return `${(value * 100).toFixed(decimals)}%`;
    }

    static status(status) {
        const map = {
            pending: 'Pendente',
            processing: 'Processando',
            completed: 'Concluída',
            paid: 'Paga',
            failed: 'Falhou',
            canceled: 'Cancelada'
        };

        return map[status] || status;
    }

    static maskCard(cardNumber) {
        if (!cardNumber) return '';
        return `**** **** **** ${cardNumber.slice(-4)}`;
    }

    static maskEmail(email) {
        if (!email) return '';
        const [user, domain] = email.split('@');
        return `${user[0]}***@${domain}`;
    }

    static duration(ms) {
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
        return `${(ms / 60000).toFixed(2)}min`;
    }

    static id(id, visible = 6) {
        return `${id.slice(0, visible)}...`;
    }
}

module.exports = Formatter;

/**
    🧠 COMO USAR (EXEMPLOS REAIS)

    Em relatório:

    Formatter.currency(199.9);
    R$ 199,90

    Em dashboard:

    Formatter.status(transaction.status);
    "Concluída"

    Em logs:
    Formatter.duration(transaction.processingTime);
    "1.42s"

    Em UI:
    Formatter.maskCard('4111111111111111');
    **** **** **** 1111

*/
