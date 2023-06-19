const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "admin",
  database: "mock",
});

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

const createUsersTable = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
      );
    `);
    console.log("Users table created");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

module.exports = {
  connectToDatabase,
  createUsersTable,
};
