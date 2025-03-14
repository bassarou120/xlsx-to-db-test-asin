require('dotenv').config();

const databaseUrl = process.env.USE_CONTAINER_DB === "true"
    ? `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@db:5432/${process.env.DB_NAME}`  // Utilisation du conteneur
    : `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`; // Base externe

module.exports = { databaseUrl };

//postgres://postgres:admin@localhost:5432/test_asin_db
// module.exports = {
//     databaseUrl: process.env.DATABASE_URL,
// };
