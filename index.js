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
        const usersCollection = client.db("PCHubBD").collection("Users");
        const profilesCollection = client.db("PCHubBD").collection("Profiles");

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


        // Post user
        app.put('/user/:email', async(req, res)=> {
            const email = req.params.email;
            const user = req.body;
            const filter = {email: email};
            const options = {upsert : true};
            const updatedDoc = {
                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            const token = jwt.sign({email:email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
            res.send({result, accessToken: token});

        })

        // post profile
        app.put('/profile/:email', async(req, res) => {
            const email = req.params.email;
            const profile = req.body;
            const filter = {email: email};
            const options = {upsert : true};
            const updatedDoc = {
                $set: profile,
            };
            const result = await profilesCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // get profile
        app.get('/profile/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email}
            const profile = await profilesCollection.findOne(query);
            res.send(profile);
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