const { Client } = require('pg');
const { databaseUrl } = require('./config');

const client = new Client({ connectionString: databaseUrl });

async function initDB() {
    await client.connect();
    await client.query(`
        CREATE TABLE IF NOT EXISTS personnes (
            id SERIAL PRIMARY KEY,
            matricule VARCHAR(100) UNIQUE,
            nom VARCHAR(100),
            prenom VARCHAR(100),
            datedenaissance DATE,
            status VARCHAR(255) 
      
          
        )
    `);
    console.log("Table créée ou déjà existante.");
}

module.exports = { client, initDB };
