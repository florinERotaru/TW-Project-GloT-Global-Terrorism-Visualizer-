const { Client } = require('pg');

class TerroDBConnection {

    static client = new Client({
      host: 'localhost',
      port: 5432, // Change it to the appropriate port if needed
      database: 'webdb',
      user: 'postgres',
      password: '1234',
    });


  static async connect() {
    try {
      await this.client.connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

  static async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnected from the database');
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
    }
  }

  // Add other methods for interacting with the database

  // Example method to execute a query
  static async query(text, values) {
    try {
      TerroDBConnection.connect();
      const result = await this.client.query(text, values);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
    finally{
      TerroDBConnection.disconnect();
    }
  }
}

module.exports = TerroDBConnection;

TerroDBConnection.query('select * from regions')
.then( (rows) => {
    console.log(rows);
})
.catch ((error) => {
    console.log(error);
});