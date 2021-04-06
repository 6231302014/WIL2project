require('dotenv').config();
const express = require('express');
const path = require('path');
const {OAuth2Client} = require('google-auth-library');


const app = express();
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'vendo')));
app.use(express.static(path.join(__dirname,'assets')));
app.use(express.static(path.join(__dirname,'css')));
app.use(express.static(path.join(__dirname,'images')));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/',(req,res) => {
 res.render('login');
});

const client = new OAuth2Client(process.env.CLIENT_ID);
app.post('/verifyUser',(req,res) =>{
 const token = req.body.token;
 if(token){-
   client.verifyIdToken({
       idToken: token,
       audience: process.env.CLIENT_ID
   }).then((ticket)=>{
       const payload = ticket.getPayload();
       console.log(payload);
       res.end();
   }).catch((err)=>{
       console.log(err);
       res.status(400).send('Token is invalid');
   })
 }else{
     console.log('No token');
     res.status(400).send('No token');
 }
 
});

const PORT = process.env.PORT;

app.listen(PORT, () =>{
 console.log('Server starts at ' + PORT);
});