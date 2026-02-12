class WebhookManager {
    constructor(sender, logger, timeout = 5000) {
        this.sender = sender;
        this.logger = logger;
        this.timeout = timeout;
        this.webhooks = [];
    }

    register(event, url) {
        this.webhooks.push({ event, url });
        this.logger.log(`Webhook registrado: ${event} → ${url}`, 'info');
    }

    async trigger(event, data) {
        const hooks = this.webhooks.filter(w => w.event === event);

        for (const hook of hooks) {
            try {
                await this.sender.send(
                    hook.url,
                    {
                        event,
                        timestamp: new Date().toISOString(),
                        data
                    },
                    this.timeout
                );

                this.logger.log(`Webhook enviado: ${hook.url}`, 'success');
            } catch (err) {
                this.logger.log(`Erro no webhook ${hook.url}: ${err.message}`, 'error');
            }
        }
    }
}

module.exports = WebhookManager;
