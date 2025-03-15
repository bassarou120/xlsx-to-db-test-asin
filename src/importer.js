const xlsx = require('xlsx');

const moment = require('moment');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const { client } = require('./database');

const pipelineAsync = promisify(pipeline);


async function importerFichier(fichier) {
    const ora = (await import("ora")).default


    const debut = Date.now();
    console.log(`📂 Début de l'importation : ${moment(debut).format('h:mm:ss')}`);

    const spinner = ora({
        text: "Importation en cours...",
        spinner: "dots",
    }).start();

    try {
        //  Lire le fichier XLSX et convertir en JSON
        const workbook = xlsx.readFile(fichier);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const donnees = xlsx.utils.sheet_to_json(sheet);

        // Créer un fichier temporaire CSV pour COPY
        const tempFile = `./temp_import.csv`;
        const stream = fs.createWriteStream(tempFile);
        for (const row of donnees) {
            stream.write(`${row.matricule},${row.nom},${row.prenom},${convertDate(row.datedenaissance)},${row.status}\n`);
        }
        stream.end();
        await pipelineAsync(fs.createReadStream(tempFile), fs.createWriteStream(tempFile));

        //  Désactiver les contraintes et index (optionnel, si gros volume)
        await client.query("ALTER TABLE personnes DISABLE TRIGGER ALL;");

        // Importation rapide avec COPY
        const query = `
    \\COPY personnes (matricule, nom, prenom, datedenaissance, status)
    FROM '${tempFile}' DELIMITER ',' CSV;
`;
        await client.query(query);

        // Réactiver les contraintes et index
        await client.query("ALTER TABLE personnes ENABLE TRIGGER ALL;");

        spinner.succeed("✅ Importation terminée avec succès !");
    } catch (error) {
        spinner.fail("❌ Erreur lors de l'importation !");
        console.error(error);
    } finally {
        await client.end();
        const fin = Date.now();
        console.log(`⏳ Fin de l'importation : ${moment(fin).format('h:mm:ss')}`);
        console.log(`⏱️ Durée : ${(fin - debut) / 1000} secondes.`);
    }
}

// Fonction pour convertir les dates
function convertDate(value) {
    if (typeof value === "number") {
        return moment("1899-12-30").add(value, "days").format("YYYY-MM-DD");
    } else if (typeof value === "string") {
        const date = moment(value, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD", "YYYY/MM/DD", "MM-DD-YYYY", "MM/DD/YYYY"], true);
        return date.isValid() ? date.format("YYYY-MM-DD") : null;
    }
    return null;
}

module.exports = { importerFichier };
