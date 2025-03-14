const { Client } = require('pg');
const { databaseUrl } = require('./config');

const client = new Client({ connectionString: databaseUrl });

async function initDB() {
    await client.connect();
    console.log("✅ Connexion à la base de données réussie !");
    await client.query(`
        CREATE TABLE IF NOT EXISTS personnes (
            id SERIAL PRIMARY KEY,
            matricule VARCHAR(100) ,
            nom VARCHAR(100),
            prenom VARCHAR(100),
            datedenaissance DATE,
            status VARCHAR(255) 
      
          
        )
    `);


    try {
        // Vérifier si la contrainte existe
        const checkConstraint = await client.query(`
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'personnes' 
            AND constraint_name = 'unique_personne'
        `);

        // Si elle n'existe pas, on l'ajoute
        if (checkConstraint.rowCount === 0) {
            await client.query(`
                ALTER TABLE personnes 
                ADD CONSTRAINT unique_personne 
                UNIQUE (matricule, nom, prenom, datedenaissance)
            `);
            console.log("Contrainte unique_personne ajoutée avec succès !");
        } else {
            console.log("La contrainte unique_personne existe déjà.");
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de la contrainte :", error);
    }

    // await client.query(`ALTER TABLE personnes ADD CONSTRAINT unique_personne UNIQUE (matricule, nom, prenom, datedenaissance)`);
    //

    console.log("Table crée ou déjà existante.");
}

module.exports = { client, initDB };
