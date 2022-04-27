const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  }
});

db.select('*').from('users').then(data => {
  console.log(data);
});

const app = express();

app.use(express.json());
app.use(cors());


app.get("/", (res) => {
  res.send('its working');
});

app.post("/signin", (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt,saltRounds)});

app.get("/profile/:id", (req, res) => {profile.handleProfileGet(req, res, db)});

app.put("/image", (req,res) => {image.handleImage(req,res,db)})

app.post("/imageurl", (req,res) => {image.handleApiCall(req,res)})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});




/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user 
/image --> PUT --> user
*/
