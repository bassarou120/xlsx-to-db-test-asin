const { initDB } = require('./database');
const { importerFichier } = require('./importer');
const moment = require("moment");

(async () => {

    await initDB();
    const fichier = process.argv[2];

    if (!fichier) {
        console.error("Veuillez fournir un fichier XLSX en argument.");
        process.exit(1);
    }

    await importerFichier(fichier);

    process.exit();
})();


