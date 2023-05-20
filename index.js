const express = require('express') 
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 1000
require('dotenv').config()

// midleware 

// toys Q5F3399BEYVln6kI

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.va9oo.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();


    // Send a ping to confirm a successful connection


    const alltoysDatabase = client.db('kidz').collection('alltoys')

    app.get('/alltoys', async(req,res)=>{

      // let query = {};
      // if(req.query?.email){
      //   query ={email : req.query.email}
      // }
      const cursor =alltoysDatabase.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/mytoys', async(req,res)=>{

       
      const cursor =alltoysDatabase.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/allposttoys',async(req,res) =>{
      const body = req.body 
      // console.log(body)
      const result = await alltoysDatabase.insertOne(body)

      // console.log(result)
      res.send(result)
    })

    app.get("/mytoys/:email",async(req,res)=>{
      // console.log(req.params.email)
      const result = await alltoysDatabase.find({sellerEmail:req.params.email}).toArray()
      res.send(result)
    })
    app.get("/alltoys/:id",async(req,res)=>{
       const id = req.params.id
      const query ={_id: new ObjectId(id)}
      const result = await alltoysDatabase.findOne(query)
      console.log(result)
      res.send(result)
    })
    app.delete('/mytoys/:id',async(req,res)=>{
      const id = req.params.id 
      const query = { _id: new ObjectId(id)}
      const result = await alltoysDatabase.deleteOne(query)
      res.send(result)
     })
    
     app.put("/alltoys/:id",async(req,res) =>{
      const id = req.params.id 
      const filter = {_id: new ObjectId(id)}
      const option = {upsert:true}
      const updatedToys = req.body
      // console.log(updatedToys)
          // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
       price:updatedToys.price,
       availableQuantity:updatedToys.availableQuantity,
       description:updatedToys.description,

      },
      
    };
     
    const result = await alltoysDatabase.updateOne(filter,updateDoc,option)
    res.send(result)
    })

    app.get("/getToysByText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await alltoysDatabase.find({
          $or: [
            { toyName: { $regex: text, $options: "i" } },
            { subCategory: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    // app.put("/updateToy/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const body = req.body;
    //   console.log(body);
    //   const filter = { _id: new ObjectId(id) };
    //   const updateDoc = {
    //     $set: {
    //       title: body.toyName,
    //       price: body.price,
    //       // category: body.subCategory,
    //     },
    //   };
    //   const result = await alltoysDatabase.updateOne(filter, updateDoc);
    //   res.send(result);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/",(req,res)=>{
  res.send("Kids toy surver is runing")
})
app.listen(port,()=>{
  console.log(`Surver is running on port ${port}`)
})

 