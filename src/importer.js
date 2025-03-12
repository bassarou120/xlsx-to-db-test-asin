const xlsx = require('xlsx');
const { client } = require('./database');

const moment = require("moment");

async function importerFichier(fichier) {
    const debut = Date.now();
    const workbook = xlsx.readFile(fichier);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const donnees = xlsx.utils.sheet_to_json(sheet);

    // console.log(donnees);

    for (const row of donnees) {

        console.log("************************")
        console.log(row.datedenaissance)
        console.log(row.matricule)
        console.log(convertDate(row.datedenaissance))
        console.log("###########################")

/*
        await client.query(
            `INSERT INTO personnes (matricule,nom, prenom,  datedenaissance,status) VALUES ($1, $2, $3, $4, $5) 
            `,
            [row.matricule, row.nom, row.prenom,   row.datedenaissance,row.status]
        );
        */

    }

    const duree = (Date.now() - debut) / 1000;
    console.log(`Importation terminée en ${duree} secondes.`);
}


// Fonction pour convertir les dates (Excel et formats divers)
function convertDate(value) {
    if (typeof value === "number") {
        // Si la date est un nombre (format Excel)
        return moment("1899-12-30").add(value, "days").format("YYYY-MM-DD");
    } else if (typeof value === "string") {
        // Si c'est une chaîne de caractères (formats courants)
        const date = moment(value, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"], true);
        return date.isValid() ? date.format("YYYY-MM-DD") : null;
    }
    return null;
}

module.exports = { importerFichier };
