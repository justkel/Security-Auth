
require('dotenv').config();   //environment variable
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");   // LVL 2
// const md5 = require("md5")   //LVL 3
const bcrypt = require("bcrypt");   // LVL 4
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({   //format introduced as a requirement of mongoose-encryption
  email: String,
  password: String
})

// const secret = process.env.SECRET
// userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res){
  res.render("home")
})

app.get("/login", function(req, res){
  res.render("login")
})

app.get("/register", function(req, res){
  res.render("register")
})

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User ({
      email: req.body.username,
      password: hash
    })
    newUser.save(function(err){
      if(!err){
        res.render("secrets")
      } else {
        console.log(err);
      }
    })
});

})

app.post("/login", function(req, res){
  const username = req.body.username
  const password = (req.body.password)

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result === true){
            res.render("secrets")
          }
        });
      }
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
