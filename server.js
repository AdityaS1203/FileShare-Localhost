const express=require("express");
const app=express();
const PORT=3000||process.env.PORT;
const bodyParser=require("body-parser");
const connectDB = require('./config/db')
connectDB()

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show'))
app.use('/files/download',require('./routes/download'))
app.use(express.json())//middleware that allows to parse the json data

app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",function(req,res){
res.render("index");
});


app.listen(PORT,function(){
  console.log("port for file sharing is running");
})
