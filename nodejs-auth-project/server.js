const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

connectToDatabase();

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
