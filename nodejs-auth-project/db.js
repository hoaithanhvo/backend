require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`
};

async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log("Connected Successfully");
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

module.exports = connectToDatabase;
