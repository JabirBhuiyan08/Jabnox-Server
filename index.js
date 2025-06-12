const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jabnox.gtaqtig.mongodb.net/Jabnox?retryWrites=true&w=majority&appName=Jabnox`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect(); 
  

    const userCollection = client.db("Jabnox").collection("users");
    const reviewsCollection = client.db("Jabnox").collection("reviews");
    const contactCollection = client.db("Jabnox").collection("contact");

    // users
    app.get('/users', async (req, res) =>{
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    // reviews
    app.get('/reviews', async(req,res)=>{
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    })

    app.post('/reviews', async(req,res)=>{
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    })

    // contact
    app.post('/contact', async(req,res)=>{
      const contact =req.body;
      const result = await contactCollection.insertOne(contact);
      res.send(result);
    })

    app.get('/contact', async(req,res)=>{
      const result = await contactCollection.find().toArray();
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Jabnox is running!');
})

app.listen(port, () => {
    console.log(`Jabnox is Running on port ${port}`);
    });