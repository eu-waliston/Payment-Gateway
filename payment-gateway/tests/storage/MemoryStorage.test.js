const MemoryStorage = require('../../storage/MemoryStorage');

describe('MemoryStorage', () => {
    let storage;

    beforeEach(() => {
        storage = new MemoryStorage();
    })

    it('salva e recupera transação', () => {
        const tx = { id: 'TX1', amount: 100}

        storage.save(tx)

        const found = storage.findById('TX1')
        expect(found).toEqual(tx)
    })

    it('Retorna todas as transações', () => {
        storage.save({ id: 'TX1' })
        storage.save({ id: 'TX2' })

        const all = storage.findAll()
        expect(all.length).toBe(2);
    })    

    it('retorna null se não existir', () => {
        const tx = storage.findById('INEXISTENTE')
        expect(tx).toBeNull()
    })
})