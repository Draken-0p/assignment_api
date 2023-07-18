const express = require('express');
const app = express();
const getroute = require('./routes/getroute.js')
require("dotenv").config();
app.use(express.json());

app.use("/api/",getroute);


app.get('/',(req,res)=>{
    res.send("welcome to new app");
  })
  
  
  
  
  const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
  );
  