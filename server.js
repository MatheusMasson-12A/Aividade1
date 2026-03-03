
import express from 'express';
import fs from 'fs/promises';

const app = express();

app.use(express.json());
app.use(express.static('public'));

const DB_FILE = 'db.json';

// Helper function to read the database
async function readDb() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, start with an empty database
        if (error.code === 'ENOENT') {
            return { products: [] };
        }
        throw error;
    }
}

// Helper function to write to the database
async function writeDb(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/products', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching products');
    }
});

app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const db = await readDb();
        const newProduct = {
            id: db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
            name,
            description,
            price
        };
        db.products.push(newProduct);
        await writeDb(db);
        res.status(201).send('Product created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating product');
    }
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await readDb();
        const productIndex = db.products.findIndex(p => p.id === parseInt(id));
        if (productIndex === -1) {
            return res.status(404).send('Product not found');
        }
        db.products.splice(productIndex, 1);
        await writeDb(db);
        res.status(200).send('Product deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product');
    }
});

app.listen(3333, () => {
    console.log('Server is running on port 3333');
});
