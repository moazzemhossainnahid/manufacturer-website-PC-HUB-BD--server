const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hmmg8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
        await client.connect();
        const productsCollection = client.db("PCHubBD").collection("Products");

        // get products
        app.get('/products', async(req, res) => {
            const query = {};
            const products = productsCollection.find(query);
            const result = await products.toArray();
            res.send(result);
        })

        // get product
        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.send(product);
        })

    }finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running PC Hub BD Server");
});

app.listen(port, () => {
    console.log("Listen to Port", port);
})