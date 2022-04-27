const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");


const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : '4q2buddy',
    database : 'face-brain'
  }
});

db.select('*').from('users').then(data => {
  console.log(data);
});

const app = express();

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send('success');
});

app.post("/signin", (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt,saltRounds)});

app.get("/profile/:id", (req, res) => {profile.handleProfileGet(req, res, db)});

app.put("/image", (req,res) => {image.handleImage(req,res,db)})

app.post("/imageurl", (req,res) => {image.handleApiCall(req,res)})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});




/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user 
/image --> PUT --> user
*/
