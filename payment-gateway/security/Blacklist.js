class Blacklist {
    constructor() {
        this.suspiciousBins = new Set([
            '123456',
            '654321',
            '999999'
        ]);
    }

    isBinBlocked(bin) {
        return this.suspiciousBins.has(bin);
    }
}

module.exports = Blacklist;
