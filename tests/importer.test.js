const { importerFichier } = require('../src/importer');
const { client } = require('../src/database');

jest.mock('../src/database', () => ({
    client: {
        query: jest.fn(),
        connect: jest.fn(),
    },
}));

describe('Importation du fichier Excel', () => {
    test('importerFichier doit insérer des données', async () => {
        client.query.mockResolvedValueOnce({});

        await importerFichier('./tests/people-sample.xlsx');  // Fichier de test fictif
        expect(client.query).toHaveBeenCalled();
    });

    test('importerFichier doit ignorer les doublons', async () => {
        client.query.mockRejectedValueOnce(new Error("duplicate key value violates unique constraint"));

       await expect(importerFichier('./tests/people-sample.xlsx')).resolves.not.toThrow();
    });
});
