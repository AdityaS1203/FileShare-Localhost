//for database configuration
require("dotenv").config();
const mongoose=require("mongoose");

function connectDB(){
  //url provided by mongoDB atlas for creating DB in cloud
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true});
  const connection=mongoose.connection;

  connection.once('open',()=>{
    console.log("Database connected");
  })
  .on('error',(err)=>{
    console.log("Database connection failed");
  })
}

module.exports=connectDB;