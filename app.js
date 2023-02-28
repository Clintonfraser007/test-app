const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');
const app = express();
const db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'Jesus@*&6372',
  database:'test'
});

db.connect((err)=>{
  if(err) throw err;
  else {
    console.log('database connected successfully');
  }
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

// home page
app.get('/',(req,res)=>{
  res.render('home')
});

// home page
// creation of Table in database

app.get('/createnewtable',(req,res)=>{
  const sql = 'CREATE TABLE customers(id INT(11) NOT NULL AUTO_INCREMENT,firstName VARCHAR(255),lastName VARCHAR(255),email VARCHAR(255),PRIMARY KEY(id))';
  db.query(sql,(err,result)=>{
    if(err) res.send(err.sqlMessage);
    else {
      res.send('Table created successfully...');
    }
  });
});
// creation of Table in database
// Inserting new Records
app.get('/insertRecords',(req,res)=>{
  res.render('insertRecords');
});
// Inserting new Records

// Viewing inserted Records
app.get('/getRecords',(req,res)=>{
  const mysql = 'SELECT * FROM customers';
  db.query(mysql,(err,result)=>{
    if(err) throw err;
    else {
      res.render('getRecords',{results:result})
    }
  })
});
// Viewing inserted Records

// Viewing one Records
app.get('/getRecords/:id',(req,res)=>{
  const mysql = 'SELECT * FROM customers WHERE ID= '+req.params.id;
  db.query(mysql,(err,result)=>{
    if(err) throw err;
    else {
      res.render('getRecords',{results:result});
    }
  })
})

// Viewing one Records

// deleting single Record
app.get('/delete/:id',(req,res)=>{
  const mysql = 'DELETE from customers WHERE ID = '+req.params.id;
  db.query(mysql,(err,result)=>{
    if(err) throw err;
    else {
      res.redirect('/getRecords');
    }
  })
});

// deleting single Record

// deleting All Records
app.get('/deleteallrecords',(req,res)=>{
  const mysql = 'TRUNCATE TABLE customers';
  db.query(mysql,(err,result)=>{
    if(err) throw err;
    else {
      res.redirect('/getRecords');

    }
  })
});

// deleting all Records

app.get('/updateRecord/:id',(req,res)=>{
  const mysql = 'SELECT * FROM customers WHERE ID = '+req.params.id;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;

  db.query(mysql,(err,result)=>{
    if(err) throw err;
    else {
      res.render('updateRecords',{
        id:result[0].id,
        firstName:result[0].firstName,
        lastName:result[0].lastName,
        email:result[0].email
      });
    }
  })
})
// Update each Record
app.post('/updateRecord/:id',(req,res)=>{
  const updates ={
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email
  };
  const mysql = 'UPDATE customers SET? WHERE ID = '+req.params.id;
  db.query(mysql,updates,(err,result)=>{
    if(err) throw err;
    else {
      res.redirect('/getRecords');
    }
  })

})





// post route for insertRecords
app.post('/insertRecords',(req,res)=>{
  const dataPosted = {
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email
  };
  const mysql = 'INSERT INTO customers SET ?';
  db.query(mysql,dataPosted,(err,result)=>{
    if(err) throw err.sqlMessage;
    else {
      res.redirect('/insertRecords');
    }
  });
});

// post route for insertRecords

const PORT = 4000;

app.listen(process.env.PORT || PORT);

console.log(`the server is up at PORT ${PORT}`);
