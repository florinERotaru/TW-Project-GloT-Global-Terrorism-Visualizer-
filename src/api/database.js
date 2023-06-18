const fs = require('fs');

const { Client } = require('pg');

async function runScript() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'TW',
    password: 'admin',
    port: 5432, // or the port number your PostgreSQL server is running on
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    const scriptPath = '../../postgresql/script.pgsql'; // Update the path to your script file

    const script = require('fs').readFileSync(scriptPath, 'utf8');
    await client.query(script);

    console.log('Script executed successfully');
  } catch (err) {
    console.error('Error executing script:', err);
  } finally {
    await client.end();
    console.log('Disconnected from the database');
  }
}

runScript();