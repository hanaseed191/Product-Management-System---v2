//Connect Mysql 
const express = require('express');
const app = express();
const mysql = require('mysql');
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "devint"
});

// Check Connect Database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

// Middleware
app.use(express.json());

// API Endpoint: Select Database
app.get('/products', (req, res) => {
    const sql = `SELECT * FROM products`;
    con.query(sql, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  });
  
// API Endpoint: Insert Data
app.post('/products', (req, res) => {
  const productData = req.body;
  const sql = `INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)`;
  con.query(sql, [productData.name, productData.category, productData.price, productData.stock], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send('Insert successfully');
    }
  });
});

// API Endpoint: Update Data
app.put('/products/:id', (req, res) => {
    const id = req.params.id;
    // Check ID -> Product in Table products 
    const sql = `SELECT * FROM products WHERE id = ${id}`;
    con.query(sql, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (results.length === 0) {
          res.status(404).send("Product not found");
        } else {
          // Update Data
          const updateSql = `UPDATE products SET
            name = ?,
            category = ?,
            price = ?,
            stock = ?
            WHERE id = ${id}`;
          con.query(updateSql, [
            req.body.name || results[0].name,
            req.body.category || results[0].category,
            req.body.price || results[0].price,
            req.body.stock || results[0].stock
          ], (err, result) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send('Updated successfully');
            }
          });
        }
      }
    });
  });

// API Endpoint: Delete Data
app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    // Check ID -> Product in Table products 
    const sql = `SELECT * FROM products WHERE id = ${id}`;
    con.query(sql, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (results.length === 0) {
          res.status(404).send("Product not found");
        } else {
          // ลบสินค้า
          const deleteSql = `DELETE FROM products WHERE id = ${id}`;
          con.query(deleteSql, (err, result) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send('Deleted successfully');
            }
          });
        }
      }
    });
  });

// Run Server Port:3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
