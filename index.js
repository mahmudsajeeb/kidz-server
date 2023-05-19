const express = require('express') 
const cors = require('cors')
const app = express()

const port = process.env.PORT || 1000
require('dotenv').config()

// midleware 

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
  res.send("Kids toy surver is runing")
})


app.listen(port,()=>{
  console.log(`Surver is running on port ${port}`)
})