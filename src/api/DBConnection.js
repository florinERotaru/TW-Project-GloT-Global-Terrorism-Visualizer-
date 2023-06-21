const { Pool } = require('pg');

class TerroDBConnection {
  static pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'webdb',
    user: 'postgres',
    password: 'sys',
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Time in milliseconds a connection can remain idle before being closed
    connectionTimeoutMillis: 2000, // Time in milliseconds to wait for a new connection before timing out
  });

  static async connect() {
    try {
      const client = await this.pool.connect();
      console.log('Connected to the database');
      return client;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  }

  static async disconnect(client) {
    try {
      await client.release();
      console.log('Released client back to the pool');
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
      throw error;
    }
  }

  // Example method to execute a query
  static async query(text, values) {
    let client;
    try {
      client = await this.connect();
      const result = await client.query(text, values);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    } finally {
      if (client) {
        await this.disconnect(client);
      }
    }
  }
}

module.exports = TerroDBConnection;

// exemplu

// TerroDBConnection.query('select * from regions')
// .then( (rows) => {
//     console.log(rows);
// })
// .catch ((error) => {
//     console.log(error);
// });