const xlsx = require('xlsx');
const { client } = require('./database');
const moment = require("moment");


async function importerFichier(fichier) {

    const ora = (await import("ora")).default
     const debut = Date.now();

    console.log(`Heure du debut de l'importation : ${ moment(debut).format(' h:mm:ss a')} `);

    const spinner = ora({
        text: "Importation en cours...",
        spinner: "dots", // Type de spinner (options : "dots", "line", "star", etc.)
    }).start();


    const workbook = xlsx.readFile(fichier);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const donnees = xlsx.utils.sheet_to_json(sheet);

   // console.log(donnees);

    try {
        const batchSize = 10000; // Nombre de lignes par lot
        for (let i = 0; i < donnees.length; i += batchSize) {
            const batch = donnees.slice(i, i + batchSize);
            const values = batch.map(row => `('${row.matricule}', '${row.nom}', '${row.prenom}', '${convertDate(row.datedenaissance)}', '${row.status}')`).join(",");

            await client.query(
                `INSERT INTO personnes (matricule, nom, prenom, datedenaissance, status) 
             VALUES ${values} 
             ON CONFLICT (matricule, nom, prenom, datedenaissance) DO NOTHING`
            );
        }

        spinner.succeed("Importation terminée avec succès !");
    }catch (error)
    {
        spinner.fail("Erreur lors de l'importation !");
        console.error(error);
    }


    const fin =Date.now()
    console.log(`Heure de fin de l'importation : ${ moment(fin).format(' h:mm:ss a')} `);
    const duree = (fin - debut) / 1000;
    console.log(`Importation terminée en ${duree} secondes.`);
    console.log(`c'est à dire  Importation terminée en ${duree/60} minute.`);


}


// Fonction pour convertir les dates (Excel et formats divers)

function convertDate(value) {
    if (typeof value === "number") {
        // Si la date est un nombre (format Excel)
        return moment("1899-12-30").add(value, "days").format("YYYY-MM-DD");
    } else if (typeof value === "string") {
        // Si c'est une chaîne de caractères (formats courants)
        const date = moment(value, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD","YYYY/MM/DD", "MM-DD-YYYY","MM/DD/YYYY"], true);
        return date.isValid() ? date.format("YYYY-MM-DD") : null;
    }
    return null;
}

module.exports = { importerFichier };
