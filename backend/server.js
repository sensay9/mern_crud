const express=require("express");
const { default: mongoose } = require("mongoose");
const app=express();
const PORT =5000;
const cors = require("cors");

app.use(cors())
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mernstack_crud').then(()=>{
    console.log("DB connection successfull")
})
.catch((error) => {
    console.log(error);
});

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password:{
        type: String,
        required: true
    }
},
{timestamps:true
})

const User = mongoose.model("User", userSchema, "my_users");

app.post("/createuser", async (req, res) => {
    try {
        const bodyData = req.body;
        const user = new User(bodyData);
        const userData = await user.save();
        res.send(userData);
    } catch (error) {
        if (error.errors && error.errors.email && error.errors.email.kind === 'unique') {
            res.status(400).send('Email already exists. Please use a different email.');
        } else {
            res.status(400).send(error);
        }
    }
});

app.get("/readalluser",async(req,res) =>{
    try{
        const userData = await User.find({})
        res.send(userData)
    }catch{
        res.send(error)
    }
})


app.get("/read/:id",async(req,res) => {
    //res.send("from get route");
    try{
        const id = req.params.id;
        const user = await User.findById({_id: id})
        res.send(user)
    }catch{
        res.send(error)
    }
});

app.put("/updateuser/:id",async(req,res) => {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndUpdate({_id:id},req.body,{new:true})
        res.send(user)
    }catch{
        res.send(error)
    }
})

app.delete("/deleteuser/:id", async(req,res) =>{
    try{
        const id = req.params.id;
        const user = await User.findByIdAndDelete({_id:id})
        if(!user){
            return res.status(404).send("User not found")
        }
        res.send("User Deleted")
    }catch (error){
        console.error(error);
        res.status(500).send("Error deleting user");
    }
})

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
});