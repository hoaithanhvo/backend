const express = require('express');
const bcrypt = require('bcryptjs');
const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const router = express.Router();

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`
};

// Đăng ký
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, hashedPassword)
            .query('INSERT INTO Userss (username, password) VALUES (@username, @password)');

        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user: ' + err);
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM Userss WHERE username = @username');

        if (result.recordset.length === 0) {
            return res.status(400).send('User not found');
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        res.status(200).send('User logged in successfully');
    } catch (err) {
        res.status(500).send('Error logging in: ' + err);
    }
});

module.exports = router;
