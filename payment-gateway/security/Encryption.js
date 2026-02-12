const crypto = require('crypto');

class Encryption {
    static algorithm = 'aes-256-gcm';
    static ivLength = 16;
    static key = crypto
        .createHash('sha256')
        .update(process.env.ENCRYPTION_SECRET || 'dev-secret')
        .digest();

    static encrypt(data) {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

        const encrypted = Buffer.concat([
            cipher.update(JSON.stringify(data), 'utf8'),
            cipher.final()
        ]);

        const tag = cipher.getAuthTag();

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex'),
            tag: tag.toString('hex')
        };
    }

    static decrypt(payload) {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.key,
            Buffer.from(payload.iv, 'hex')
        );

        decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));

        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(payload.content, 'hex')),
            decipher.final()
        ]);

        return JSON.parse(decrypted.toString('utf8'));
    }
}

module.exports = Encryption;

/*
🧪 COMO USAR (EXEMPLO REAL)

Criptografar payload antes de salvar !!! 

const Encryption = require('../security/Encryption');

const encryptedData = Encryption.encrypt({
    cardToken,
    customerEmail
});

repository.save({
    id,
    secureData: encryptedData
});

Descriptografar depois !!!

const data = Encryption.decrypt(transaction.secureData);


*/

