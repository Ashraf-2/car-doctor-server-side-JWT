const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connect

console.log(process.env.DB_PASS)
console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bx5otjq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
//car_doctor_user 
//qV2V8sMHZ5UpDJql

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const servicesCollection = client.db('cars-doctor').collection('services');
        const bookingCollection = client.db('cars-doctor').collection('bookings');

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const options = {
                // Sort matched documents in descending order by rating
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1,price:1,service_id:1,img:1 },
            };
            const result = await servicesCollection.findOne(query,options);
            res.send(result);
        })

        //bookings related crud operation.

        
        app.get('/bookings', async(req,res)=> {
            console.log(req.query.email);
            let query= {};
            if(req.query?.email){
                query = {email: req.query.email};
            } 
            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //to store/create
        app.post('/bookings', async(req,res)=> {
            const booking = req.body;
            console.log(booking);
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        //to update
        app.put('/bookings/:id',async(req,res) => {
            const updatedBooking = req.body;
        })

        //to delete
        app.delete('/bookings/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
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
    res.send("car doctor server is running")
})

app.listen(port, () => {
    console.log(`Car doctor server is running on: ${port} port`);

})