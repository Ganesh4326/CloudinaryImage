const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser');

const app = express()
const cors = require("cors")
app.use(cors())

app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));

const collection=require('./models/LoginSchema')
const collection2=require('./models/PostSchema')
app.use(express.json())

require('dotenv').config()

const PORT = process.env.port || 5000

mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("Connected to mongodb.."))
.catch((err) => console.log(err))

// app.use(routes)
app.listen(PORT,() => console.log(`listening on : {$PORT}`))

app.get("/", (req,res)=>{

})

app.post("/login", async(req,res)=>{
    const {email,password}=req.body

    const data={
        email:email,
        password:password
    }
    
    try{
        const check=await collection.findOne({email:email}).populate('user',['firstname','lastname']);
        if(check){
            console.log(check.user.firstname)
            res.json(check.user)
        }
        else{
            res.json("not exist")
        }
    }
    catch(e){
        console.log(e)
    }
})

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
}

app.post("/signup", async(req,res)=>{
    const {firstname,lastname,email,password,repassword}=req.body

    const data={
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:password,
        repassword:repassword
    }
    
    if(validatePassword(data.password)==false){
        res.json("invalidpassword")
    }

    try {
        const emailToCheck = data.email;
        const user = await collection.findOne({ email: emailToCheck }).exec();
        if (user) {
            res.json("exist")
        } 
      } catch (err) {
        console.error(err);
      }


    if(data.password===data.repassword){
        try{
            await collection.insertMany([data])
            res.json("ok")
        }
        catch(e){
            console.log(e)
        }
    }
    else{
        res.json("unmatch")
    }
    
})


app.post("/post", async(req,res)=>{
    const {image, title, message, tags, likeCount, postType}=req.body
    console.log(postType)
    const data={
        image:image,
        title:title,
        message:message,
        tags:tags,
        likeCount:likeCount,
        postType:postType
    }
    
    try{
        await collection2.insertMany([data])
        res.json("posted")
    }
    catch(e){
        console.log(e)
    }
})

app.get("/getPosts",async (req, res) => {
    try{
        const postData = await collection2.find({});
        res.send({status:"ok", data:postData});
    }catch(e){
        console.log("error = " ,e);
    }
})

app.post("/updateLikeCount/:email", async (req, res) => {
    const { email } = req.params;
    const { likeCount } = req.body;
  
    try {
      const post = await collection2.findByIdAndUpdate(email, { likeCount: likeCount }, { new: true });
      res.json("posted lc:",post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  