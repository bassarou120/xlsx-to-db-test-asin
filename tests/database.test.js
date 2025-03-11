
const { Client } = require('pg');
const { initDB, client } = require('../src/database');

jest.mock('pg', () => {
    const mockClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mockClient) };
});

describe('Connexion à la base de données', () => {
    test('initDB doit créer la table personnes', async () => {
        await initDB();
        expect(client.connect).toHaveBeenCalled();
        expect(client.query).toHaveBeenCalled();
    });
});
