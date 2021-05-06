require('dotenv').config();
const express = require('express');
const path = require('path');
const {OAuth2Client} = require('google-auth-library');
const con = require('./config/db.js');
const app = express();
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const checkUser = require('./checkUser');
const e = require('express');
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
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname,'images')));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// =============== Page routes ==================


app.get('/index',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
        // res.render('index',{user: req.session.user});
   

});

app.get('/userrecord',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/user_history_edit.html"));
        // res.render('index',{user: req.session.user});
   

});


app.get('/status',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/statususer.html"));
        // res.render('index',{user: req.session.user});
   
});
app.get('/inven',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/inven.html"));
        // res.render('index',{user: req.session.user});
   

});

app.get('/manageuser',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/manage_user.html"));
        // res.render('index',{user: req.session.user});
   

});

app.get('/adminrequest',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/admin-request.html"));
        // res.render('index',{user: req.session.user});
   

});

app.get('/stats',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/adminstats.html"));
        // res.render('index',{user: req.session.user});
   

});
app.get('/adminrecord',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/admin-record.html"));
        // res.render('index',{user: req.session.user});

});
app.get('/userrequest',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/request.html"));
        // res.render('index',{user: req.session.user});

});
app.get('/userrecord',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/user_history_edit.html"));
        // res.render('index',{user: req.session.user});

});
app.get('/leaderstats',checkUser,(req,res) => {
    res.sendFile(path.join(__dirname, "/leaderstats.html"));
        // res.render('index',{user: req.session.user});

});

app.get('/', (req,res) => {
    if(req.session.user){
            res.redirect('/index');
    }
    else{
        res.render('login');
    }
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

app.get("/indexitem", function (req, res) {
    const sql = "SELECT product_no,product_id,name_pro,amount_pro,unit_pro FROM product";
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

app.get("/userhis", function (req, res) {
    const sql = "SELECT requis_id,requis_pickup,product_id,name_pro,purpose,requis_quantity,unit_pro FROM requisition INNER JOIN product ON requis_id = product_no";
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
            let i;
            for (i=0;i<result.length;i++){
                let d = new Date(result[i].requis_pickup);
                let Year = d.getFullYear();
                let Month = d.getMonth() + 1;
                let date = d.getDate();
                result[i].requis_pickup = date + '/' + Month + '/' + Year;
            }
      
            res.json(result);
        }
    });
});

app.get("/adminreq", function (req, res) {
    const sql = "SELECT requis_date, requis_id, F_name, L_name, email, requis_status FROM requisition INNER JOIN user ON requis_id = User_id";
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
            let i;
            for (i=0;i<result.length;i++){
                let d = new Date(result[i].requis_date);
                let Year = d.getFullYear();
                let Month = d.getMonth() + 1;
                let date = d.getDate();
                result[i].requis_date = date + '/' + Month + '/' + Year;
            }
            //return json of recordset
            res.json(result);
        }
    });
});


app.get("/inventory", function (req, res) {
    const sql = "SELECT product_id,addDate,name_pro,amount_pro,unit_pro FROM product";
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
            let i;
            for (i=0;i<result.length;i++){
                let d = new Date(result[i].addDate);
                let Year = d.getFullYear();
                let Month = d.getMonth() + 1;
                let date = d.getDate();
                result[i].addDate = date + '/' + Month + '/' + Year;
            }
            res.json(result);
        }
    });
});
app.post("/additem", (req, res) => {
    // console.log(req.body);
    const addDate = req.body.add_date;
    const product_id = req.body.add_id;
    const name_pro = req.body.add_name;
    const amount_pro = req.body.add_amount;
    const unit_pro = req.body.add_count;
    const sql = "INSERT INTO product (addDate,product_id,name_pro,amount_pro,unit_pro) VALUES (?,?,?,?,?)";
            con.query(sql, [addDate, product_id, name_pro, amount_pro, unit_pro], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send("Database server error.");
                } else {
                    if (result.affectedRows == 1) {
                        res.send("New item has been added.");
                    } else {
                        res.status(501).send("Error while adding new item.");
                    }
                }
            });
});


app.get("/manage", function (req, res) {
    const sql = "SELECT F_name,L_name,email,role FROM user";
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


app.get("/manageedit", function (req, res) {
    const F_name = req.body.F_name;
    const L_name = req.body.L_name;
    const email = req.body.email;
    const role = req.body.role;
    const sql = "UPDATE user SET F_name=?,L_name=?,email=?,role=? WHERE User_id = ?";
    con.query(sql, [F_name,L_name,email,role], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).end("Server error");
        }else{
            res.send("Change complete!!.");
        }
    });

});


app.get("/adduser", function (req, res) {
    const F_name = req.body.F_name;
    const L_name = req.body.L_name;
    const email = req.body.email;
    const role = req.body.role;

    const sql = "INSERT INTO user (F_name,L_name,email,role) VALUES (?,?,?,?)";
    database.query(sql, [F_name, L_name,email, role], function(err, result){
        if (err) {
            res.status(500).send("Database server error.");
        } else {
            if (result.affectedRows == 1) {
                res.send("New user has been added.");
            } else {
                res.status(501).send("Error while adding new user.");
            }
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
   if(result[0].role == 0){
    return  res.status(500).send('Inactive member');
   }
   // console.log(email);

   //save user data to session 
   req.session.user = {'username': payload.name,'User_id': result[0].User_id,'role': result[0].role};  
   if(result[0].role == 2){
    res.send('/index');
   }else if(result[0].role == 1){
    res.send('/adminrequest')
   }else if(result[0].role == 3){
       res.send('/leaderstats')
   }else if(result[0].role == 4){
       res.send('/manageuser')
   }
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