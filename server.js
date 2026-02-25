
const express = require('express');
const pool = require('./database');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/install', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2)
            );
        `);
        res.status(200).send('Table created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating table');
    }
});

app.get('/products', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching products');
    }
});

app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        await pool.query('INSERT INTO products (name, description, price) VALUES ($1, $2, $3)', [name, description, price]);
        res.status(201).send('Product created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating product');
    }
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.status(200).send('Product deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product');
    }
});

app.listen(3333, () => {
    console.log('Server is running on port 3333');
});
