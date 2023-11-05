const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//mongodb connect

// console.log(process.env.DB_PASS)
// console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bx5otjq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

//self-created middleWears
const logger = async(req,res, next) => {
    console.log('called : ', req.host, req.originalUrl)
    next();
}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const servicesCollection = client.db('cars-doctor').collection('services');
        const bookingCollection = client.db('cars-doctor').collection('bookings');

        //auth related api
        app.post('/jwt',  async(req,res) => {
            const user = req.body;
            console.log(user);
            // console.log(process.env.ACCESS_TOKEN_SECRET);
            
            //step1
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '500hr'});

            //step2
            res.cookie('token',token, {
                httpOnly: true,
                secure: false
            })
            res.send({success: true})
        })


        //services related api

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
            console.log('ttt token :', req.cookies.token)
            let query= {};
            if(req.query?.email){
                query = {email: req.query.email};
            } 
            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        //require('crypto').randomBytes(64).toString('hex')

        //to store/create
        app.post('/bookings', async(req,res)=> {
            const booking = req.body;
            console.log(booking);
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        //to update
        app.patch('/bookings/:id',async(req,res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const updatedBooking = req.body;
            console.log(updatedBooking);
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingCollection.updateOne(filter,updateDoc);
            res.send(result);
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