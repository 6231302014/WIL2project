require('dotenv').config();
const express = require('express');
const path = require('path');
const {OAuth2Client} = require('google-auth-library');
const con = require('./config/db.js');
const app = express();
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const checkUser = require('./checkUser');
//================= Session Management ================
app.use(session({
   cookie:{maxAge: 24*60*60*1000, httpOnly:true},
   store: new MemoryStore({
       checkPeriod: 24*60*60*1000
   }),
   secret: process.env.SESSTION_SECRET,
   resave: true,
   saveUninitialized: false
}));


app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'vendo')));
app.use(express.static(path.join(__dirname,'assets')));
app.use(express.static(path.join(__dirname,'css')));
app.use(express.static(path.join(__dirname,'css2')));
app.use(express.static(path.join(__dirname,'images')));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'js')));
app.use(express.static(path.join(__dirname,'lbs')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// =============== Page routes ==================
app.get('/',(req,res) => {
    if(req.session.user){
        res.redirect('/index');
    }else{
        res.render('login');
    }
});

app.get('/index',checkUser,(req,res) => {
        res.render('index',{user: req.session.user});
   

});

app.get("/users", function (req, res) {
    const sql = "SELECT User_id,F_name, L_name, email, role FROM user";
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }           
 
        const numrows = result.length;
        //if no data
        if(numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            res.json(result);
        }
    });
});



// =============== Other routes ==================
const client = new OAuth2Client(process.env.CLIENT_ID);
app.post('/verifyUser',(req,res) =>{
 const token = req.body.token;
 if(token){
       client.verifyIdToken({
       idToken: token,
       audience: process.env.CLIENT_ID
   }).then((ticket)=>{
       const payload = ticket.getPayload();
    //    console.log(payload);
    const email = payload.email;
    // TODO: verrify user with DB
    const sql = 'SELECT  User_id , role FROM user WHERE email = ?';
    con.query(sql,[email],(err,result) =>{
     if(err){
     console.log(err);
    return  res.status(500).send('Database error');
   } 
   // check whether the user is our member
    if(result.length != 1){
    return  res.status(500).send('Not a member');
    }
    // check whether the use is active
   if(result[0].role ==0){
    return  res.status(500).send('Inactive member');
   }
   // console.log(email);

   //save user data to session 
   req.session.user = {'username': payload.name,'User_id': result[0].User_id,'role': result[0].role};  
   res.send('/index');
    });
   }).catch((err)=> {
       console.log(err);
       res.status(400).send('Token is invalid');
   })
 }else{
     console.log('No token');
     res.status(400).send('No token');
 }
 
});

app.get('/logout', (req,res) => {
    //destroy all session
 req.session.destroy((err) => {
    if(err){
        console.log(err);
    }
    res.redirect('/');
 });
});

const PORT = process.env.PORT;

app.listen(PORT, () =>{
 console.log('Server starts at ' + PORT);
});