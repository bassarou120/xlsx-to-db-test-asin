const { initDB } = require('./database');
const { importerFichier } = require('./importer');
const readline = require('readline');


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
























// (async () => {
//     await initDB();
//
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });
//
//     rl.question("Veuillez fournir le chemin du fichier XLSX : ", async (fichier) => {
//         if (!fichier) {
//             console.error("Aucun fichier fourni.");
//             process.exit(1);
//         }
//         await importerFichier(fichier);
//         rl.close();
//         process.exit();
//     });
// })();


// const { initDB } = require('./database');
// const { importerFichier } = require('./importer');
// const moment = require("moment");
//
// (async () => {
//
//     await initDB();
//     const fichier = process.argv[2];
//
//     if (!fichier) {
//         console.error("Veuillez fournir un fichier XLSX en argument.");
//         process.exit(1);
//     }
//
//     await importerFichier(fichier);
//
//     process.exit();
// })();
//
//
