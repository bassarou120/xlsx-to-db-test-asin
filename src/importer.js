const xlsx = require('xlsx');
const { client } = require('./database');

async function importerFichier(fichier) {
    const debut = Date.now();
    const workbook = xlsx.readFile(fichier);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const donnees = xlsx.utils.sheet_to_json(sheet);

    console.log(donnees);

    for (const row of donnees) {


        await client.query(
            `INSERT INTO personnes (matricule,nom, prenom,  datedenaissance,status) VALUES ($1, $2, $3, $4, $5) 
            `,
            [row.matricule, row.nom, row.prenom,   row.datedenaissance,row.status]
        );
    }

    const duree = (Date.now() - debut) / 1000;
    console.log(`Importation terminée en ${duree} secondes.`);
}

module.exports = { importerFichier };
