require('dotenv').config();
const express = require('express');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const con = require('./config/db.js');
const app = express();
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const checkUser = require('./checkUser');
const e = require('express');
//================= Session Management ================
app.use(session({
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
    store: new MemoryStore({
        checkPeriod: 24 * 60 * 60 * 1000
    }),
    secret: process.env.SESSTION_SECRET,
    resave: true,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'vendo')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// =============== Page routes ==================


app.get('/index', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
    // res.render('index',{user: req.session.user});


});

app.get('/userrecord', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/user_history_edit.html"));
    // res.render('index',{user: req.session.user});


});


app.get('/status', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/statususer.html"));
    // res.render('index',{user: req.session.user});

});
app.get('/inven', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/inven.html"));
    // res.render('index',{user: req.session.user});


});

app.get('/manageuser', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/manage_user.html"));
    // res.render('index',{user: req.session.user});


});

app.get('/adminrequest', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/admin-request.html"));
    // res.render('index',{user: req.session.user});


});

app.get('/stats', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/adminstats.html"));
    // res.render('index',{user: req.session.user});


});
app.get('/adminrecord', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/admin-record.html"));
    // res.render('index',{user: req.session.user});

});
app.get('/userrequest', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/request.html"));
    // res.render('index',{user: req.session.user});

});
app.get('/userrecord', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/user_history_edit.html"));
    // res.render('index',{user: req.session.user});

});
app.get('/leaderstats', checkUser, (req, res) => {
    res.sendFile(path.join(__dirname, "/leaderstats.html"));
    // res.render('index',{user: req.session.user});

});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/index');
    }
    else {
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
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            res.json(result);
        }
    });
});

app.post("/requestitem", (req, res) => {
    let sql = "INSERT INTO requisition (requis_date,requis_proid,requis_pro,requis_quantity,requis_count,purpose) VALUES ?";
    let test = [[req.body.requis_date, req.body.requis_proid, req.body.requis_pro, req.body.requis_quantity,req.body.requis_count, req.body.purpose]];
    con.query(sql, [test], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database server error.");
        } else {
            if (result.affectedRows == 1) {
                res.send("คำขอเบิกสำเร็จ");
            } else {
                res.status(501).send("คำขอเบิกไม่สำเร็จ");
            }
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
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            res.json(result);
        }
    });
});

app.get("/userhis", function (req, res) {
    //console.log(res);
    const sql = "SELECT requis_id,requis_pickup,requis_proid,requis_pro,purpose,requis_quantity,requis_count FROM requisition";
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }

        const numrows = result.length;
        //if no data
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            let i;
            for (i = 0; i < result.length; i++) {
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
    //console.log(req);
    const sql = "SELECT  requis_date, requis_id, F_name, L_name, requis_proid,requis_pro,requis_quantity,requis_count, requis_status FROM requisition INNER JOIN user ON requis_id = User_id "; // ?
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }
        const numrows = result.length;
        //if no data
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            let i;
            for (i = 0; i < result.length; i++) {
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
app.post("/adminapp", function (req, res) {
    const requis_proid = req.body.request_proid;
    const requis_status = req.body.requis_status;
    const requis_quantity = req.body.requis_quantity;
    const sql = "UPDATE product SET requis_quantity = ?, requis_status = 1 WHERE requis_proid = ?";
    con.query(sql, [requis_quantity,requis_status,requis_proid], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).end("Server error");
        } else {
            res.send(result);
        }
    });
});



app.get("/moreinfo", function (req, res) {
   // console.log(req);
    const sql = "SELECT  requis_proid,requis_pro,requis_quantity,requis_count,purpose FROM requisition"; // ?
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }
        const numrows = result.length;
        //if no data
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            let i;
            for (i = 0; i < result.length; i++) {
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




//------------ Inventory -------------
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
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            let i;
            for (i = 0; i < result.length; i++) {
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
    //console.log(req.body);
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

//----------------- Manageuser -----------------------------------
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
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            //return json of recordset
            res.json(result);
        }
    });
});

app.post("/manageedit", function (req, res) {
    // console.log(req);
    const email = req.body.email;
    const role = req.body.role;
    const sql = "UPDATE user SET role = ? WHERE email = ?";
    con.query(sql, [role, email], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).end("Server error");
        }
        const numrows = result.length;
        //if no data
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            res.send(result);
        }
    });
});

app.post("/adduser", (req, res) => {
    //console.log(req.body);
    const F_name = req.body.add_fname;
    const L_name = req.body.add_lname;
    const email = req.body.add_email;
    const role = req.body.add_role;
    const sql = "INSERT INTO user (F_name,L_name,email,role) VALUES (?,?,?,?)";
    con.query(sql, [F_name, L_name, email, role], function (err, result) {
        if (err) {
            console.log(err);
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



//----------------------Edit Item --------------------------------

app.post("/itemedit", function (req, res) {
    //console.log(req);
    const product_id = req.body.product_id;
    const amount_pro = req.body.amount_pro;
    const sql = "UPDATE product SET amount_pro = ? WHERE product_id = ?";
    con.query(sql, [amount_pro, product_id], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).end("Server error");
        } else {
            res.send(result);
        }
    });
});

//-----------------------------------------------------------
// delete item
app.delete("/inven/:product_id", function (req, res) {
    const product_id = req.params.product_id;
    const sql = "DELETE FROM product WHERE product_id=?";
    con.query(sql, [product_id], function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server error");
            return;
        }

        // get deleted rows
        // console.log('Row deleted:' + result.affectedRows);
        const numrows = result.affectedRows;
        if (numrows != 1) {
            res.status(500).send("Delete failed");
        }
        else {
            res.send("Deleted!");
        }
    });
});
//---------------- stat ---------------------------------
app.get("/statitem", function (req, res) {
    const sql = "SELECT requis_pickup,requis_proid, requis_pro,requis_quantity, requis_status,unit_pro FROM requisition INNER JOIN product ON requis_id = product_no WHERE  requis_status = 2";
    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }

        const numrows = result.length;
        //if no data
        if (numrows == 0) {
            res.status(500).send("No data");
        }
        else {
            let i;
            for (i = 0; i < result.length; i++) {
                let d = new Date(result[i].requis_pickup);
                let Year = d.getFullYear();
                let Month = d.getMonth() + 1;
                let date = d.getDate();
                result[i].requis_pickup = date + '/' + Month + '/' + Year;
            }
            //return json of recordset
            res.json(result);
        }
    });
});


// =============== Other routes ==================
const client = new OAuth2Client(process.env.CLIENT_ID);
app.post('/verifyUser', (req, res) => {
    const token = req.body.token;
    if (token) {
        client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        }).then((ticket) => {
            const payload = ticket.getPayload();
            //    console.log(payload);
            const email = payload.email;
            // TODO: verrify user with DB
            const sql = 'SELECT * FROM user WHERE email = ?';
            con.query(sql, [email], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Database error');
                }
                // check whether the user is our member
                if (result.length != 1) {
                    return res.status(500).send('Not a member');
                }
                // check whether the use is active
                if (result[0].role == 0) {
                    return res.status(500).send('Inactive member');
                }
                // console.log(email);

                //save user data to session 
                req.session.user = { 'username': payload.name, 'User_id': result[0].User_id, 'role': result[0].role };
                res.status(200).json(result[0]);

            });

        }).catch((err) => {
            console.log(err);
            res.status(400).send('Token is invalid');
        })
    } else {
        console.log('No token');
        res.status(400).send('No token');
    }

});

app.get('/logout', (req, res) => {
    //destroy all session
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log('Server starts at ' + PORT);
});