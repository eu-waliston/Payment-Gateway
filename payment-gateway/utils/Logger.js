class Logger {
    constructor() {
        this.logs = [];
    }

    log(message, type = 'info') {
        const entry = {
            timestamp: new Date().toISOString(),
            type,
            message
        };

        this.logs.push(entry);

        switch (type) {
            case 'error':
                console.error(`🔴 ${message}`);
                break;
            case 'warn':
                console.warn(`🟡 ${message}`);
                break;
            case 'success':
                console.log(`🟢 ${message}`);
                break;
            default:
                console.log(`🔵 ${message}`);
        }
    }

    getLogs(limit = 100) {
        return this.logs.slice(-limit);
    }
}

module.exports = Logger;
